import { TransactionType } from '@prisma/client'
import { prisma } from '../../database/prisma'

export const feedRepository = {
  getContext(userId: string, start: Date, end: Date, profileId?: string) {
    return Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.transaction.findMany({ where: { userId, profileId, dueDate: { gte: start, lt: end } } }),
      prisma.card.findMany({ where: { userId, profileId } }),
      prisma.goal.findMany({ where: { userId, profileId }, orderBy: { createdAt: 'asc' } }),
      prisma.budget.findMany({ where: { userId, profileId, month: start.getMonth() + 1, year: start.getFullYear() } }),
      prisma.alert.findMany({ where: { userId, read: false }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ])
  },

  getIncome(transactions: Awaited<ReturnType<typeof prisma.transaction.findMany>>) {
    return transactions.filter((item) => item.type === TransactionType.RECEIVABLE).reduce((total, item) => total + Number(item.amount), 0)
  },

  getExpenses(transactions: Awaited<ReturnType<typeof prisma.transaction.findMany>>) {
    return transactions.filter((item) => item.type === TransactionType.PAYABLE).reduce((total, item) => total + Number(item.amount), 0)
  },
}
