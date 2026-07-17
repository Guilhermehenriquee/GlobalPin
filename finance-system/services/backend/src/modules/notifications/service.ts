import { notificationRepository } from './repository'

export const notificationService = {
  list(userId: string) {
    return notificationRepository.list(userId)
  },

  read(userId: string, id: string) {
    return notificationRepository.markAsRead(userId, id)
  },
}
