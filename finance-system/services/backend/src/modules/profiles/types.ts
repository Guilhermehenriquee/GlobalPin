import { z } from 'zod'
import { profileSchema } from './schema'

export type ProfileInput = z.infer<typeof profileSchema>
