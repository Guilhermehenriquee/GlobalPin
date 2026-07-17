import { ProjectStatus, TransactionStatus, TransactionType } from '@prisma/client'
import { prisma } from '../../database/prisma'

export const dashboardRepository = {
  getUser(userId: string) {
    return prisma.user.findUnique({ where: { id: userId }, select: { salary: true } })
  },

  getTransactions(userId: string, start: Date, end: Date, profileId?: string) {
    return prisma.transaction.findMany({
      where: { userId, profileId, dueDate: { gte: start, lt: end } },
    })
  },

  getProjects(userId: string, start: Date, end: Date, profileId?: string) {
    return prisma.project.findMany({
      where: { userId, profileId, soldAt: { gte: start, lt: end } },
    })
  },

  getAccounts(userId: string) {
    return prisma.bankAccount.findMany({ where: { userId } })
  },

  getCards(userId: string, profileId?: string) {
    return prisma.card.findMany({ where: { userId, profileId } })
  },

  getGoals(userId: string, profileId?: string) {
    return prisma.goal.findMany({ where: { userId, profileId } })
  },

  getAlerts(userId: string) {
    return prisma.alert.findMany({ where: { userId, read: false }, orderBy: { createdAt: 'desc' }, take: 5 })
  },

  getPendingCounts(userId: string, profileId?: string) {
    return Promise.all([
      prisma.transaction.count({ where: { userId, profileId, status: TransactionStatus.PENDING, type: TransactionType.PAYABLE } }),
      prisma.transaction.count({ where: { userId, profileId, status: TransactionStatus.PENDING, type: TransactionType.RECEIVABLE } }),
      prisma.project.count({ where: { userId, profileId, status: ProjectStatus.PENDING } }),
    ])
  },
}
