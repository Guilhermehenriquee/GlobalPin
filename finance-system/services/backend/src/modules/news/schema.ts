import { NewsCategory } from '@prisma/client'
import { z } from 'zod'

export const createNewsSchema = z.object({
  title: z.string().min(2),
  summary: z.string().optional(),
  url: z.string().url().optional(),
  source: z.string().optional(),
  category: z.nativeEnum(NewsCategory).optional(),
  relevance: z.coerce.number().int().min(0).max(100).optional(),
  isRelevant: z.boolean().optional(),
  publishedAt: z.coerce.date().optional(),
})

export const newsParamsSchema = z.object({ id: z.string().uuid() })

export const updateNewsSchema = createNewsSchema.partial()
