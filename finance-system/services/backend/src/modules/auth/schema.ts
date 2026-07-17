import { FinancialGoal, FinancialKnowledgeLevel, InvestorProfile } from '@prisma/client'
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  salary: z.coerce.number().nonnegative().optional(),
  netSalary: z.coerce.number().nonnegative().optional(),
  financialGoals: z.array(z.nativeEnum(FinancialGoal)).optional(),
  investorProfile: z.nativeEnum(InvestorProfile).optional(),
  financialKnowledge: z.nativeEnum(FinancialKnowledgeLevel).optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
