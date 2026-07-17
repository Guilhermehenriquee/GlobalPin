import { z } from 'zod'
import { feedQuerySchema } from './schema'

export type FeedQuery = z.infer<typeof feedQuerySchema>

export type FeedCard = {
  id: string
  type: 'alert' | 'opportunity' | 'goal' | 'score' | 'card' | 'spending'
  tone: 'good' | 'warning' | 'danger' | 'neutral'
  title: string
  message: string
  value?: string
  action?: string
}
