import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { authRepository } from './repository'
import { LoginInput, RegisterInput } from './types'

export const authService = {
  async register(input: RegisterInput, app: FastifyInstance) {
    const existingUser = await authRepository.findUserByEmail(input.email)
    if (existingUser) {
      throw new Error('EMAIL_ALREADY_IN_USE')
    }

    const passwordHash = await bcrypt.hash(input.password, 10)
    const user = await authRepository.createUser({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      salary: input.salary ?? input.netSalary ?? 0,
      financialGoals: input.financialGoals ?? [],
      investorProfile: input.investorProfile,
      financialKnowledge: input.financialKnowledge,
    })

    const token = app.jwt.sign({ sub: user.id })
    return { user, token }
  },

  async login(input: LoginInput, app: FastifyInstance) {
    const user = await authRepository.findUserByEmail(input.email)
    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash)
    if (!passwordMatches) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const token = app.jwt.sign({ sub: user.id })
    const { passwordHash: _passwordHash, ...safeUser } = user

    return { user: safeUser, token }
  },

  me(userId: string) {
    return authRepository.findUserById(userId)
  },
}
