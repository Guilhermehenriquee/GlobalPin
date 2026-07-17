import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { assistantQuestionSchema } from './schema'
import { assistantService } from './service'

export const assistantController = {
  async ask(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(assistantQuestionSchema, request.body, reply)
    if (!body) return
    return reply.send(await assistantService.ask(request.user.sub, body))
  },
}
