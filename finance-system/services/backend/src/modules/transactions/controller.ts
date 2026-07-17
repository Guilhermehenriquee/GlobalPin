import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import {
  createTransactionSchema,
  transactionParamsSchema,
  transactionQuerySchema,
  updateTransactionSchema,
} from './schema'
import { transactionService } from './service'

function handleTransactionError(error: unknown, reply: FastifyReply) {
  const message = (error as Error).message
  if (message === 'TRANSACTION_NOT_FOUND') return reply.status(404).send({ message: 'Transação não encontrada' })
  if (message === 'INVALID_TRANSACTION_TYPE') return reply.status(400).send({ message: 'Tipo de transação inválido' })
  throw error
}

export const transactionController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(createTransactionSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await transactionService.create(request.user.sub, body))
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = parseOrReply(transactionQuerySchema, request.query, reply)
    if (!query) return
    return reply.send(await transactionService.list(request.user.sub, query))
  },

  async get(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(transactionParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await transactionService.get(request.user.sub, params.id))
    } catch (error) {
      return handleTransactionError(error, reply)
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(transactionParamsSchema, request.params, reply)
    const body = parseOrReply(updateTransactionSchema, request.body, reply)
    if (!params || !body) return
    try {
      return reply.send(await transactionService.update(request.user.sub, params.id, body))
    } catch (error) {
      return handleTransactionError(error, reply)
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(transactionParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await transactionService.delete(request.user.sub, params.id))
    } catch (error) {
      return handleTransactionError(error, reply)
    }
  },

  async pay(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(transactionParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await transactionService.pay(request.user.sub, params.id))
    } catch (error) {
      return handleTransactionError(error, reply)
    }
  },

  async receive(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(transactionParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await transactionService.receive(request.user.sub, params.id))
    } catch (error) {
      return handleTransactionError(error, reply)
    }
  },
}
