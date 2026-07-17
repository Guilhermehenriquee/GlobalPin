import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { createNewsSchema, newsParamsSchema, updateNewsSchema } from './schema'
import { newsService } from './service'

function handleNewsError(error: unknown, reply: FastifyReply) {
  if ((error as Error).message === 'NEWS_NOT_FOUND') {
    return reply.status(404).send({ message: 'Notícia não encontrada' })
  }
  throw error
}

export const newsController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await newsService.list(request.user.sub))
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(createNewsSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await newsService.create(request.user.sub, body))
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(newsParamsSchema, request.params, reply)
    const body = parseOrReply(updateNewsSchema, request.body, reply)
    if (!params || !body) return
    try {
      return reply.send(await newsService.update(request.user.sub, params.id, body))
    } catch (error) {
      return handleNewsError(error, reply)
    }
  },

  async markRelevant(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(newsParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await newsService.markRelevant(request.user.sub, params.id))
    } catch (error) {
      return handleNewsError(error, reply)
    }
  },
}
