import { AlertSeverity, AlertType } from '@prisma/client'
import { z } from 'zod'

export const alertSchema = z.object({
  type: z.nativeEnum(AlertType).optional(),
  severity: z.nativeEnum(AlertSeverity).optional(),
  title: z.string().min(2),
  message: z.string().min(2),
})

export const alertParamsSchema = z.object({ id: z.string().uuid() })
