import { ProjectStatus, TransactionStatus, TransactionType } from '@prisma/client'
import { dashboardRepository } from './repository'
import { DashboardQuery } from './types'

const money = (value: unknown) => Number(value ?? 0)
const sum = <T>(items: T[], selector: (item: T) => unknown) =>
  items.reduce((total, item) => total + money(selector(item)), 0)

export const dashboardService = {
  async summary(userId: string, query: DashboardQuery) {
    const now = new Date()
    const month = query.month ?? now.getMonth() + 1
    const year = query.year ?? now.getFullYear()
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    const [user, transactions, projects, pendingCounts, accounts, cards, goals, alerts] = await Promise.all([
      dashboardRepository.getUser(userId),
      dashboardRepository.getTransactions(userId, start, end, query.profileId),
      dashboardRepository.getProjects(userId, start, end, query.profileId),
      dashboardRepository.getPendingCounts(userId, query.profileId),
      dashboardRepository.getAccounts(userId),
      dashboardRepository.getCards(userId, query.profileId),
      dashboardRepository.getGoals(userId, query.profileId),
      dashboardRepository.getAlerts(userId),
    ])

    const salary = money(user?.salary)
    const totalToPay = sum(
      transactions.filter((item) => item.type === TransactionType.PAYABLE && item.status === TransactionStatus.PENDING),
      (item) => item.amount,
    )
    const totalToReceive = sum(
      transactions.filter((item) => item.type === TransactionType.RECEIVABLE && item.status === TransactionStatus.PENDING),
      (item) => item.amount,
    )
    const totalPaidThisMonth = sum(
      transactions.filter((item) => item.status === TransactionStatus.PAID),
      (item) => item.amount,
    )
    const totalReceivedThisMonth = sum(
      transactions.filter((item) => item.status === TransactionStatus.RECEIVED),
      (item) => item.amount,
    )
    const projectProfit = sum(
      projects.filter((item) => item.status === ProjectStatus.PAID),
      (item) => item.amount,
    )
    const balance = sum(accounts, (item) => item.currentBalance)
    const netWorth = balance + sum(cards, (item) => Number(item.availableLimit) - Number(item.usedLimit)) + sum(goals, (item) => item.currentAmount)
    const cardsUsed = sum(cards, (item) => item.usedLimit)
    const cardsAvailable = sum(cards, (item) => item.availableLimit)

    return {
      month,
      year,
      balance,
      salary,
      netSalary: salary,
      monthlyIncome: totalReceivedThisMonth,
      monthlyExpenses: totalPaidThisMonth + totalToPay,
      netWorth,
      cards: {
        total: cards.length,
        usedLimit: cardsUsed,
        availableLimit: cardsAvailable,
      },
      upcomingBills: transactions
        .filter((item) => item.type === TransactionType.PAYABLE && item.status === TransactionStatus.PENDING)
        .slice(0, 5),
      monthlySaving: salary + totalReceivedThisMonth - totalPaidThisMonth - totalToPay,
      monthlyGoal: goals[0] ?? null,
      aiAlerts: alerts,
      totalToPay,
      totalToReceive,
      forecastBalance: salary - totalToPay + totalToReceive,
      expectedBalance: salary - totalToPay + totalToReceive,
      totalReceived: totalReceivedThisMonth,
      totalPaid: totalPaidThisMonth,
      totalReceivedThisMonth,
      totalPaidThisMonth,
      projectProfit,
      monthlyProfit: projectProfit,
      pending: {
        payableTransactions: pendingCounts[0],
        receivableTransactions: pendingCounts[1],
        projects: pendingCounts[2],
      },
      pendingTransactions: pendingCounts[0] + pendingCounts[1],
    }
  },
}
