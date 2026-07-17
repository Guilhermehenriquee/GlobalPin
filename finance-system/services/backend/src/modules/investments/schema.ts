import { InvestmentLiquidity, InvestmentRisk, InvestmentType } from '@prisma/client'
import { z } from 'zod'

export const investmentSchema = z.object({
  profileId: z.string().uuid().optional(),
  externalId: z.string().optional(),
  institution: z.string().min(2),
  product: z.string().min(2),
  type: z.nativeEnum(InvestmentType),
  amount: z.coerce.number().positive(),
  profitability: z.string().optional(),
  maturity: z.coerce.date().optional(),
  risk: z.nativeEnum(InvestmentRisk).optional(),
  liquidity: z.nativeEnum(InvestmentLiquidity).optional(),
})
