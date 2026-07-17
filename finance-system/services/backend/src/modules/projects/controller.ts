import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { createProjectSchema, projectParamsSchema, updateProjectSchema } from './schema'
import { projectService } from './service'

function handleProjectError(error: unknown, reply: FastifyReply) {
  if ((error as Error).message === 'PROJECT_NOT_FOUND') {
    return reply.status(404).send({ message: 'Projeto não encontrado' })
  }
  throw error
}

export const projectController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(createProjectSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await projectService.create(request.user.sub, body))
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await projectService.list(request.user.sub))
  },

  async dashboard(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await projectService.dashboard(request.user.sub))
  },

  async get(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(projectParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await projectService.get(request.user.sub, params.id))
    } catch (error) {
      return handleProjectError(error, reply)
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(projectParamsSchema, request.params, reply)
    const body = parseOrReply(updateProjectSchema, request.body, reply)
    if (!params || !body) return
    try {
      return reply.send(await projectService.update(request.user.sub, params.id, body))
    } catch (error) {
      return handleProjectError(error, reply)
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(projectParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await projectService.delete(request.user.sub, params.id))
    } catch (error) {
      return handleProjectError(error, reply)
    }
  },

  async pay(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(projectParamsSchema, request.params, reply)
    if (!params) return
    try {
      return reply.send(await projectService.pay(request.user.sub, params.id))
    } catch (error) {
      return handleProjectError(error, reply)
    }
  },
}
