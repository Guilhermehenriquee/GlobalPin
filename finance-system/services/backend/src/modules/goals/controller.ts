import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { goalSchema } from './schema'
import { goalService } from './service'

export const goalController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await goalService.list(request.user.sub))
  },
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(goalSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await goalService.create(request.user.sub, body))
  },
}
