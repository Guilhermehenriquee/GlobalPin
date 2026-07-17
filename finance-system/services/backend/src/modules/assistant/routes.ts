import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { assistantController } from './controller'

export async function assistantRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)
  app.post('/ask', assistantController.ask)
}
