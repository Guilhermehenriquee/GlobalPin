import { z } from 'zod'
import { investmentSchema } from './schema'

export type InvestmentInput = z.infer<typeof investmentSchema>
