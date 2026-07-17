import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { loginSchema, registerSchema } from './schema'
import { authService } from './service'

export const authController = {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(registerSchema, request.body, reply)
    if (!body) return

    try {
      return reply.status(201).send(await authService.register(body, request.server))
    } catch (error) {
      if ((error as Error).message === 'EMAIL_ALREADY_IN_USE') {
        return reply.status(409).send({ message: 'E-mail já está em uso' })
      }
      throw error
    }
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(loginSchema, request.body, reply)
    if (!body) return

    try {
      return reply.send(await authService.login(body, request.server))
    } catch (error) {
      if ((error as Error).message === 'INVALID_CREDENTIALS') {
        return reply.status(401).send({ message: 'E-mail ou senha inválidos' })
      }
      throw error
    }
  },

  async me(request: FastifyRequest, reply: FastifyReply) {
    const user = await authService.me(request.user.sub)
    if (!user) return reply.status(404).send({ message: 'Usuário não encontrado' })
    return reply.send(user)
  },
}
