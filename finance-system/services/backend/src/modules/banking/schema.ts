import { BankAccountType, CardBrand, InvestmentLiquidity, InvestmentRisk, InvestmentType, TransactionDirection, TransactionForm, TransactionType } from '@prisma/client'
import { z } from 'zod'

export const bankConnectionSchema = z.object({
  provider: z.string().min(2),
  bankName: z.string().min(2),
})

export const bankAccountSchema = z.object({
  bankConnectionId: z.string().uuid().optional(),
  externalId: z.string().optional(),
  bankName: z.string().min(2),
  agency: z.string().optional(),
  accountNumber: z.string().optional(),
  accountType: z.nativeEnum(BankAccountType).optional(),
  currentBalance: z.coerce.number().optional(),
  availableBalance: z.coerce.number().optional(),
})

export const openFinanceConsentSchema = z.object({
  provider: z.string().min(2),
  bankName: z.string().min(2),
  redirectUri: z.string().url().optional(),
  permissions: z.array(z.string().min(2)).optional(),
})

export const openFinanceImportSchema = z.object({
  bankConnectionId: z.string().uuid().optional(),
  profileId: z.string().uuid().optional(),
  accounts: z.array(bankAccountSchema).optional(),
  transactions: z.array(z.object({
    externalId: z.string().min(1),
    bankAccountExternalId: z.string().optional(),
    bankAccountId: z.string().uuid().optional(),
    title: z.string().min(2),
    amount: z.coerce.number().positive(),
    type: z.nativeEnum(TransactionType),
    direction: z.nativeEnum(TransactionDirection).optional(),
    form: z.nativeEnum(TransactionForm).optional(),
    originalDescription: z.string().optional(),
    categoryName: z.string().optional(),
    subcategory: z.string().optional(),
    merchant: z.string().optional(),
    recurrence: z.string().optional(),
    dueDate: z.coerce.date(),
    paidAt: z.coerce.date().optional(),
    notes: z.string().optional(),
  })).optional(),
  cards: z.array(z.object({
    externalId: z.string().min(1),
    bankAccountExternalId: z.string().optional(),
    name: z.string().min(2),
    brand: z.nativeEnum(CardBrand).optional(),
    totalLimit: z.coerce.number().nonnegative().optional(),
    usedLimit: z.coerce.number().nonnegative().optional(),
    availableLimit: z.coerce.number().nonnegative().optional(),
    closingDay: z.coerce.number().int().min(1).max(31).optional(),
    dueDay: z.coerce.number().int().min(1).max(31).optional(),
    bestPurchaseDay: z.coerce.number().int().min(1).max(31).optional(),
  })).optional(),
  investments: z.array(z.object({
    externalId: z.string().min(1),
    institution: z.string().min(2),
    product: z.string().min(2),
    type: z.nativeEnum(InvestmentType),
    amount: z.coerce.number().positive(),
    profitability: z.string().optional(),
    maturity: z.coerce.date().optional(),
    risk: z.nativeEnum(InvestmentRisk).optional(),
    liquidity: z.nativeEnum(InvestmentLiquidity).optional(),
  })).optional(),
})

const pluggyCredentialsSchema = {
  clientId: z.string().uuid().optional(),
  clientSecret: z.string().min(1).optional(),
  apiKey: z.string().min(1).optional(),
}

export const pluggyApiKeySchema = z.object({
  clientId: z.string().uuid().optional(),
  clientSecret: z.string().min(1).optional(),
})

export const pluggyConnectTokenSchema = z.object({
  ...pluggyCredentialsSchema,
  itemId: z.string().uuid().optional(),
  bankName: z.string().min(2).optional(),
  clientUserId: z.string().min(1).optional(),
  webhookUrl: z.string().url().optional(),
  oauthRedirectUri: z.string().url().optional(),
  avoidDuplicates: z.coerce.boolean().optional(),
})

export const pluggyImportSchema = z.object({
  ...pluggyCredentialsSchema,
  itemId: z.string().uuid(),
  bankConnectionId: z.string().uuid().optional(),
  profileId: z.string().uuid().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

export const bankingParamsSchema = z.object({ id: z.string().uuid() })
