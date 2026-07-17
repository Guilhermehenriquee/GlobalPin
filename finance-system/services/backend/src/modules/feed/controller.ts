import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { feedQuerySchema } from './schema'
import { feedService } from './service'

export const feedController = {
  async home(request: FastifyRequest, reply: FastifyReply) {
    const query = parseOrReply(feedQuerySchema, request.query, reply)
    if (!query) return
    return reply.send(await feedService.home(request.user.sub, query))
  },
}
