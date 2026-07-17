import { z } from 'zod'

export const creditAnalysisSchema = z.object({
  profileId: z.string().uuid().optional(),
  requestedAmount: z.coerce.number().positive().optional(),
  installments: z.coerce.number().int().min(1).max(96).optional(),
  purpose: z.string().optional(),
})
