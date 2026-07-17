import { FastifyReply } from 'fastify'
import { ZodError, ZodSchema } from 'zod'

export function parseOrReply<T>(schema: ZodSchema<T>, data: unknown, reply: FastifyReply): T | null {
  const result = schema.safeParse(data)

  if (!result.success) {
    reply.status(400).send({
      message: 'Erro de validação',
      issues: result.error instanceof ZodError ? result.error.issues : [],
    })
    return null
  }

  return result.data
}
