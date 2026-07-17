import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { authController } from './controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', authController.register)
  app.post('/login', authController.login)
  app.get('/me', { preHandler: [authMiddleware] }, authController.me)
}
