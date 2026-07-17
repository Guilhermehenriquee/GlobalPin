import { TransactionStatus, TransactionType } from '@prisma/client'
import { prisma } from '../../database/prisma'

export const creditRepository = {
  async getContext(userId: string, profileId?: string) {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const [user, transactions, accounts, cards, connections, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.transaction.findMany({ where: { userId, profileId, dueDate: { gte: start, lt: end } } }),
      prisma.bankAccount.findMany({ where: { userId } }),
      prisma.card.findMany({ where: { userId, profileId } }),
      prisma.bankConnection.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      profileId ? prisma.financialProfile.findFirst({ where: { id: profileId, userId } }) : null,
    ])

    const receivables = transactions
      .filter((transaction) => transaction.type === TransactionType.RECEIVABLE)
      .reduce((total, transaction) => total + Number(transaction.amount), 0)
    const pendingBills = transactions
      .filter((transaction) => transaction.type === TransactionType.PAYABLE && transaction.status === TransactionStatus.PENDING)
      .reduce((total, transaction) => total + Number(transaction.amount), 0)
    const paidExpenses = transactions
      .filter((transaction) => transaction.type === TransactionType.PAYABLE && transaction.status === TransactionStatus.PAID)
      .reduce((total, transaction) => total + Number(transaction.amount), 0)
    const cardUsed = cards.reduce((total, card) => total + Number(card.usedLimit), 0)
    const cardLimit = cards.reduce((total, card) => total + Number(card.totalLimit), 0)
    const balance = accounts.reduce((total, account) => total + Number(account.availableBalance), 0)

    return {
      user,
      profile,
      transactions,
      accounts,
      cards,
      connections,
      monthlyIncome: Number(user?.salary ?? 0) + receivables,
      pendingBills,
      paidExpenses,
      cardUsed,
      cardLimit,
      balance,
    }
  },
}
