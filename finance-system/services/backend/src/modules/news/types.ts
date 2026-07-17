import { z } from 'zod'
import { createNewsSchema, updateNewsSchema } from './schema'

export type CreateNewsInput = z.infer<typeof createNewsSchema>
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>
