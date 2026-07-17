import { prisma } from '../../database/prisma'

export const notificationRepository = {
  list(userId: string) {
    return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },

  async markAsRead(userId: string, id: string) {
    const notification = await prisma.notification.findFirst({ where: { id, userId } })
    if (!notification) throw new Error('NOTIFICATION_NOT_FOUND')
    return prisma.notification.update({ where: { id }, data: { read: true, readAt: new Date() } })
  },
}
