import { FinancialProfileType } from '@prisma/client'
import { creditRepository } from './repository'
import { CreditAnalysisInput, CreditProviderOption } from './types'

const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, value))

function calculatePrincipal(installment: number, months: number, monthlyRate: number) {
  if (monthlyRate <= 0) return installment * months
  return installment * ((1 - (1 + monthlyRate) ** -months) / monthlyRate)
}

function nextBestDate() {
  const now = new Date()
  const candidate = new Date(now.getFullYear(), now.getMonth(), 5)
  if (now.getDate() > 8) candidate.setMonth(candidate.getMonth() + 1)
  return candidate.toISOString().slice(0, 10)
}

function buildProviderOptions(input: {
  bankNames: string[]
  score: number
  profileType?: FinancialProfileType
  monthlyIncome: number
  balance: number
}): CreditProviderOption[] {
  const options: CreditProviderOption[] = []
  const primaryBanks = [...new Set(input.bankNames)].slice(0, 3)

  primaryBanks.forEach((bankName) => {
    options.push({
      name: bankName,
      type: 'CONNECTED_BANK',
      fit: input.score >= 65 ? 'HIGH' : 'MEDIUM',
      reason: 'Instituição já conectada/registrada no app; histórico e relacionamento podem ajudar na avaliação.',
      nextStep: 'Simular crédito no app/site do banco e comparar CET, prazo e seguros embutidos.',
    })
  })

  options.push({
    name: 'Marketplace de crédito autorizado',
    type: 'CREDIT_MARKETPLACE',
    fit: input.score >= 55 ? 'MEDIUM' : 'LOW',
    reason: 'Permite comparar várias instituições sem aceitar a primeira oferta.',
    nextStep: 'Buscar propostas com CET total e evitar contratos com tarifas escondidas.',
  })

  if (input.monthlyIncome > 0) {
    options.push({
      name: 'Crédito com renda comprovada',
      type: 'PAYROLL',
      fit: input.score >= 60 ? 'HIGH' : 'MEDIUM',
      reason: 'Renda recorrente melhora previsibilidade de pagamento.',
      nextStep: 'Separar comprovante de renda, extratos e verificar se consignado/garantia se aplica ao seu caso.',
    })
  }

  if (input.balance > 0) {
    options.push({
      name: 'Crédito com garantia ou relacionamento',
      type: 'SECURED_LOAN',
      fit: 'MEDIUM',
      reason: 'Garantia ou saldo positivo pode reduzir risco percebido, mas exige cuidado com perda do bem/garantia.',
      nextStep: 'Comparar custo total e risco antes de usar garantia.',
    })
  }

  if (input.profileType === FinancialProfileType.BUSINESS) {
    options.push({
      name: 'Capital de giro PJ',
      type: 'BUSINESS_CREDIT',
      fit: input.score >= 60 ? 'HIGH' : 'MEDIUM',
      reason: 'Perfil PJ pode buscar crédito para fluxo de caixa, estoque ou antecipação de recebíveis.',
      nextStep: 'Simular capital de giro e antecipação de recebíveis comparando CET e impacto no caixa.',
    })
  }

  return options
}

