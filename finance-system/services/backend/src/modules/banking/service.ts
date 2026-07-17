import { bankingRepository } from './repository'
import { pluggyClient } from './pluggy'
import { BankAccountInput, BankConnectionInput, OpenFinanceConsentInput, OpenFinanceImportInput, PluggyApiKeyInput, PluggyConnectTokenInput, PluggyImportInput } from './types'

function buildAuthorizationUrl(connectionId: string, input: OpenFinanceConsentInput) {
  const authUrl = process.env.OPEN_FINANCE_AUTH_URL
  const clientId = process.env.OPEN_FINANCE_CLIENT_ID
  const redirectUri = input.redirectUri ?? process.env.OPEN_FINANCE_REDIRECT_URI

  if (!authUrl || !clientId || !redirectUri) {
    return null
  }

  const url = new URL(authUrl)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('scope', (input.permissions ?? ['ACCOUNTS_READ', 'TRANSACTIONS_READ', 'CREDIT_CARDS_READ']).join(' '))
  url.searchParams.set('state', connectionId)
  return url.toString()
}

export const bankingService = {
  listConnections: bankingRepository.listConnections,
  createConnection(userId: string, input: BankConnectionInput) {
    return bankingRepository.createConnection(userId, input)
  },
  revokeConnection(userId: string, id: string) {
    return bankingRepository.revokeConnection(userId, id)
  },
  listAccounts: bankingRepository.listAccounts,
  createAccount(userId: string, input: BankAccountInput) {
    return bankingRepository.createAccount(userId, input)
  },

  async createOpenFinanceConsent(userId: string, input: OpenFinanceConsentInput) {
    const connection = await bankingRepository.createConnection(userId, {
      provider: input.provider,
      bankName: input.bankName,
    })
    const authorizationUrl = buildAuthorizationUrl(connection.id, input)
    await bankingRepository.updateConnection(connection.id, userId, {
      metadata: {
        integrationReady: Boolean(authorizationUrl),
        permissions: input.permissions ?? ['ACCOUNTS_READ', 'TRANSACTIONS_READ', 'CREDIT_CARDS_READ'],
        redirectUri: input.redirectUri ?? process.env.OPEN_FINANCE_REDIRECT_URI ?? null,
      },
    })

    return {
      connection,
      authorizationUrl,
      integrationReady: Boolean(authorizationUrl),
      message: authorizationUrl
        ? 'Redirecione o usuario para authorizationUrl e importe os dados retornados pelo provedor.'
        : 'Configure OPEN_FINANCE_AUTH_URL, OPEN_FINANCE_CLIENT_ID e OPEN_FINANCE_REDIRECT_URI para ativar o fluxo real do provedor.',
    }
  },

  importOpenFinanceData(userId: string, input: OpenFinanceImportInput) {
    return bankingRepository.importOpenFinanceData(userId, input)
  },

  async createPluggyApiKey(input: PluggyApiKeyInput) {
    const apiKey = await pluggyClient.apiKey(input)
    return {
      apiKey,
      message: 'API Key da Pluggy gerada com sucesso.',
    }
  },

  async createPluggyConnectToken(userId: string, input: PluggyConnectTokenInput) {
    const connection = await bankingRepository.createConnection(userId, {
      provider: 'Pluggy',
      bankName: input.bankName ?? 'Pluggy',
    })
    const response = await pluggyClient.connectToken(input, userId)
    const connectToken = response.accessToken ?? response.connectToken ?? response.token
    if (!connectToken) throw new Error('Pluggy: o connect token não foi retornado.')

    await bankingRepository.updateConnection(connection.id, userId, {
      metadata: {
        provider: 'PLUGGY',
        itemId: input.itemId ?? null,
        clientUserId: input.clientUserId ?? userId,
        connectTokenCreatedAt: new Date().toISOString(),
      },
    })

    return {
      connection,
      connectToken,
      accessToken: connectToken,
      expiresIn: response.expiresIn,
      integrationReady: true,
      message: 'Connect Token da Pluggy gerado. Use esse token no Pluggy Connect para o usuário autorizar o banco.',
    }
  },

  async importPluggyItem(userId: string, input: PluggyImportInput) {
    const payload = await pluggyClient.importPayload(input)
    let bankConnectionId = input.bankConnectionId

    if (!bankConnectionId) {
      const connection = await bankingRepository.createConnection(userId, {
        provider: 'Pluggy',
        bankName: payload.accounts?.[0]?.bankName ?? 'Pluggy',
      })
      bankConnectionId = connection.id
    }

    const result = await bankingRepository.importOpenFinanceData(userId, {
      ...payload,
      bankConnectionId,
    })

    await bankingRepository.updateConnection(bankConnectionId, userId, {
      consentId: input.itemId,
      metadata: {
        provider: 'PLUGGY',
        itemId: input.itemId,
        lastImportAt: new Date().toISOString(),
        summary: result,
      },
    })

    return {
      bankConnectionId,
      ...result,
      message: `Importação Pluggy concluída: ${result.accounts} contas, ${result.transactions} transações, ${result.cards} cartões e ${result.investments} investimentos.`,
    }
  },
}
