import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { goalController } from './controller'

export async function goalRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/', goalController.list)
  app.post('/', goalController.create)
}
