import { z } from 'zod'
import { creditAnalysisSchema } from './schema'

export type CreditAnalysisInput = z.infer<typeof creditAnalysisSchema>

export type CreditProviderOption = {
  name: string
  type: 'CONNECTED_BANK' | 'CREDIT_MARKETPLACE' | 'PAYROLL' | 'SECURED_LOAN' | 'BUSINESS_CREDIT'
  fit: 'HIGH' | 'MEDIUM' | 'LOW'
  reason: string
  nextStep: string
}
