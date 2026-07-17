import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { investmentSchema } from './schema'
import { investmentService } from './service'

export const investmentController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await investmentService.list(request.user.sub))
  },
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(investmentSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await investmentService.create(request.user.sub, body))
  },
  async summary(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await investmentService.summary(request.user.sub))
  },
}
