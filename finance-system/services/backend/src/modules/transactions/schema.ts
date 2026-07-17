import { TransactionDirection, TransactionForm, TransactionStatus, TransactionType } from '@prisma/client'
import { z } from 'zod'

export const transactionParamsSchema = z.object({ id: z.string().uuid() })

export const transactionQuerySchema = z.object({
  profileId: z.string().uuid().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
  category: z.string().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
})

const transactionBaseSchema = z.object({
  title: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  profileId: z.string().uuid().optional(),
  bankAccountId: z.string().uuid().optional(),
  externalId: z.string().optional(),
  amount: z.coerce.number().positive(),
  type: z.nativeEnum(TransactionType),
  direction: z.nativeEnum(TransactionDirection).optional(),
  form: z.nativeEnum(TransactionForm).optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
  originalDescription: z.string().optional(),
  categoryName: z.string().optional(),
  subcategory: z.string().optional(),
  merchant: z.string().optional(),
  recurrence: z.string().optional(),
  tag: z.string().optional(),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().optional(),
  notes: z.string().optional(),
})

export const createTransactionSchema = transactionBaseSchema.refine((data) => data.title || data.name, {
  message: 'O título é obrigatório',
  path: ['title'],
})

export const updateTransactionSchema = transactionBaseSchema.partial()
