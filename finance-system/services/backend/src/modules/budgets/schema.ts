import { z } from 'zod'

export const budgetSchema = z.object({
  profileId: z.string().uuid().optional(),
  category: z.string().min(2),
  limit: z.coerce.number().positive(),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  alertAt: z.coerce.number().int().min(1).max(100).optional(),
})

export const budgetQuerySchema = z.object({
  profileId: z.string().uuid().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
})
