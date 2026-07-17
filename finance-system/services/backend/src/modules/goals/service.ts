import { goalRepository } from './repository'
import { GoalInput } from './types'

export const goalService = {
  list: goalRepository.list,
  create(userId: string, input: GoalInput) {
    return goalRepository.create(userId, input)
  },
}
