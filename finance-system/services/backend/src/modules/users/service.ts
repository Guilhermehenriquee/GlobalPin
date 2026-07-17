import { userRepository } from './repository'

export const userService = {
  findById(id: string) {
    return userRepository.findById(id)
  },
}
