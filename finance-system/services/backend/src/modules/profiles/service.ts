import { profileRepository } from './repository'
import { ProfileInput } from './types'

export const profileService = {
  list(userId: string) {
    return profileRepository.ensureDefaults(userId)
  },

  create(userId: string, input: ProfileInput) {
    return profileRepository.create(userId, input)
  },
}
