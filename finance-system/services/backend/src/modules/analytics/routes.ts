import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { analyticsController } from './controller'

export async function analyticsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.get('/summary', analyticsController.summary)
  app.post('/classify', analyticsController.classifyText)
  app.get('/weekly-report', analyticsController.weeklyReport)
}
