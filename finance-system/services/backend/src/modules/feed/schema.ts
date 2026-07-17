import { z } from 'zod'

export const feedQuerySchema = z.object({
  profileId: z.string().uuid().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
})
