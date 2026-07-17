import { alertRepository } from './repository'
import { AlertInput } from './types'

export const alertService = {
  list: alertRepository.list,
  create(userId: string, input: AlertInput) {
    return alertRepository.create(userId, input)
  },
  read(userId: string, id: string) {
    return alertRepository.read(userId, id)
  },
}
