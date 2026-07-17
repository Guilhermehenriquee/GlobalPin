import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { bankingController } from './controller'

export async function bankingRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/connections', bankingController.listConnections)
  app.post('/connections', bankingController.createConnection)
  app.patch('/connections/:id/revoke', bankingController.revokeConnection)
  app.post('/open-finance/consent', bankingController.createOpenFinanceConsent)
  app.post('/open-finance/import', bankingController.importOpenFinanceData)
  app.post('/pluggy/api-key', bankingController.createPluggyApiKey)
  app.post('/pluggy/connect-token', bankingController.createPluggyConnectToken)
  app.post('/pluggy/import', bankingController.importPluggyItem)
  app.get('/accounts', bankingController.listAccounts)
  app.post('/accounts', bankingController.createAccount)
}
