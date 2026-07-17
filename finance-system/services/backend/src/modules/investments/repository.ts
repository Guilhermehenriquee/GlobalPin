import { prisma } from '../../database/prisma'
import { InvestmentInput } from './types'

export const investmentRepository = {
  list(userId: string) {
    return prisma.investment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },
  create(userId: string, input: InvestmentInput) {
    return prisma.investment.create({ data: { userId, ...input } })
  },
}
