import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { budgetController } from './controller'

export async function budgetRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/', budgetController.list)
  app.post('/', budgetController.upsert)
  app.get('/usage', budgetController.usage)
}
