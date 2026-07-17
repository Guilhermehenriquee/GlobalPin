import { z } from 'zod'
import { cardSchema } from './schema'

export type CardInput = z.infer<typeof cardSchema>
