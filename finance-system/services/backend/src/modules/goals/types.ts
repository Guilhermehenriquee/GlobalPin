import { z } from 'zod'
import { goalSchema } from './schema'

export type GoalInput = z.infer<typeof goalSchema>
