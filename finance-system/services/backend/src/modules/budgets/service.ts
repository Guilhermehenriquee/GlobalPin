import { TransactionType } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { budgetRepository } from './repository'
import { BudgetInput, BudgetQuery } from './types'

export const budgetService = {
  list(userId: string, query: BudgetQuery) {
    return budgetRepository.list(userId, query)
  },

  upsert(userId: string, input: BudgetInput) {
    return budgetRepository.upsert(userId, input)
  },

  async usage(userId: string, query: BudgetQuery) {
    const now = new Date()
    const month = query.month ?? now.getMonth() + 1
    const year = query.year ?? now.getFullYear()
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)
    const [budgets, transactions] = await Promise.all([
      budgetRepository.list(userId, { month, year }),
      prisma.transaction.findMany({ where: { userId, type: TransactionType.PAYABLE, dueDate: { gte: start, lt: end } } }),
    ])

    return budgets.map((budget) => {
      const spent = transactions
        .filter((transaction) => transaction.categoryName === budget.category)
        .reduce((total, transaction) => total + Number(transaction.amount), 0)
      const percentage = Number(budget.limit) > 0 ? Math.round((spent / Number(budget.limit)) * 100) : 0
      return { ...budget, spent, percentage, shouldAlert: percentage >= budget.alertAt }
    })
  },
}
