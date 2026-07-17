import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { investmentController } from './controller'

export async function investmentRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.get('/', investmentController.list)
  app.post('/', investmentController.create)
  app.get('/summary', investmentController.summary)
}
