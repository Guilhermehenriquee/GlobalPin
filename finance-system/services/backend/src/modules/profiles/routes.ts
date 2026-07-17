import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { profileController } from './controller'

export async function profileRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/', profileController.list)
  app.post('/', profileController.create)
}
