import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../middlewares/auth'
import { transactionController } from './controller'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.post('/', transactionController.create)
  app.get('/', transactionController.list)
  app.get('/:id', transactionController.get)
  app.put('/:id', transactionController.update)
  app.delete('/:id', transactionController.delete)
  app.patch('/:id/pay', transactionController.pay)
  app.patch('/:id/receive', transactionController.receive)
}
