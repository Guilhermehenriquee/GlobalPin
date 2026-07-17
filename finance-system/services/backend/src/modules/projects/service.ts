import { NotificationType, ProjectStatus } from '@prisma/client'
import { prisma } from '../../database/prisma'
import { emitEvent } from '../../websocket/socket'
import { projectRepository } from './repository'
import { CreateProjectInput, UpdateProjectInput } from './types'

async function ensureProject(userId: string, id: string) {
  const project = await projectRepository.findById(userId, id)
  if (!project) throw new Error('PROJECT_NOT_FOUND')
  return project
}

export const projectService = {
  async create(userId: string, input: CreateProjectInput) {
    const { productName: _productName, returnValue: _returnValue, ...data } = input
    const project = await projectRepository.create({
      ...data,
      title: input.title ?? input.productName ?? '',
      amount: input.amount ?? input.returnValue ?? 0,
      userId,
    })
    emitEvent('project:created', project)
    emitEvent('dashboard:updated', { userId })
    return project
  },

  list(userId: string) {
    return projectRepository.findMany(userId)
  },

  async dashboard(userId: string) {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const projects = await projectRepository.findManyByPeriod(userId, start, end)

    const totalPending = projects
      .filter((project) => project.status === ProjectStatus.PENDING)
      .reduce((total, project) => total + Number(project.amount), 0)

    const paidProjects = projects.filter((project) => project.status === ProjectStatus.PAID)
    const totalReceived = paidProjects.reduce((total, project) => total + Number(project.amount), 0)
    const biggestSale = projects.reduce<(typeof projects)[number] | null>((biggest, project) => {
      if (!biggest || Number(project.amount) > Number(biggest.amount)) return project
      return biggest
    }, null)

    const salesByCategory = projects.reduce<Record<string, number>>((totals, project) => {
      totals[project.category] = (totals[project.category] ?? 0) + Number(project.amount)
      return totals
    }, {})

    return {
      totalPending,
      totalReceived,
      monthlyProfit: totalReceived,
      biggestSale,
      pendingClients: projects
        .filter((project) => project.status === ProjectStatus.PENDING)
        .map((project) => ({ id: project.id, client: project.client, title: project.title, value: Number(project.amount) })),
      salesByCategory,
    }
  },

  get(userId: string, id: string) {
    return ensureProject(userId, id)
  },

  async update(userId: string, id: string, input: UpdateProjectInput) {
    await ensureProject(userId, id)
    const { productName: _productName, returnValue: _returnValue, ...data } = input
    const project = await projectRepository.update(id, {
      ...data,
      ...(input.productName && !input.title ? { title: input.productName } : {}),
      ...(input.returnValue && !input.amount ? { amount: input.returnValue } : {}),
    })
    emitEvent('project:updated', project)
    emitEvent('dashboard:updated', { userId })
    return project
  },

  async delete(userId: string, id: string) {
    await ensureProject(userId, id)
    await projectRepository.delete(id)
    emitEvent('dashboard:updated', { userId })
    return { deleted: true }
  },

  async pay(userId: string, id: string) {
    const current = await ensureProject(userId, id)
    const project = await projectRepository.markPaid(id)

    await prisma.notification.create({
      data: {
        userId,
        type: NotificationType.SUCCESS,
        title: 'Projeto pago',
        message: `${current.title} foi marcado como pago.`,
      },
    })

    emitEvent('project:paid', project)
    emitEvent('dashboard:updated', { userId })
    return project
  },
}
