import { InvestmentRisk } from '@prisma/client'
import { investmentRepository } from './repository'
import { InvestmentInput } from './types'

export const investmentService = {
  list: investmentRepository.list,
  create(userId: string, input: InvestmentInput) {
    return investmentRepository.create(userId, input)
  },
  async summary(userId: string) {
    const investments = await investmentRepository.list(userId)
    const total = investments.reduce((sum, item) => sum + Number(item.amount), 0)
    const highRisk = investments.filter((item) => item.risk === InvestmentRisk.HIGH).reduce((sum, item) => sum + Number(item.amount), 0)
    return {
      total,
      count: investments.length,
      highRiskExposure: total > 0 ? Math.round((highRisk / total) * 100) : 0,
      educationalNote: 'Sugestoes de investimento sao educativas; recomendacao personalizada pode exigir regras regulatorias.',
    }
  },
}
