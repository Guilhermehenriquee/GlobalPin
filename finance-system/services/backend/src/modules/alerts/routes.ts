import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { alertController } from './controller'

export async function alertRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/', alertController.list)
  app.post('/', alertController.create)
  app.patch('/:id/read', alertController.read)
}
