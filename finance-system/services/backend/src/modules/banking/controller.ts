import { FastifyReply, FastifyRequest } from 'fastify'
import { parseOrReply } from '../../utils/zod'
import { bankAccountSchema, bankConnectionSchema, bankingParamsSchema, openFinanceConsentSchema, openFinanceImportSchema, pluggyApiKeySchema, pluggyConnectTokenSchema, pluggyImportSchema } from './schema'
import { bankingService } from './service'

export const bankingController = {
  async listConnections(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await bankingService.listConnections(request.user.sub))
  },
  async createConnection(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(bankConnectionSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await bankingService.createConnection(request.user.sub, body))
  },
  async revokeConnection(request: FastifyRequest, reply: FastifyReply) {
    const params = parseOrReply(bankingParamsSchema, request.params, reply)
    if (!params) return
    return reply.send(await bankingService.revokeConnection(request.user.sub, params.id))
  },
  async listAccounts(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await bankingService.listAccounts(request.user.sub))
  },
  async createAccount(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(bankAccountSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await bankingService.createAccount(request.user.sub, body))
  },
  async createOpenFinanceConsent(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(openFinanceConsentSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await bankingService.createOpenFinanceConsent(request.user.sub, body))
  },
  async importOpenFinanceData(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(openFinanceImportSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await bankingService.importOpenFinanceData(request.user.sub, body))
  },
  async createPluggyApiKey(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(pluggyApiKeySchema, request.body, reply)
    if (!body) return
    return reply.send(await bankingService.createPluggyApiKey(body))
  },
  async createPluggyConnectToken(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(pluggyConnectTokenSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await bankingService.createPluggyConnectToken(request.user.sub, body))
  },
  async importPluggyItem(request: FastifyRequest, reply: FastifyReply) {
    const body = parseOrReply(pluggyImportSchema, request.body, reply)
    if (!body) return
    return reply.status(201).send(await bankingService.importPluggyItem(request.user.sub, body))
  },
}
