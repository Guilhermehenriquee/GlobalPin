import { FinancialProfileType } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { ProfileInput } from './types'

export const profileRepository = {
  list(userId: string) {
    return prisma.financialProfile.findMany({ where: { userId }, orderBy: [{ type: 'asc' }, { createdAt: 'asc' }] })
  },

  create(userId: string, input: ProfileInput) {
    return prisma.financialProfile.create({ data: { userId, ...input } })
  },

  async ensureDefaults(userId: string) {
    const profiles = await this.list(userId)
    const hasPersonal = profiles.some((profile) => profile.type === FinancialProfileType.PERSONAL)
    const hasBusiness = profiles.some((profile) => profile.type === FinancialProfileType.BUSINESS)

    if (!hasPersonal) {
      await this.create(userId, { name: 'Pessoa fisica', type: FinancialProfileType.PERSONAL, color: '#31f3b7' })
    }

    if (!hasBusiness) {
      await this.create(userId, { name: 'Pessoa juridica', type: FinancialProfileType.BUSINESS, color: '#62a8ff' })
    }

    return this.list(userId)
  },
}
