import { prisma } from '../../database/prisma'
import { CardInput } from './types'

export const cardRepository = {
  list(userId: string) {
    return prisma.card.findMany({ where: { userId }, include: { invoices: true }, orderBy: { createdAt: 'desc' } })
  },
  create(userId: string, input: CardInput) {
    const usedLimit = input.usedLimit ?? 0
    const totalLimit = input.totalLimit ?? 0
    return prisma.card.create({ data: { userId, ...input, usedLimit, totalLimit, availableLimit: input.availableLimit ?? totalLimit - usedLimit } })
  },
}
