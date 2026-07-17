import { ProjectCategory, ProjectStatus } from '@prisma/client'
import { z } from 'zod'

export const projectParamsSchema = z.object({ id: z.string().uuid() })

const projectBaseSchema = z.object({
  title: z.string().min(2).optional(),
  productName: z.string().min(2).optional(),
  client: z.string().min(2),
  category: z.nativeEnum(ProjectCategory),
  amount: z.coerce.number().positive().optional(),
  returnValue: z.coerce.number().positive().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  soldAt: z.coerce.date(),
  paidAt: z.coerce.date().optional(),
  notes: z.string().optional(),
})

export const createProjectSchema = projectBaseSchema
  .refine((data) => data.title || data.productName, { message: 'O título é obrigatório', path: ['title'] })
  .refine((data) => data.amount || data.returnValue, { message: 'O valor é obrigatório', path: ['amount'] })

export const updateProjectSchema = projectBaseSchema.partial()
