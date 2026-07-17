import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { profileSchema } from './schema'
import { profileService } from './service'

export const profileController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await profileService.list(request.user.sub))
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(profileSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await profileService.create(request.user.sub, body))
  },
}
