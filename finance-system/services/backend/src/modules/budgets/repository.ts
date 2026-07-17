import { prisma } from '../../database/prisma'
import { BudgetInput, BudgetQuery } from './types'

export const budgetRepository = {
  list(userId: string, query: BudgetQuery) {
    return prisma.budget.findMany({ where: { userId, profileId: query.profileId, month: query.month, year: query.year }, orderBy: { category: 'asc' } })
  },

  async upsert(userId: string, input: BudgetInput) {
    const existing = await prisma.budget.findFirst({
      where: { userId, profileId: input.profileId, category: input.category, month: input.month, year: input.year },
    })

    if (existing) {
      return prisma.budget.update({ where: { id: existing.id }, data: input })
    }

    return prisma.budget.create({ data: { userId, ...input } })
  },
}
