import { cardRepository } from './repository'
import { CardInput } from './types'

export const cardService = {
  list: cardRepository.list,
  create(userId: string, input: CardInput) {
    return cardRepository.create(userId, input)
  },
  simulatePurchase(amount: number, installments: number, monthlyIncome: number) {
    const monthlyImpact = amount / installments
    const healthyLimit = monthlyIncome * 0.3
    return {
      amount,
      installments,
      monthlyImpact,
      healthyLimit,
      isHealthy: monthlyImpact <= healthyLimit,
      message:
        monthlyImpact > healthyLimit
          ? `Essa compra adiciona R$ ${monthlyImpact.toFixed(2)} por mês e pode pressionar sua fatura.`
          : `Essa compra parece caber no limite saudável informado.`,
    }
  },
}
