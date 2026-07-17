import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { feedController } from './controller'

export async function feedRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authMiddleware] }, feedController.home)
}
