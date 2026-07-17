import { BankAccountType, CardBrand, InvestmentLiquidity, InvestmentRisk, InvestmentType, TransactionForm, TransactionType } from '@prisma/client'
import { OpenFinanceImportInput, PluggyApiKeyInput, PluggyConnectTokenInput, PluggyImportInput } from './types'

const DEFAULT_PLUGGY_API_URL = 'https://api.pluggy.ai'
const API_KEY_TTL_MS = 1000 * 60 * 90

let cachedApiKey: { value: string; expiresAt: number } | null = null

type JsonRecord = Record<string, any>

function pluggyBaseUrl() {
  return (process.env.PLUGGY_API_URL ?? DEFAULT_PLUGGY_API_URL).replace(/\/$/, '')
}

function envCredential(input: PluggyApiKeyInput | PluggyConnectTokenInput | PluggyImportInput) {
  const credentialInput = input as PluggyApiKeyInput & Partial<PluggyConnectTokenInput & PluggyImportInput>
  return {
    apiKey: credentialInput.apiKey ?? process.env.PLUGGY_API_KEY,
    clientId: credentialInput.clientId ?? process.env.PLUGGY_CLIENT_ID,
    clientSecret: credentialInput.clientSecret ?? process.env.PLUGGY_CLIENT_SECRET,
  }
}

async function pluggyRequest<T>(path: string, options: RequestInit & { apiKey?: string } = {}) {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (options.apiKey) headers.set('X-API-KEY', options.apiKey)

  const response = await fetch(`${pluggyBaseUrl()}${path}`, {
    ...options,
    headers,
  })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? `Erro Pluggy ${response.status}`
    throw new Error(`Pluggy: ${message}`)
  }

  return data as T
}

function collection<T = JsonRecord>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  const record = data as JsonRecord
  return (record?.results ?? record?.data ?? record?.accounts ?? record?.transactions ?? record?.investments ?? []) as T[]
}

function nextCursor(data: unknown) {
  const value = (data as JsonRecord)?.next
  if (!value || typeof value !== 'string') return null
  if (value.startsWith('http')) return new URL(value).searchParams.get('after')
  return value
}

function dateOnly(value?: Date) {
  return value ? value.toISOString().slice(0, 10) : undefined
}

