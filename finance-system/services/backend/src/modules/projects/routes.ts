import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { projectController } from './controller'

export async function projectRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.post('/', projectController.create)
  app.get('/', projectController.list)
  app.get('/dashboard', projectController.dashboard)
  app.get('/:id', projectController.get)
  app.put('/:id', projectController.update)
  app.delete('/:id', projectController.delete)
  app.patch('/:id/pay', projectController.pay)
}
