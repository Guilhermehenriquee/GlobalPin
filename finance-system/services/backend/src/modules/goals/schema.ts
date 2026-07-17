import { z } from 'zod'

export const goalSchema = z.object({
  profileId: z.string().uuid().optional(),
  title: z.string().min(2),
  targetAmount: z.coerce.number().positive(),
  currentAmount: z.coerce.number().nonnegative().optional(),
  deadline: z.coerce.date().optional(),
})
