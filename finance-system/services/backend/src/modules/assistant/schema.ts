import { z } from 'zod'

export const assistantQuestionSchema = z.object({
  question: z.string().min(3),
  profileId: z.string().uuid().optional(),
})
