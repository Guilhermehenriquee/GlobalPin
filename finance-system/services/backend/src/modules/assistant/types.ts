import { z } from 'zod'
import { assistantQuestionSchema } from './schema'

export type AssistantQuestionInput = z.infer<typeof assistantQuestionSchema>
