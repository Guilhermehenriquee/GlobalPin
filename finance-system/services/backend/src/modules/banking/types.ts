import { z } from 'zod'
import { bankAccountSchema, bankConnectionSchema, openFinanceConsentSchema, openFinanceImportSchema, pluggyApiKeySchema, pluggyConnectTokenSchema, pluggyImportSchema } from './schema'

export type BankConnectionInput = z.infer<typeof bankConnectionSchema>
export type BankAccountInput = z.infer<typeof bankAccountSchema>
export type OpenFinanceConsentInput = z.infer<typeof openFinanceConsentSchema>
export type OpenFinanceImportInput = z.infer<typeof openFinanceImportSchema>
export type PluggyApiKeyInput = z.infer<typeof pluggyApiKeySchema>
export type PluggyConnectTokenInput = z.infer<typeof pluggyConnectTokenSchema>
export type PluggyImportInput = z.infer<typeof pluggyImportSchema>