function asDate(value: unknown) {
  if (!value) return new Date()
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function asNumber(value: unknown) {
  const number = Number(value ?? 0)
  return Number.isFinite(number) ? number : 0
}

function accountType(account: JsonRecord) {
  const type = String(account.subtype ?? account.type ?? '').toUpperCase()
  if (type.includes('SAVING')) return BankAccountType.SAVINGS
  if (type.includes('INVEST')) return BankAccountType.INVESTMENT
  if (type.includes('PAYMENT')) return BankAccountType.PAYMENT
  return BankAccountType.CHECKING
}

function bankNameFrom(account: JsonRecord, item?: JsonRecord) {
  return account.marketingName ?? account.name ?? item?.connector?.name ?? item?.institution?.name ?? 'Pluggy'
}

function accountNumberFrom(account: JsonRecord) {
  return account.number ?? account.bankData?.transferNumber ?? account.bankData?.accountNumber ?? account.bankData?.account
}

function transactionType(amount: number) {
  return amount >= 0 ? TransactionType.RECEIVABLE : TransactionType.PAYABLE
}

function transactionForm(transaction: JsonRecord) {
  const value = `${transaction.type ?? ''} ${transaction.description ?? ''} ${transaction.descriptionRaw ?? ''}`.toLowerCase()
  if (value.includes('pix')) return TransactionForm.PIX
  if (value.includes('boleto')) return TransactionForm.BOLETO
  if (value.includes('ted')) return TransactionForm.TED
  if (value.includes('doc')) return TransactionForm.DOC
  if (value.includes('transfer')) return TransactionForm.TRANSFER
  if (value.includes('card') || value.includes('cart')) return TransactionForm.CARD
  return TransactionForm.OTHER
}

function categoryName(transaction: JsonRecord) {
  const category = transaction.category
  if (typeof category === 'string') return category
  return category?.description ?? category?.name ?? transaction.categoryDescription
}

function cardFromAccount(account: JsonRecord, item?: JsonRecord) {
  const creditData = account.creditData ?? {}
  const totalLimit = asNumber(creditData.creditLimit ?? creditData.limit ?? account.limit)
  const availableLimit = asNumber(creditData.availableCreditLimit ?? creditData.availableLimit ?? account.availableCreditLimit)
  const usedLimit = totalLimit > 0 && availableLimit > 0 ? Math.max(0, totalLimit - availableLimit) : Math.abs(asNumber(account.balance))
  const dueDate = creditData.balanceDueDate ? new Date(creditData.balanceDueDate) : null

  return {
    externalId: String(account.id),
    bankAccountExternalId: undefined,
    name: account.marketingName ?? account.name ?? `${bankNameFrom(account, item)} Cartão`,
    brand: CardBrand.OTHER,
    totalLimit,
    usedLimit,
    availableLimit: totalLimit > 0 ? Math.max(0, totalLimit - usedLimit) : availableLimit,
    dueDay: dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate.getDate() : undefined,
  }
}

function investmentType(investment: JsonRecord) {
  const value = `${investment.type ?? ''} ${investment.subtype ?? ''} ${investment.name ?? ''}`.toUpperCase()
  if (value.includes('TESOURO') || value.includes('TREASURY')) return InvestmentType.TREASURY
  if (value.includes('FII')) return InvestmentType.FII
  if (value.includes('STOCK') || value.includes('ACAO') || value.includes('AÇÃO')) return InvestmentType.STOCK
  if (value.includes('FUND') || value.includes('FUNDO')) return InvestmentType.FUND
  if (value.includes('CRYPTO')) return InvestmentType.CRYPTO
  if (value.includes('SAVING') || value.includes('POUPAN')) return InvestmentType.SAVINGS
  return InvestmentType.CDB
}

function investmentLiquidity(investment: JsonRecord) {
  const value = `${investment.liquidity ?? ''} ${investment.dueDate ?? ''} ${investment.maturityDate ?? ''}`.toUpperCase()
  if (value.includes('DAILY') || value.includes('DIÁRIA') || value.includes('DIARIA')) return InvestmentLiquidity.DAILY
  if (value.includes('VARIABLE') || value.includes('VARI')) return InvestmentLiquidity.VARIABLE
  return InvestmentLiquidity.MATURITY
}

export const pluggyClient = {
  async apiKey(input: PluggyApiKeyInput | PluggyConnectTokenInput | PluggyImportInput = {}) {
    const credential = envCredential(input)
    if (credential.apiKey) return credential.apiKey
    if (cachedApiKey && cachedApiKey.expiresAt > Date.now()) return cachedApiKey.value
    if (!credential.clientId || !credential.clientSecret) {
      throw new Error('Pluggy: informe Client ID e Client Secret, ou configure PLUGGY_API_KEY no .env.')
    }

    const data = await pluggyRequest<{ apiKey?: string; accessToken?: string; token?: string }>('/auth', {
      method: 'POST',
      body: JSON.stringify({ clientId: credential.clientId, clientSecret: credential.clientSecret }),
    })
    const apiKey = data.apiKey ?? data.accessToken ?? data.token
    if (!apiKey) throw new Error('Pluggy: a autenticação não retornou API Key.')
    cachedApiKey = { value: apiKey, expiresAt: Date.now() + API_KEY_TTL_MS }
    return apiKey
  },

  async connectToken(input: PluggyConnectTokenInput, userId: string) {
    const apiKey = await this.apiKey(input)
    const body = {
      itemId: input.itemId,
      clientUserId: input.clientUserId ?? userId,
      webhookUrl: input.webhookUrl ?? process.env.PLUGGY_WEBHOOK_URL,
      oauthRedirectUri: input.oauthRedirectUri ?? process.env.PLUGGY_OAUTH_REDIRECT_URI,
      avoidDuplicates: input.avoidDuplicates ?? true,
    }
    return pluggyRequest<{ accessToken?: string; connectToken?: string; token?: string; expiresIn?: number }>('/connect_token', {
      method: 'POST',
      apiKey,
      body: JSON.stringify(Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined))),
    })
  },

  async item(input: PluggyImportInput) {
    const apiKey = await this.apiKey(input)
    return pluggyRequest<JsonRecord>(`/items/${input.itemId}`, { apiKey })
  },

  async accounts(input: PluggyImportInput) {
    const apiKey = await this.apiKey(input)
    const data = await pluggyRequest<JsonRecord>(`/accounts?itemId=${encodeURIComponent(input.itemId)}`, { apiKey })
    return collection(data)
  },

  async transactions(input: PluggyImportInput, accountId: string) {
    const apiKey = await this.apiKey(input)
    const transactions: JsonRecord[] = []
    let after: string | null = null
    let pages = 0

    do {
      const params = new URLSearchParams({ accountId, pageSize: '100' })
      if (input.dateFrom) params.set('from', dateOnly(input.dateFrom)!)
      if (input.dateTo) params.set('to', dateOnly(input.dateTo)!)
      if (after) params.set('after', after)
      const data = await pluggyRequest<JsonRecord>(`/transactions?${params.toString()}`, { apiKey })
      transactions.push(...collection(data))
      after = nextCursor(data)
      pages += 1
    } while (after && pages < 20)

    return transactions
  },

  async investments(input: PluggyImportInput) {
    const apiKey = await this.apiKey(input)
    const data = await pluggyRequest<JsonRecord>(`/investments?itemId=${encodeURIComponent(input.itemId)}`, { apiKey })
    return collection(data)
  },

  async importPayload(input: PluggyImportInput): Promise<OpenFinanceImportInput> {
    const [item, accounts, investments] = await Promise.all([
      this.item(input).catch(() => undefined),
      this.accounts(input),
      this.investments(input).catch(() => []),
    ])
    const bankAccounts = accounts.filter((account) => String(account.type ?? '').toUpperCase() !== 'CREDIT')
    const creditAccounts = accounts.filter((account) => String(account.type ?? '').toUpperCase() === 'CREDIT')
    const transactionsByAccount = await Promise.all(accounts.map(async (account) => this.transactions(input, String(account.id)).catch(() => [])))
    const transactions = transactionsByAccount.flat()

    return {
      bankConnectionId: input.bankConnectionId,
      profileId: input.profileId,
      accounts: bankAccounts.map((account) => ({
        externalId: String(account.id),
        bankName: bankNameFrom(account, item),
        agency: account.bankData?.branchCode ?? account.bankData?.agency,
        accountNumber: accountNumberFrom(account),
        accountType: accountType(account),
        currentBalance: asNumber(account.balance),
        availableBalance: asNumber(account.balance),
      })),
      cards: creditAccounts.map((account) => cardFromAccount(account, item)),
      transactions: transactions.map((transaction) => {
        const amount = asNumber(transaction.amount)
        const type = transactionType(amount)
        return {
          externalId: String(transaction.id),
          bankAccountExternalId: String(transaction.accountId ?? transaction.account?.id ?? ''),
          title: transaction.description ?? transaction.descriptionRaw ?? transaction.title ?? 'Transação Pluggy',
          amount: Math.abs(amount),
          type,
          form: transactionForm(transaction),
          originalDescription: transaction.descriptionRaw ?? transaction.description,
          categoryName: categoryName(transaction),
          merchant: transaction.merchant?.name ?? transaction.merchantName,
          dueDate: asDate(transaction.date ?? transaction.paymentDate ?? transaction.createdAt),
          paidAt: asDate(transaction.date ?? transaction.paymentDate ?? transaction.createdAt),
          notes: 'Importado pela Pluggy',
        }
      }),
      investments: investments
        .map((investment) => ({
          externalId: String(investment.id),
          institution: investment.institution?.name ?? item?.connector?.name ?? 'Pluggy',
          product: investment.name ?? investment.code ?? investment.type ?? 'Investimento Pluggy',
          type: investmentType(investment),
          amount: asNumber(investment.amount ?? investment.balance ?? investment.value),
          profitability: investment.rate ?? investment.profitability ?? investment.annualRate,
          maturity: investment.dueDate ? asDate(investment.dueDate) : investment.maturityDate ? asDate(investment.maturityDate) : undefined,
          risk: InvestmentRisk.LOW,
          liquidity: investmentLiquidity(investment),
        }))
        .filter((investment) => investment.amount > 0),
    }
  },
}
