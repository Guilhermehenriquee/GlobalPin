import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { notificationParamsSchema } from './schema'
import { notificationService } from './service'

export const notificationController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await notificationService.list(request.user.sub))
  },

  async read(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(notificationParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await notificationService.read(request.user.sub, params.id))
    } catch (error) {
      if ((error as Error).message === 'NOTIFICATION_NOT_FOUND') {
        return reply.status(404).send({ message: 'Notificação não encontrada' })
      }
      throw error
    }
  },
}
