import { AiConversationRole, TransactionType } from '@prisma/client'
import { prisma } from '../../database/prisma'

export const assistantRepository = {
  saveMessage(userId: string, role: AiConversationRole, content: string, metadata?: object) {
    return prisma.aiConversation.create({ data: { userId, role, content, metadata: metadata ?? undefined } })
  },
  getMonthTransactions(userId: string, profileId?: string) {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return prisma.transaction.findMany({ where: { userId, profileId, dueDate: { gte: start, lt: end } } })
  },
  async getFinancialContext(userId: string, profileId?: string) {
    const [user, transactions, budgets] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      this.getMonthTransactions(userId, profileId),
      prisma.budget.findMany({ where: { userId, profileId } }),
    ])
    const income = transactions.filter((item) => item.type === TransactionType.RECEIVABLE).reduce((sum, item) => sum + Number(item.amount), 0)
    const expenses = transactions.filter((item) => item.type === TransactionType.PAYABLE).reduce((sum, item) => sum + Number(item.amount), 0)
    return { user, transactions, budgets, income, expenses }
  },
}
