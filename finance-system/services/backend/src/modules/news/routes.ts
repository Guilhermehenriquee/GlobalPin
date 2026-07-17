import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { newsController } from './controller'

export async function newsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get('/', newsController.list)
  app.post('/', newsController.create)
  app.put('/:id', newsController.update)
  app.patch('/:id/relevant', newsController.markRelevant)
}
