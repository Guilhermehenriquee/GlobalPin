import { FinancialProfileType } from '@prisma/client'
import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(2),
  type: z.nativeEnum(FinancialProfileType),
  document: z.string().optional(),
  color: z.string().optional(),
})

export const profileParamsSchema = z.object({
  id: z.string().uuid(),
})
