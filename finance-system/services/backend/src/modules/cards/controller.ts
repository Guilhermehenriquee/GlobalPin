import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { parseOrReply } from '../../utils/zod'
import { cardSchema } from './schema'
import { cardService } from './service'

const simulateSchema = z.object({
  amount: z.coerce.number().positive(),
  installments: z.coerce.number().int().min(1).max(48),
  monthlyIncome: z.coerce.number().positive(),
})

export const cardController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await cardService.list(request.user.sub))
  },
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(cardSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await cardService.create(request.user.sub, body))
  },
  async simulate(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(simulateSchema, request.body, reply)
    if (!body) return
    return reply.send(cardService.simulatePurchase(body.amount, body.installments, body.monthlyIncome))
  },
}
