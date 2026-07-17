import { NotificationType, TransactionStatus, TransactionType } from '@prisma/client'
import { prisma } from '../database/prisma'

export async function createDueTomorrowNotifications() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
  const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1)

  const transactions = await prisma.transaction.findMany({
    where: {
      type: TransactionType.PAYABLE,
      status: TransactionStatus.PENDING,
      dueDate: { gte: start, lt: end },
    },
  })

  if (transactions.length === 0) return { created: 0 }

  await prisma.notification.createMany({
    data: transactions.map((transaction) => ({
      userId: transaction.userId,
      type: NotificationType.WARNING,
      title: 'Conta vence amanhã',
      message: `${transaction.title} vence amanhã.`,
    })),
  })

  return { created: transactions.length }
}
