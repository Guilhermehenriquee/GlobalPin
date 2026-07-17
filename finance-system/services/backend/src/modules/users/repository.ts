import { prisma } from '../../database/prisma'

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, salary: true, financialGoals: true, investorProfile: true, financialKnowledge: true, createdAt: true, updatedAt: true },
    })
  },
}
