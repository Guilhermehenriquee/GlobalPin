import 'dotenv/config'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import Fastify from 'fastify'
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import { authRoutes } from './modules/auth/routes'
import { analyticsRoutes } from './modules/analytics/routes'
import { alertRoutes } from './modules/alerts/routes'
import { assistantRoutes } from './modules/assistant/routes'
import { bankingRoutes } from './modules/banking/routes'
import { budgetRoutes } from './modules/budgets/routes'
import { cardRoutes } from './modules/cards/routes'
import { creditRoutes } from './modules/credit/routes'
import { dashboardRoutes } from './modules/dashboard/routes'
import { feedRoutes } from './modules/feed/routes'
import { goalRoutes } from './modules/goals/routes'
import { investmentRoutes } from './modules/investments/routes'
import { newsRoutes } from './modules/news/routes'
import { notificationRoutes } from './modules/notifications/routes'
import { profileRoutes } from './modules/profiles/routes'
import { projectRoutes } from './modules/projects/routes'
import { transactionRoutes } from './modules/transactions/routes'
import { prisma } from './database/prisma'
import { setupWebsocket } from './websocket/socket'

const app = Fastify({ logger: true })
const webRoot = join(process.cwd(), 'apps', 'web')

async function bootstrap() {
  await app.register(cors, { origin: true })
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'super-secret',
  })

  setupWebsocket(app)

  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(transactionRoutes, { prefix: '/transactions' })
  await app.register(projectRoutes, { prefix: '/projects' })
  await app.register(dashboardRoutes, { prefix: '/dashboard' })
  await app.register(feedRoutes, { prefix: '/feed' })
  await app.register(notificationRoutes, { prefix: '/notifications' })
  await app.register(profileRoutes, { prefix: '/profiles' })
  await app.register(newsRoutes, { prefix: '/news' })
  await app.register(analyticsRoutes, { prefix: '/analytics' })
  await app.register(bankingRoutes, { prefix: '/banking' })
  await app.register(budgetRoutes, { prefix: '/budgets' })
  await app.register(goalRoutes, { prefix: '/goals' })
  await app.register(cardRoutes, { prefix: '/cards' })
  await app.register(creditRoutes, { prefix: '/credit' })
  await app.register(investmentRoutes, { prefix: '/investments' })
  await app.register(alertRoutes, { prefix: '/alerts' })
  await app.register(assistantRoutes, { prefix: '/assistant' })

  app.get('/', async () => ({ ok: true, name: 'finance-system', version: '1.0.0' }))
  app.get('/app', async (_request, reply) => {
    return reply.type('text/html').send(createReadStream(join(webRoot, 'index.html')))
  })
  app.get('/app/app.js', async (_request, reply) => {
    return reply.type('application/javascript').send(createReadStream(join(webRoot, 'app.js')))
  })
  app.get('/app/styles.css', async (_request, reply) => {
    return reply.type('text/css').send(createReadStream(join(webRoot, 'styles.css')))
  })
  app.get('/app/manifest.json', async (_request, reply) => {
    return reply.type('application/manifest+json').send(createReadStream(join(webRoot, 'manifest.json')))
  })
  app.get('/app/sw.js', async (_request, reply) => {
    return reply.type('application/javascript').send(createReadStream(join(webRoot, 'sw.js')))
  })
  app.get('/app/icon.svg', async (_request, reply) => {
    return reply.type('image/svg+xml').send(createReadStream(join(webRoot, 'icon.svg')))
  })
  app.get('/app/logo.svg', async (_request, reply) => {
    return reply.type('image/svg+xml').send(createReadStream(join(webRoot, 'logo.svg')))
  })
  app.get('/app/onboarding-illustration.svg', async (_request, reply) => {
    return reply.type('image/svg+xml').send(createReadStream(join(webRoot, 'onboarding-illustration.svg')))
  })
  app.get('/health', async () => ({ ok: true }))

  const port = Number(process.env.PORT ?? 3333)
  await app.listen({ port, host: '0.0.0.0' })
}

bootstrap().catch(async (error) => {
  app.log.error(error)
  await prisma.$disconnect()
  process.exit(1)
})
