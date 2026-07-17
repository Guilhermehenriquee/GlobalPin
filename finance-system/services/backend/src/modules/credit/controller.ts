import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { creditAnalysisSchema } from './schema'
import { creditService } from './service'

export const creditController = {
  async analyze(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(creditAnalysisSchema, request.body ?? {}, reply)
    if (!body) return
    return reply.send(await creditService.analyze(request.user.sub, body))
  },
}
