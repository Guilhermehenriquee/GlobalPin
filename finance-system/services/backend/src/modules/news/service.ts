import { newsRepository } from './repository'
import { CreateNewsInput, UpdateNewsInput } from './types'

async function ensureNews(userId: string, id: string) {
  const news = await newsRepository.findById(userId, id)
  if (!news) throw new Error('NEWS_NOT_FOUND')
  return news
}

export const newsService = {
  list(userId: string) {
    return newsRepository.list(userId)
  },

  create(userId: string, input: CreateNewsInput) {
    return newsRepository.create(userId, input)
  },

  async update(userId: string, id: string, input: UpdateNewsInput) {
    await ensureNews(userId, id)
    return newsRepository.update(userId, id, input)
  },

  async markRelevant(userId: string, id: string) {
    await ensureNews(userId, id)
    return newsRepository.update(userId, id, { isRelevant: true })
  },
}
