import { Prisma, TransactionStatus } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { TransactionFilters } from './types'

function buildWhere(userId: string, filters?: TransactionFilters): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId }

  if (filters?.profileId) where.profileId = filters.profileId
  if (filters?.type) where.type = filters.type
  if (filters?.status) where.status = filters.status
  if (filters?.category) where.categoryName = { equals: filters.category, mode: 'insensitive' }
  if (filters?.month && filters.year) {
    const start = new Date(filters.year, filters.month - 1, 1)
    const end = new Date(filters.year, filters.month, 1)
    where.dueDate = { gte: start, lt: end }
  }

  return where
}

export const transactionRepository = {
  create(data: Prisma.TransactionUncheckedCreateInput) {
    return prisma.transaction.create({ data })
  },

  findMany(userId: string, filters?: TransactionFilters) {
    return prisma.transaction.findMany({
      where: buildWhere(userId, filters),
      orderBy: { dueDate: 'asc' },
    })
  },

  findById(userId: string, id: string) {
    return prisma.transaction.findFirst({ where: { id, userId } })
  },

  update(id: string, data: Prisma.TransactionUpdateInput) {
    return prisma.transaction.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.transaction.delete({ where: { id } })
  },

  mark(id: string, status: TransactionStatus) {
    return prisma.transaction.update({
      where: { id },
      data: { status, paidAt: new Date() },
    })
  },
}
