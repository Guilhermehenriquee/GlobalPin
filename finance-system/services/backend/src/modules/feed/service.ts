import { FeedCard, FeedQuery } from './types'
import { feedRepository } from './repository'

const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

function scoreFrom(input: { salary: number; expenses: number; pending: number; cardUsage: number; goalProgress: number }) {
  let score = 58
  if (input.salary > 0 && input.expenses <= input.salary * 0.8) score += 14
  if (input.salary > 0 && input.expenses > input.salary) score -= 18
  if (input.pending <= 2) score += 8
  if (input.cardUsage <= 60) score += 10
  if (input.cardUsage > 80) score -= 14
  if (input.goalProgress >= 50) score += 10
  return Math.max(0, Math.min(100, score))
}

export const feedService = {
  async home(userId: string, query: FeedQuery) {
    const now = new Date()
    const month = query.month ?? now.getMonth() + 1
    const year = query.year ?? now.getFullYear()
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)
    const daysLeft = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    const [user, transactions, cards, goals, budgets, alerts] = await feedRepository.getContext(userId, start, end, query.profileId)

    const salary = Number(user?.salary ?? 0)
    const income = feedRepository.getIncome(transactions)
    const expenses = feedRepository.getExpenses(transactions)
    const freeCash = salary + income - expenses
    const safeDailySpend = Math.max(0, freeCash / daysLeft)
    const totalCardLimit = cards.reduce((total, card) => total + Number(card.totalLimit), 0)
    const usedCardLimit = cards.reduce((total, card) => total + Number(card.usedLimit), 0)
    const cardUsage = totalCardLimit > 0 ? Math.round((usedCardLimit / totalCardLimit) * 100) : 0
    const primaryGoal = goals[0]
    const goalProgress = primaryGoal ? Math.round((Number(primaryGoal.currentAmount) / Number(primaryGoal.targetAmount)) * 100) : 0
    const score = scoreFrom({ salary, expenses, pending: alerts.length, cardUsage, goalProgress })
    const delivery = transactions
      .filter((item) => `${item.title} ${item.categoryName ?? ''} ${item.subcategory ?? ''}`.toLowerCase().includes('delivery') || item.title.toLowerCase().includes('ifood'))
      .reduce((total, item) => total + Number(item.amount), 0)

    const cardsFeed: FeedCard[] = [
      {
        id: 'score',
        type: 'score',
        tone: score >= 75 ? 'good' : score >= 55 ? 'warning' : 'danger',
        title: `Score financeiro ${score}/100`,
        message: score >= 75 ? 'Seu mês está sob controle.' : 'Há pontos de atenção para proteger seu caixa.',
        value: `${score}`,
        action: 'Ver diagnostico',
      },
      {
        id: 'safe-spend',
        type: 'opportunity',
        tone: safeDailySpend > 0 ? 'good' : 'danger',
        title: `Você pode gastar ${money(safeDailySpend)} por dia`,
        message: 'Estimativa segura até o fim do mês considerando renda, entradas e despesas cadastradas.',
        value: money(safeDailySpend),
        action: 'Perguntar para IA',
      },
    ]

    if (cardUsage > 0) {
      cardsFeed.push({
        id: 'card-usage',
        type: 'card',
        tone: cardUsage >= 80 ? 'danger' : cardUsage >= 65 ? 'warning' : 'neutral',
        title: `Seu cartão chegou a ${cardUsage}% do limite`,
        message: 'Acompanhe o ritmo antes do fechamento para evitar uma fatura pesada.',
        value: `${cardUsage}%`,
        action: 'Simular compra',
      })
    }

    if (freeCash > 0) {
      cardsFeed.push({
        id: 'invest',
        type: 'opportunity',
        tone: 'good',
        title: `Você pode investir ${money(Math.floor(freeCash * 0.3))} este mês`,
        message: 'Sugestão educativa: priorize reserva de emergência antes de risco maior.',
        value: money(Math.floor(freeCash * 0.3)),
        action: 'Criar meta',
      })
    }

    if (delivery > 0) {
      cardsFeed.push({
        id: 'delivery',
        type: 'spending',
        tone: 'warning',
        title: `Delivery soma ${money(delivery)} no mês`,
        message: 'Se reduzir esse bloco, a sobra pode virar meta ou investimento.',
        value: money(delivery),
        action: 'Analisar categoria',
      })
    }

    if (primaryGoal) {
      cardsFeed.push({
        id: 'goal',
        type: 'goal',
        tone: goalProgress >= 70 ? 'good' : 'neutral',
        title: `${primaryGoal.title} está em ${goalProgress}%`,
        message: `Você acumulou ${money(Number(primaryGoal.currentAmount))} de ${money(Number(primaryGoal.targetAmount))}.`,
        value: `${goalProgress}%`,
        action: 'Atualizar meta',
      })
    }

    budgets.forEach((budget) => {
      const spent = transactions
        .filter((transaction) => transaction.categoryName === budget.category)
        .reduce((total, transaction) => total + Number(transaction.amount), 0)
      const percentage = Number(budget.limit) > 0 ? Math.round((spent / Number(budget.limit)) * 100) : 0
      if (percentage >= budget.alertAt) {
        cardsFeed.push({
          id: `budget-${budget.id}`,
          type: 'alert',
          tone: percentage >= 100 ? 'danger' : 'warning',
          title: `${budget.category} já usou ${percentage}% do orçamento`,
          message: `Limite de ${money(Number(budget.limit))}; gasto atual ${money(spent)}.`,
          value: `${percentage}%`,
          action: 'Ajustar gastos',
        })
      }
    })

    alerts.forEach((alert) => {
      cardsFeed.push({
        id: `alert-${alert.id}`,
        type: 'alert',
        tone: alert.severity === 'HIGH' ? 'danger' : alert.severity === 'MEDIUM' ? 'warning' : 'neutral',
        title: alert.title,
        message: alert.message,
        action: 'Marcar como lido',
      })
    })

    return {
      month,
      year,
      score,
      safeDailySpend,
      cards: cardsFeed,
      modeSuggestions: ['Viagem', 'Família', 'Festa', 'Autônomo'],
      plan: {
        tier: 'GRÁTIS',
        premiumPitch: 'Estrutura premium gratuita com IA avançada, previsões, score completo e bancos ilimitados.',
      },
    }
  },
}
