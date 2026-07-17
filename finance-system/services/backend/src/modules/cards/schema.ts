import { CardBrand } from '@prisma/client'
import { z } from 'zod'

export const cardSchema = z.object({
  profileId: z.string().uuid().optional(),
  bankAccountId: z.string().uuid().optional(),
  externalId: z.string().optional(),
  name: z.string().min(2),
  brand: z.nativeEnum(CardBrand).optional(),
  totalLimit: z.coerce.number().nonnegative().optional(),
  usedLimit: z.coerce.number().nonnegative().optional(),
  availableLimit: z.coerce.number().nonnegative().optional(),
  closingDay: z.coerce.number().int().min(1).max(31).optional(),
  dueDay: z.coerce.number().int().min(1).max(31).optional(),
  bestPurchaseDay: z.coerce.number().int().min(1).max(31).optional(),
})
