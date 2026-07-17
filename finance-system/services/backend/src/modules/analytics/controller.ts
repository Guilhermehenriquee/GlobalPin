import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { analyticsQuerySchema, classifyTextSchema } from './schema'
import { analyticsService } from './service'

export const analyticsController = {
  async summary(request: FastifyRequest, reply: FastifyReply) {
    const query = parseOrReply(analyticsQuerySchema, request.query, reply)
    if (!query) return
    return reply.send(await analyticsService.summary(request.user.sub, query))
  },

  async classifyText(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(classifyTextSchema, request.body, reply)
    if (!body) return
    return reply.send(analyticsService.classifyText(body))
  },

  async weeklyReport(_request: FastifyRequest, reply: FastifyReply) {
    return reply.send(analyticsService.weeklyReport())
  },
}
