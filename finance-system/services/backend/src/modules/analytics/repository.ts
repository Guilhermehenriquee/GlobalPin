import { prisma } from '../../database/prisma'

export const analyticsRepository = {
  listReports(userId: string) {
    return prisma.aiReport.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 })
  },
}
