import { prisma } from '../../database/prisma'
import { AlertInput } from './types'

export const alertRepository = {
  list(userId: string) {
    return prisma.alert.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },
  create(userId: string, input: AlertInput) {
    return prisma.alert.create({ data: { userId, ...input } })
  },
  async read(userId: string, id: string) {
    const alert = await prisma.alert.findFirst({ where: { id, userId } })
    if (!alert) throw new Error('ALERT_NOT_FOUND')
    return prisma.alert.update({ where: { id }, data: { read: true, readAt: new Date() } })
  },
}
