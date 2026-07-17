import { NotificationType, TransactionDirection, TransactionStatus, TransactionType } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { emitEvent } from '../../websocket/socket'
import { transactionRepository } from './repository'
import { CreateTransactionInput, TransactionFilters, UpdateTransactionInput } from './types'

async function ensureTransaction(userId: string, id: string) {
  const transaction = await transactionRepository.findById(userId, id)
  if (!transaction) throw new Error('TRANSACTION_NOT_FOUND')
  return transaction
}

function isTomorrow(date: Date) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  )
}

async function createTransactionNotifications(userId: string, input: CreateTransactionInput | UpdateTransactionInput) {
  const notifications = []

  if (input.amount !== undefined && Number(input.amount) >= 1000) {
    notifications.push({
      userId,
      type: NotificationType.WARNING,
      title: 'Valor alto registrado',
      message: `Uma movimentação de R$ ${Number(input.amount).toFixed(2)} foi registrada.`,
    })
  }

  if (
    input.type === TransactionType.PAYABLE &&
    (!input.status || input.status === TransactionStatus.PENDING) &&
    input.dueDate &&
    isTomorrow(input.dueDate)
  ) {
    notifications.push({
      userId,
      type: NotificationType.WARNING,
      title: 'Conta vence amanhã',
      message: `${input.title ?? input.name ?? 'Uma conta'} vence amanhã.`,
    })
  }

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications })
  }
}

function classifyTransaction(title: string) {
  const value = title.toLowerCase()
  if (value.includes('ifood') || value.includes('mercado') || value.includes('restaurante')) return { categoryName: 'Alimentação', subcategory: value.includes('ifood') ? 'Delivery' : undefined }
  if (value.includes('uber') || value.includes('99') || value.includes('metro')) return { categoryName: 'Transporte', subcategory: 'Aplicativo' }
  if (value.includes('netflix') || value.includes('spotify') || value.includes('amazon') || value.includes('icloud')) return { categoryName: 'Assinaturas' }
  if (value.includes('drogasil') || value.includes('farmacia')) return { categoryName: 'Saúde', subcategory: 'Farmácia' }
  if (value.includes('salario') || value.includes('pix recebido')) return { categoryName: 'Renda' }
  return { categoryName: undefined, subcategory: undefined }
}

export const transactionService = {
  async create(userId: string, input: CreateTransactionInput) {
    const { name: _name, ...data } = input
    const title = input.title ?? input.name ?? ''
    const classified = classifyTransaction(title)
    const transaction = await transactionRepository.create({
      ...data,
      title,
      categoryName: input.categoryName ?? classified.categoryName,
      subcategory: input.subcategory ?? classified.subcategory,
      direction: input.direction ?? (input.type === TransactionType.RECEIVABLE ? TransactionDirection.INCOME : TransactionDirection.EXPENSE),
      userId,
    })
    await createTransactionNotifications(userId, input)
    emitEvent('transaction:created', transaction)
    emitEvent('dashboard:updated', { userId })
    return transaction
  },

  list(userId: string, filters: TransactionFilters) {
    return transactionRepository.findMany(userId, filters)
  },

  get(userId: string, id: string) {
    return ensureTransaction(userId, id)
  },

  async update(userId: string, id: string, input: UpdateTransactionInput) {
    await ensureTransaction(userId, id)
    const { name: _name, ...data } = input
    const transaction = await transactionRepository.update(id, { ...data, ...(input.name && !input.title ? { title: input.name } : {}) })
    await createTransactionNotifications(userId, input)
    emitEvent('transaction:updated', transaction)
    emitEvent('dashboard:updated', { userId })
    return transaction
  },

  async delete(userId: string, id: string) {
    await ensureTransaction(userId, id)
    await transactionRepository.delete(id)
    emitEvent('transaction:deleted', { id, userId })
    emitEvent('dashboard:updated', { userId })
    return { deleted: true }
  },

  async pay(userId: string, id: string) {
    const current = await ensureTransaction(userId, id)
    if (current.type !== TransactionType.PAYABLE) throw new Error('INVALID_TRANSACTION_TYPE')
    const transaction = await transactionRepository.mark(id, TransactionStatus.PAID)
    emitEvent('transaction:paid', transaction)
    emitEvent('dashboard:updated', { userId })
    return transaction
  },

  async receive(userId: string, id: string) {
    const current = await ensureTransaction(userId, id)
    if (current.type !== TransactionType.RECEIVABLE) throw new Error('INVALID_TRANSACTION_TYPE')
    const transaction = await transactionRepository.mark(id, TransactionStatus.RECEIVED)
    emitEvent('transaction:received', transaction)
    emitEvent('dashboard:updated', { userId })
    return transaction
  },
}
