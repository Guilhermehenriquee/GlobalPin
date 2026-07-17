import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { alertParamsSchema, alertSchema } from './schema'
import { alertService } from './service'

export const alertController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await alertService.list(request.user.sub))
  },
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(alertSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await alertService.create(request.user.sub, body))
  },
  async read(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(alertParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await alertService.read(request.user.sub, params.id))
    } catch (error) {
      if ((error as Error).message === 'ALERT_NOT_FOUND') return reply.status(404).send({ message: 'Alerta não encontrado' })
      throw error
    }
  },
}
