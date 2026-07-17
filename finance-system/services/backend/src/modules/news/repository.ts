import { prisma } from '../../database/prisma'
import { CreateNewsInput, UpdateNewsInput } from './types'

export const newsRepository = {
  list(userId: string) {
    return prisma.newsItem.findMany({
      where: { OR: [{ userId }, { userId: null }] },
      orderBy: { createdAt: 'desc' },
    })
  },

  create(userId: string, data: CreateNewsInput) {
    return prisma.newsItem.create({ data: { ...data, userId } })
  },

  findById(userId: string, id: string) {
    return prisma.newsItem.findFirst({ where: { id, OR: [{ userId }, { userId: null }] } })
  },

  update(userId: string, id: string, data: UpdateNewsInput) {
    return prisma.newsItem.update({ where: { id }, data: { ...data, userId } })
  },
}
