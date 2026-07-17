import { Prisma, ProjectStatus } from '@prisma/client'
import { prisma } from '../../database/prisma'

export const projectRepository = {
  create(data: Prisma.ProjectUncheckedCreateInput) {
    return prisma.project.create({ data })
  },

  findMany(userId: string) {
    return prisma.project.findMany({ where: { userId }, orderBy: { soldAt: 'desc' } })
  },

  findManyByPeriod(userId: string, start: Date, end: Date) {
    return prisma.project.findMany({
      where: { userId, soldAt: { gte: start, lt: end } },
      orderBy: { soldAt: 'desc' },
    })
  },

  findById(userId: string, id: string) {
    return prisma.project.findFirst({ where: { id, userId } })
  },

  update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data })
  },

  delete(id: string) {
    return prisma.project.delete({ where: { id } })
  },

  markPaid(id: string) {
    return prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.PAID, paidAt: new Date() },
    })
  },
}
