import { Server as HttpServer } from 'node:http'
import { FastifyInstance } from 'fastify'
import { Server } from 'socket.io'

let io: Server | null = null

export function initSocket(app: FastifyInstance) {
  app.addHook('onReady', async () => {
    io = new Server(app.server as HttpServer, {
      cors: { origin: '*' },
    })
  })
}

export const setupWebsocket = initSocket

export function getSocket() {
  if (!io) throw new Error('Socket.IO has not been initialized')
  return io
}

export function emitEvent(event: string, payload: unknown) {
  io?.emit(event, payload)
}
