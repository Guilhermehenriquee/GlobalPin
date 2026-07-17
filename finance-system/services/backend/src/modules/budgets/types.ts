import { z } from 'zod'
import { budgetQuerySchema, budgetSchema } from './schema'

export type BudgetInput = z.infer<typeof budgetSchema>
export type BudgetQuery = z.infer<typeof budgetQuerySchema>
