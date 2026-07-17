import { analyticsRepository } from './repository'
import { AnalyticsQuery, ClassifyTextInput } from './types'

export const analyticsService = {
  async summary(userId: string, query: AnalyticsQuery) {
    const reports = await analyticsRepository.listReports(userId)
    return {
      period: {
        month: query.month ?? new Date().getMonth() + 1,
        year: query.year ?? new Date().getFullYear(),
      },
      insights: [
        'Mock: classificar texto em categoria',
        'Mock: gerar insights financeiros',
        'Mock: prever gastos',
        'Mock: detectar anomalias',
        'Mock: gerar relatório semanal',
      ],
      recentReports: reports,
    }
  },

  classifyText(input: ClassifyTextInput) {
    const normalizedText = input.text.toLowerCase()
    const category =
      normalizedText.includes('boleto') || normalizedText.includes('conta')
        ? 'CONTAS'
        : normalizedText.includes('pix')
          ? 'PIX'
          : normalizedText.includes('cliente') || normalizedText.includes('sistema')
            ? 'PROJETOS'
            : 'OUTROS'

    return {
      category,
      confidence: 0.72,
      provider: 'mock',
    }
  },

  weeklyReport() {
    return {
      provider: 'mock',
      title: 'Relatório semanal',
      insights: ['Revise contas pendentes', 'Acompanhe recebíveis em atraso', 'Separe entradas de projetos do salário'],
    }
  },
}
