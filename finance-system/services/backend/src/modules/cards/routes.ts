import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { cardController } from './controller'

export async function cardRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/', cardController.list)
  app.post('/', cardController.create)
  app.post('/simulate-purchase', cardController.simulate)
}
