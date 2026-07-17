import { z } from 'zod'
import { dashboardQuerySchema } from './schema'

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>
