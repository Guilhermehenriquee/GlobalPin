import { BankConnectionStatus, ConsentStatus, Prisma, TransactionDirection, TransactionSource } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { BankAccountInput, BankConnectionInput, OpenFinanceImportInput } from './types'

export const bankingRepository = {
  listConnections(userId: string) {
    return prisma.bankConnection.findMany({ where: { userId }, include: { accounts: true }, orderBy: { createdAt: 'desc' } })
  },

  async createConnection(userId: string, input: BankConnectionInput) {
    return prisma.bankConnection.create({
      data: {
        userId,
        provider: input.provider,
        bankName: input.bankName,
        status: BankConnectionStatus.PENDING,
        consents: {
          create: {
            userId,
            status: ConsentStatus.PENDING,
            permissions: ['ACCOUNTS_READ', 'TRANSACTIONS_READ', 'CREDIT_CARDS_READ'],
          },
        },
      },
      include: { consents: true },
    })
  },

  revokeConnection(userId: string, id: string) {
    return prisma.bankConnection.update({
      where: { id, userId },
      data: { status: BankConnectionStatus.REVOKED, revokedAt: new Date(), consents: { updateMany: { where: {}, data: { status: ConsentStatus.REVOKED, revokedAt: new Date() } } } },
    })
  },

  listAccounts(userId: string) {
    return prisma.bankAccount.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },

  createAccount(userId: string, input: BankAccountInput) {
    return prisma.bankAccount.create({ data: { userId, ...input } })
  },

  updateConnection(id: string, userId: string, data: Prisma.BankConnectionUpdateInput) {
    return prisma.bankConnection.update({ where: { id, userId }, data })
  },

  async importOpenFinanceData(userId: string, input: OpenFinanceImportInput) {
    return prisma.$transaction(async (tx) => {
      const accountsByExternalId = new Map<string, string>()
      let accounts = 0
      let transactions = 0
      let cards = 0
      let investments = 0

      for (const account of input.accounts ?? []) {
        const saved = account.externalId
          ? await tx.bankAccount.upsert({
              where: { userId_externalId: { userId, externalId: account.externalId } },
              create: { userId, bankConnectionId: input.bankConnectionId ?? account.bankConnectionId, ...account },
              update: { bankConnectionId: input.bankConnectionId ?? account.bankConnectionId, ...account },
            })
          : await tx.bankAccount.create({ data: { userId, bankConnectionId: input.bankConnectionId ?? account.bankConnectionId, ...account } })

        if (saved.externalId) accountsByExternalId.set(saved.externalId, saved.id)
        accounts += 1
      }

      for (const transaction of input.transactions ?? []) {
        const bankAccountId = transaction.bankAccountId ?? (transaction.bankAccountExternalId ? accountsByExternalId.get(transaction.bankAccountExternalId) : undefined)
        const data = {
          userId,
          profileId: input.profileId,
          bankAccountId,
          externalId: transaction.externalId,
          title: transaction.title,
          amount: transaction.amount,
          type: transaction.type,
          direction: transaction.direction ?? (transaction.type === 'RECEIVABLE' ? TransactionDirection.INCOME : TransactionDirection.EXPENSE),
          form: transaction.form,
          source: TransactionSource.OPEN_FINANCE,
          status: transaction.type === 'RECEIVABLE' ? 'RECEIVED' : 'PAID',
          originalDescription: transaction.originalDescription,
          categoryName: transaction.categoryName,
          subcategory: transaction.subcategory,
          merchant: transaction.merchant,
          recurrence: transaction.recurrence,
          dueDate: transaction.dueDate,
          paidAt: transaction.paidAt,
          notes: transaction.notes,
        } satisfies Prisma.TransactionUncheckedCreateInput

        await tx.transaction.upsert({
          where: { userId_source_externalId: { userId, source: TransactionSource.OPEN_FINANCE, externalId: transaction.externalId } },
          create: data,
          update: data,
        })
        transactions += 1
      }

      for (const card of input.cards ?? []) {
        const bankAccountId = card.bankAccountExternalId ? accountsByExternalId.get(card.bankAccountExternalId) : undefined
        const totalLimit = card.totalLimit ?? 0
        const usedLimit = card.usedLimit ?? 0
        await tx.card.upsert({
          where: { userId_externalId: { userId, externalId: card.externalId } },
          create: {
            userId,
            profileId: input.profileId,
            bankAccountId,
            externalId: card.externalId,
            name: card.name,
            brand: card.brand,
            totalLimit,
            usedLimit,
            availableLimit: card.availableLimit ?? totalLimit - usedLimit,
            closingDay: card.closingDay,
            dueDay: card.dueDay,
            bestPurchaseDay: card.bestPurchaseDay,
          },
          update: {
            profileId: input.profileId,
            bankAccountId,
            name: card.name,
            brand: card.brand,
            totalLimit,
            usedLimit,
            availableLimit: card.availableLimit ?? totalLimit - usedLimit,
            closingDay: card.closingDay,
            dueDay: card.dueDay,
            bestPurchaseDay: card.bestPurchaseDay,
          },
        })
        cards += 1
      }

      for (const investment of input.investments ?? []) {
        await tx.investment.upsert({
          where: { userId_externalId: { userId, externalId: investment.externalId } },
          create: { userId, profileId: input.profileId, ...investment },
          update: { profileId: input.profileId, ...investment },
        })
        investments += 1
      }

      if (input.bankConnectionId) {
        await tx.bankConnection.update({
          where: { id: input.bankConnectionId, userId },
          data: { status: BankConnectionStatus.ACTIVE, metadata: { lastImportAt: new Date().toISOString(), source: 'OPEN_FINANCE_IMPORT' } },
        })
      }

      return { accounts, transactions, cards, investments }
    })
  },
}
