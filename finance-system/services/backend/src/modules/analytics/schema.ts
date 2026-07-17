import { z } from 'zod'

export const analyticsQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
})

export const classifyTextSchema = z.object({
  text: z.string().min(2),
})
