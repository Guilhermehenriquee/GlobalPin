import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { creditController } from './controller'

export async function creditRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.post('/analyze', creditController.analyze)
}
