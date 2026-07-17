import { z } from 'zod'
import { alertSchema } from './schema'

export type AlertInput = z.infer<typeof alertSchema>
