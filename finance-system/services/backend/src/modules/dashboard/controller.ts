import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { dashboardQuerySchema } from './schema'
import { dashboardService } from './service'

export const dashboardController = {
  async summary(request: FastifyRequest, reply: FastifyReply) {
    const query = parseOrReply(dashboardQuerySchema, request.query, reply)
    if (!query) return
    return reply.send(await dashboardService.summary(request.user.sub, query))
  },
}
