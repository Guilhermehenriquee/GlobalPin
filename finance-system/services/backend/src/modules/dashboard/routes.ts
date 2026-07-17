import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { dashboardController } from './controller'

export async function dashboardRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authMiddleware] }, dashboardController.summary)
}
