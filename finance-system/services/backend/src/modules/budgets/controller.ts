import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { budgetQuerySchema, budgetSchema } from './schema'
import { budgetService } from './service'

export const budgetController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = parseOrReply(budgetQuerySchema, request.query, reply)
    if (!query) return
    return reply.send(await budgetService.list(request.user.sub, query))
  },
  async upsert(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(budgetSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await budgetService.upsert(request.user.sub, body))
  },
  async usage(request: FastifyRequest, reply: FastifyReply) {
    const query = parseOrReply(budgetQuerySchema, request.query, reply)
    if (!query) return
    return reply.send(await budgetService.usage(request.user.sub, query))
  },
}
