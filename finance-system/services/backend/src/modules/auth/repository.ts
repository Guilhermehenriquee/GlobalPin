import { Prisma } from '@prisma/client'
import { prisma } from '../../database/prisma'

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, salary: true, financialGoals: true, investorProfile: true, financialKnowledge: true, createdAt: true, updatedAt: true },
    })
  },

  createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, phone: true, salary: true, financialGoals: true, investorProfile: true, financialKnowledge: true, createdAt: true, updatedAt: true },
    })
  },
}