async function analyzeCredit(userId: string, input: CreditAnalysisInput = {}) {
  const context = await creditRepository.getContext(userId, input.profileId)
  const monthlyIncome = context.monthlyIncome
  const committed = context.pendingBills + context.paidExpenses + context.cardUsed
  const freeCash = monthlyIncome - context.pendingBills - context.paidExpenses
  const cardUsage = context.cardLimit > 0 ? context.cardUsed / context.cardLimit : 0
  const debtToIncome = monthlyIncome > 0 ? committed / monthlyIncome : 1
  const safeInstallment = Math.max(0, Math.min(monthlyIncome * 0.22, freeCash * 0.45))
  const requestedInstallments = input.installments ?? 24
  const conservativeMonthlyRate = Number(process.env.CREDIT_ANALYSIS_MONTHLY_RATE ?? 0.035)
  const estimatedPrincipal = calculatePrincipal(safeInstallment, requestedInstallments, conservativeMonthlyRate)
  const requestedAmount = input.requestedAmount
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        68 +
          (monthlyIncome > 0 ? 10 : -20) +
          (freeCash > 0 ? 12 : -18) +
          (debtToIncome <= 0.35 ? 12 : debtToIncome <= 0.55 ? 2 : -16) +
          (cardUsage <= 0.5 ? 8 : cardUsage <= 0.75 ? 0 : -12) +
          (context.balance > 0 ? 6 : 0),
      ),
    ),
  )
  const maxRecommendedAmount = Math.floor(estimatedPrincipal)
  const requestStatus = requestedAmount
    ? requestedAmount <= maxRecommendedAmount
      ? 'O valor solicitado parece caber na faixa segura estimada.'
      : 'O valor solicitado parece acima da faixa segura estimada; reduza valor, aumente prazo ou reorganize despesas.'
    : 'Informe um valor desejado para comparar com sua capacidade estimada.'
  const bankNames = [...context.accounts.map((account) => account.bankName), ...context.connections.map((connection) => connection.bankName)]
  const providerOptions = buildProviderOptions({
    bankNames,
    score,
    profileType: context.profile?.type,
    monthlyIncome,
    balance: context.balance,
  })

  return {
    disclaimer:
      'Análise estimada com base nos dados cadastrados/importados. Não garante aprovação, taxa ou oferta. Compare sempre o CET total antes de contratar.',
    score,
    riskLevel: score >= 75 ? 'LOW' : score >= 55 ? 'MEDIUM' : 'HIGH',
    monthlyIncome,
    committed,
    freeCash,
    debtToIncome: Number(debtToIncome.toFixed(2)),
    cardUsage: Number(cardUsage.toFixed(2)),
    safeInstallment,
    estimatedAmountRange: {
      min: Math.floor(maxRecommendedAmount * 0.65),
      max: maxRecommendedAmount,
      formatted: `${money(maxRecommendedAmount * 0.65)} a ${money(maxRecommendedAmount)}`,
    },
    requestedAmount,
    requestedInstallments,
    requestStatus,
    bestDate: {
      date: nextBestDate(),
      reason: 'Preferencialmente logo após receber renda e antes de comprometer o mês com cartão/contas.',
    },
    bestBenefitStrategy: [
      'Compare CET total, não apenas juros mensal.',
      'Use o banco onde recebe renda ou tem maior relacionamento como primeira simulação.',
      'Evite contratar quando o cartão estiver acima de 75% do limite.',
      'Se o objetivo for quitar dívida cara, só vale se a nova parcela reduzir o custo total.',
    ],
    howToImproveApproval: [
      'Atualize renda, contas e cartões com dados reais.',
      'Pague ou renegocie pendências antes de simular.',
      'Reduza uso de cartão e evite novas parcelas antes da análise.',
      'Separe comprovante de renda, extratos e finalidade do empréstimo.',
    ],
    providerOptions,
  }
}

function formatAnalysisForAssistant(analysis: Awaited<ReturnType<typeof analyzeCredit>>) {
    const bestProviders = analysis.providerOptions
      .slice(0, 3)
      .map((provider: CreditProviderOption) => `${provider.name} (${provider.fit})`)
      .join(', ')

    return [
      `Fiz uma análise estimada de crédito com seus dados reais.`,
      `Score interno: ${analysis.score}/100, risco ${analysis.riskLevel}.`,
      `Parcela segura estimada: ${money(analysis.safeInstallment)}.`,
      `Faixa de empréstimo estimada: ${analysis.estimatedAmountRange.formatted} em ${analysis.requestedInstallments}x.`,
      `Melhor janela: ${analysis.bestDate.date}, ${analysis.bestDate.reason.toLowerCase()}`,
      `Onde buscar primeiro: ${bestProviders || 'cadastre/conecte bancos para eu sugerir instituições com base no seu relacionamento.'}`,
      analysis.requestStatus,
      `Importante: ${analysis.disclaimer}`,
    ].join(' ')
}

export const creditService = {
  analyze: analyzeCredit,
  formatAnalysisForAssistant,
}
