import { prisma } from '../../database/prisma'
import { GoalInput } from './types'

export const goalRepository = {
  list(userId: string) {
    return prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },
  create(userId: string, input: GoalInput) {
    const monthlyTarget = input.deadline
      ? Math.max((input.targetAmount - (input.currentAmount ?? 0)) / Math.max(1, Math.ceil((input.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))), 0)
      : undefined
    return prisma.goal.create({ data: { userId, ...input, monthlyTarget } })
  },
}
