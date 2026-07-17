import { z } from 'zod'
import { analyticsQuerySchema, classifyTextSchema } from './schema'

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>
export type ClassifyTextInput = z.infer<typeof classifyTextSchema>
