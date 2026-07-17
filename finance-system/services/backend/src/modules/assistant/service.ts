import { AiConversationRole } from '@prisma/client'
import { creditService } from '../credit/service'
import { assistantRepository } from './repository'
import { AssistantQuestionInput } from './types'

export const assistantService = {
  async ask(userId: string, input: AssistantQuestionInput) {
    await assistantRepository.saveMessage(userId, AiConversationRole.USER, input.question)
    const context = await assistantRepository.getFinancialContext(userId, input.profileId)
    const lowerQuestion = input.question.toLowerCase()
    const answer = lowerQuestion.includes('emprestimo') ||
      lowerQuestion.includes('empréstimo') ||
      lowerQuestion.includes('credito') ||
      lowerQuestion.includes('crédito') ||
      lowerQuestion.includes('financiamento')
      ? creditService.formatAnalysisForAssistant(await creditService.analyze(userId, { profileId: input.profileId }))
      : lowerQuestion.includes('guardar') || lowerQuestion.includes('economizar')
      ? `Neste mês, sua renda registrada é R$ ${context.income.toFixed(2)} e suas despesas somam R$ ${context.expenses.toFixed(2)}. Um alvo conservador seria guardar parte do saldo livre antes de novas compras.`
      : lowerQuestion.includes('gastei') || lowerQuestion.includes('gastos')
        ? `Você tem ${context.transactions.length} transações no mês, com despesas de R$ ${context.expenses.toFixed(2)}. As maiores oportunidades aparecem por categoria no dashboard/orçamento.`
        : 'Ainda sou um assistente mockado, mas já consigo ler seu contexto financeiro e responder perguntas básicas sobre gastos, economia e orçamento.'
    await assistantRepository.saveMessage(userId, AiConversationRole.ASSISTANT, answer, { provider: 'mock' })
    return { answer, provider: 'mock' }
  },
}
