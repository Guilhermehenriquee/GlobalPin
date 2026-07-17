import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { notificationController } from './controller'

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/', notificationController.list)
  app.patch('/:id/read', notificationController.read)
}
