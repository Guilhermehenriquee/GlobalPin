import { z } from 'zod'
import { createTransactionSchema, transactionQuerySchema, updateTransactionSchema } from './schema'

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionFilters = z.infer<typeof transactionQuerySchema>
