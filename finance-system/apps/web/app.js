const API_URL = window.location.protocol.startsWith('http') ? window.location.origin : 'http://localhost:3333'
const tokenKey = 'finance-system-token'
const profileKey = 'finance-system-profile-id'
const viewKey = 'finance-system-view'

const authView = document.querySelector('#authView')
const appView = document.querySelector('#appView')
const authMessage = document.querySelector('#authMessage')
const sidebarNav = document.querySelector('#sidebarNav')
const mobileNav = document.querySelector('#mobileNav')
const viewRoot = document.querySelector('#viewRoot')
const viewEyebrow = document.querySelector('#viewEyebrow')
const viewTitle = document.querySelector('#viewTitle')
const viewSubtitle = document.querySelector('#viewSubtitle')
const mobileTitle = document.querySelector('#mobileTitle')
const mobileSubtitle = document.querySelector('#mobileSubtitle')
const profileSwitch = document.querySelector('#profileSwitch')
const installButton = document.querySelector('#installButton')
const toast = document.querySelector('#toast')

const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const NAV_ITEMS = [
  { id: 'today', label: 'Hoje', icon: 'sun', group: 'Dia', title: 'Home inteligente', subtitle: 'Feed diário, score, alertas e decisões rápidas.' },
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', group: 'Dia', title: 'Dashboard financeiro', subtitle: 'Visão ampla de caixa, saldo, pendências e patrimônio.' },
  { id: 'ai', label: 'IA Financeira', icon: 'bot', group: 'Dia', title: 'IA Financeira', subtitle: 'Pergunte antes de gastar, parcelar, investir ou pedir crédito.' },
  { id: 'transactions', label: 'Transações', icon: 'transactions', group: 'Controle', title: 'Transações', subtitle: 'Movimentações manuais, importadas ou via Open Finance.' },
  { id: 'accounts', label: 'Contas', icon: 'bank', group: 'Controle', title: 'Contas bancárias', subtitle: 'Bancos, saldos, conexões e consentimentos.' },
  { id: 'cards', label: 'Cartões', icon: 'card', group: 'Controle', title: 'Cartões', subtitle: 'Limite, fatura, melhor dia de compra e simulação.' },
  { id: 'budgets', label: 'Orçamentos', icon: 'budget', group: 'Planejamento', title: 'Orçamentos', subtitle: 'Limites por categoria com acompanhamento mensal.' },
  { id: 'goals', label: 'Metas', icon: 'target', group: 'Planejamento', title: 'Metas financeiras', subtitle: 'Objetivos, prazos e quanto guardar por mês.' },
  { id: 'debts', label: 'Dívidas', icon: 'warning', group: 'Planejamento', title: 'Dívidas', subtitle: 'Pendências e ordem inteligente de quitação.' },
  { id: 'credit', label: 'Empréstimos', icon: 'loan', group: 'Planejamento', title: 'Análise de crédito', subtitle: 'Estimativa de parcela segura, risco e melhor caminho.' },
  { id: 'investments', label: 'Investimentos', icon: 'trend', group: 'Patrimônio', title: 'Investimentos', subtitle: 'Carteira, risco, liquidez e educação financeira.' },
  { id: 'pj', label: 'Projetos PJ', icon: 'briefcase', group: 'Negócio', title: 'Projetos PJ', subtitle: 'Vendas, clientes, recebimentos e lucro do mês.' },
  { id: 'news', label: 'Jornal Inteligente', icon: 'news', group: 'Inteligência', title: 'Jornal inteligente', subtitle: 'Notícias resumidas pela IA e conectadas ao seu dinheiro.' },
  { id: 'alerts', label: 'Alertas', icon: 'bell', group: 'Inteligência', title: 'Alertas inteligentes', subtitle: 'Avisos de risco, oportunidade, contas e anomalias.' },
  { id: 'score', label: 'Score', icon: 'star', group: 'Inteligência', title: 'Score financeiro', subtitle: 'Seu índice de saúde financeira e missões de melhoria.' },
  { id: 'data', label: 'Central de Dados', icon: 'database', group: 'Sistema', title: 'Central de Dados', subtitle: 'Fontes reais usadas pela IA para analisar sua vida financeira.' },
  { id: 'settings', label: 'Configurações', icon: 'settings', group: 'Sistema', title: 'Configurações', subtitle: 'Perfil, privacidade, segurança e preferências.' },
]

const MOBILE_NAV = [
  { id: 'today', label: 'Hoje', icon: 'sun' },
  { id: 'transactions', label: 'Transações', icon: 'transactions' },
  { id: 'ai', label: 'IA', icon: 'bot' },
  { id: 'goals', label: 'Metas', icon: 'target' },
  { id: 'menu', label: 'Menu', icon: 'menu' },
]

function icon(paths) {
  return `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
}

const ICONS = {
  sun: icon('<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />'),
  dashboard: icon('<rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" />'),
  bot: icon('<path d="M12 5V3" /><rect x="5" y="7" width="14" height="10" rx="3" /><path d="M8 21h8M9 12h.01M15 12h.01M9 16h6" />'),
  transactions: icon('<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />'),
  bank: icon('<path d="M3 10h18L12 4 3 10Z" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8M4 18h16M3 21h18" />'),
  card: icon('<rect x="3" y="6" width="18" height="12" rx="3" /><path d="M3 10h18M7 15h4" />'),
  budget: icon('<path d="M4 19V5M4 19h17" /><path d="M8 16v-5M12 16V8M16 16v-7M20 16v-3" />'),
  target: icon('<circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 12h.01" />'),
  warning: icon('<path d="M12 4 3 20h18L12 4Z" /><path d="M12 9v5M12 17h.01" />'),
  loan: icon('<rect x="3" y="7" width="18" height="12" rx="3" /><path d="M7 11h5M7 15h3M16 15c1.2 0 2-.7 2-1.7S17.2 11.6 16 11.6h-1.5V17" />'),
  trend: icon('<path d="M4 17 9 12l4 4 7-8" /><path d="M14 8h6v6" />'),
  briefcase: icon('<rect x="4" y="7" width="16" height="12" rx="2" /><path d="M9 7V5h6v2M4 12h16M12 12v2" />'),
  news: icon('<path d="M5 5h11a3 3 0 0 1 3 3v11H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M7 9h6M7 13h8M7 17h5M16 5v14" />'),
  bell: icon('<path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z" /><path d="M9.5 20a2.5 2.5 0 0 0 5 0" />'),
  star: icon('<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />'),
  database: icon('<ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />'),
  settings: icon('<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-2 .2 1.7 1.7 0 0 0-.7 1.5H9.1a1.7 1.7 0 0 0-.7-1.5 1.7 1.7 0 0 0-2-.2l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 2-.2 1.7 1.7 0 0 0 .7-1.5h5.8a1.7 1.7 0 0 0 .7 1.5 1.7 1.7 0 0 0 2 .2l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z" />'),
  menu: icon('<path d="M4 7h16M4 12h16M4 17h16" />'),
}

function renderIcon(name) {
  return ICONS[name] || ICONS.dashboard
}

const state = {
  activeView: localStorage.getItem(viewKey) || 'today',
  activeProfileId: localStorage.getItem(profileKey) || '',
  user: null,
  profiles: [],
  dashboard: null,
  feed: null,
  transactions: [],
  accounts: [],
  connections: [],
  cards: [],
  budgets: [],
  goals: [],
  projects: [],
  alerts: [],
  news: [],
  investments: [],
  investmentSummary: null,
  projectDashboard: null,
  pluggyConnectToken: '',
}

let deferredInstallPrompt
let toastTimer

function getToken() {
  return localStorage.getItem(tokenKey)
}

function setToken(token) {
  localStorage.setItem(tokenKey, token)
}

function clearSession() {
  localStorage.removeItem(tokenKey)
  localStorage.removeItem(profileKey)
}

function numberValue(value) {
  const number = Number(value ?? 0)
  return Number.isFinite(number) ? number : 0
}

function money(value) {
  return moneyFormatter.format(numberValue(value))
}

function percent(value) {
  return `${Math.max(0, Math.min(100, Math.round(numberValue(value))))}%`
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function currentMonth() {
  return new Date().getMonth() + 1
}

function currentYear() {
  return new Date().getFullYear()
}

function formatDate(value) {
  if (!value) return 'Sem data'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sem data'
  return dateFormatter.format(date)
}

const UI_LABELS = {
  accountType: {
    CHECKING: 'Conta corrente',
    SAVINGS: 'Poupança',
    PAYMENT: 'Pagamento',
    INVESTMENT: 'Investimento',
  },
  source: {
    MANUAL: 'Manual',
    OPEN_FINANCE: 'Open Finance',
    IMPORTED: 'Importado',
  },
  projectStatus: {
    PENDING: 'Pendente',
    PAID: 'Pago',
    CANCELED: 'Cancelado',
  },
  projectCategory: {
    SYSTEMS: 'Sistemas',
    SERVICES: 'Serviços',
    SPORTS: 'Esportivos',
    ELECTRONICS: 'Eletrônicos',
    OTHER: 'Outro',
  },
  severity: {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
  },
  risk: {
    LOW: 'Baixo',
    MEDIUM: 'Médio',
    HIGH: 'Alto',
  },
  liquidity: {
    DAILY: 'Diária',
    AT_MATURITY: 'No vencimento',
    IMMEDIATE: 'Imediata',
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
  },
  newsCategory: {
    FINANCE: 'Finanças',
    BUSINESS: 'Negócios',
    TECH: 'Tecnologia',
    SPORTS: 'Esportes',
    ELECTRONICS: 'Eletrônicos',
  },
  feedType: {
    insight: 'Insight',
    score: 'Score',
    opportunity: 'Oportunidade',
    card: 'Cartão',
    spending: 'Gasto',
    goal: 'Meta',
    alert: 'Alerta',
  },
}

function uiLabel(group, value, fallback = '') {
  if (!value) return fallback
  return UI_LABELS[group]?.[value] || fallback || String(value)
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formToJson(form) {
  const data = Object.fromEntries(new FormData(form).entries())
  Object.keys(data).forEach((key) => {
    if (data[key] === '') delete data[key]
  })
  return data
}

function queryWithProfile(extra = {}) {
  const params = new URLSearchParams()
  if (state.activeProfileId) params.set('profileId', state.activeProfileId)
  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}

function withActiveProfile(body) {
  if (state.activeProfileId && !body.profileId) body.profileId = state.activeProfileId
  return body
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message ?? 'Erro ao chamar API')
  return data
}

async function safeRequest(path, fallback) {
  try {
    return await request(path)
  } catch {
    return fallback
  }
}

function friendlyError(error) {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Não consegui conectar na API. Rode npm run dev e tente novamente.'
  }
  return error?.message || 'Algo deu errado.'
}

function showToast(message) {
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600)
}

function setInlineMessage(id, message, success = false) {
  const element = document.querySelector(`#${id}`)
  if (!element) return
  element.textContent = message
  element.style.color = success ? '#a7f3d0' : '#fecaca'
}

function activeNavItem() {
  return NAV_ITEMS.find((item) => item.id === state.activeView) || NAV_ITEMS[0]
}

function routeView(view) {
  state.activeView = view
  localStorage.setItem(viewKey, view)
  renderShell()
  renderView()
}

function renderNav() {
  const groups = [...new Set(NAV_ITEMS.map((item) => item.group))]
  sidebarNav.innerHTML = groups
    .map((group) => {
      const items = NAV_ITEMS.filter((item) => item.group === group)
      return `
        <div class="nav-section">${group}</div>
        ${items
          .map(
            (item) => `
              <button class="nav-button ${item.id === state.activeView ? 'active' : ''}" type="button" data-view="${item.id}">
                <span class="nav-icon">${renderIcon(item.icon)}</span>
                <span>${item.label}</span>
              </button>
            `,
          )
          .join('')}
      `
    })
    .join('')

  mobileNav.innerHTML = MOBILE_NAV.map(
    (item) => `
      <button class="nav-button ${item.id === state.activeView || (item.id === 'menu' && !MOBILE_NAV.some((nav) => nav.id === state.activeView)) ? 'active' : ''}" type="button" data-view="${item.id}">
        <span class="nav-icon">${renderIcon(item.icon)}</span>
        <span>${item.label}</span>
      </button>
    `,
  ).join('')
}

function renderProfiles() {
  if (!state.profiles.length) {
    profileSwitch.innerHTML = ''
    return
  }

  if (!state.activeProfileId || !state.profiles.some((profile) => profile.id === state.activeProfileId)) {
    state.activeProfileId = state.profiles[0].id
    localStorage.setItem(profileKey, state.activeProfileId)
  }

  profileSwitch.innerHTML = state.profiles
    .map((profile) => {
      const label = profile.type === 'BUSINESS' ? 'PJ' : 'PF'
      return `<button class="profile-button ${profile.id === state.activeProfileId ? 'active' : ''}" type="button" data-profile-id="${profile.id}">${label}</button>`
    })
    .join('')
}

function renderShell() {
  const item = activeNavItem()
  viewEyebrow.textContent = item.group
  viewTitle.textContent = item.title
  viewSubtitle.textContent = item.subtitle
  mobileTitle.textContent = item.label
  mobileSubtitle.textContent = state.user ? `Olá, ${state.user.name}` : 'Finance System'
  renderProfiles()
  renderNav()
}

async function loadApp() {
  const user = await request('/auth/me')
  const profiles = await safeRequest('/profiles', [])
  state.user = user
  state.profiles = Array.isArray(profiles) ? profiles : []

  if (!state.activeProfileId && state.profiles[0]) {
    state.activeProfileId = state.profiles[0].id
    localStorage.setItem(profileKey, state.activeProfileId)
  }

  const profileQuery = queryWithProfile()
  const monthQuery = queryWithProfile({ month: currentMonth(), year: currentYear() })

  const [
    dashboard,
    feed,
    transactions,
    accounts,
    connections,
    cards,
    budgets,
    goals,
    projects,
    projectDashboard,
    alerts,
    news,
    investments,
    investmentSummary,
  ] = await Promise.all([
    safeRequest(`/dashboard${profileQuery}`, {}),
    safeRequest(`/feed${profileQuery}`, {}),
    safeRequest(`/transactions${profileQuery}`, []),
    safeRequest('/banking/accounts', []),
    safeRequest('/banking/connections', []),
    safeRequest(`/cards${profileQuery}`, []),
    safeRequest(`/budgets${monthQuery}`, []),
    safeRequest(`/goals${profileQuery}`, []),
    safeRequest(`/projects${profileQuery}`, []),
    safeRequest('/projects/dashboard', {}),
    safeRequest('/alerts', []),
    safeRequest('/news', []),
    safeRequest(`/investments${profileQuery}`, []),
    safeRequest('/investments/summary', {}),
  ])

  state.dashboard = dashboard || {}
  state.feed = feed || {}
  state.transactions = Array.isArray(transactions) ? transactions : []
  state.accounts = Array.isArray(accounts) ? accounts : []
  state.connections = Array.isArray(connections) ? connections : []
  state.cards = Array.isArray(cards) ? cards : []
  state.budgets = Array.isArray(budgets) ? budgets : []
  state.goals = Array.isArray(goals) ? goals : []
  state.projects = Array.isArray(projects) ? projects : []
  state.projectDashboard = projectDashboard || {}
  state.alerts = Array.isArray(alerts) ? alerts : []
  state.news = Array.isArray(news) ? news : []
  state.investments = Array.isArray(investments) ? investments : []
  state.investmentSummary = investmentSummary || {}

  authView.classList.add('hidden')
  appView.classList.remove('hidden')
  renderShell()
  renderView()
}

function metric(label, value, detail = '', tone = '') {
  return `
    <article class="metric-card">
      <span>${escapeHtml(label)}</span>
      <strong class="${tone}">${escapeHtml(value)}</strong>
      ${detail ? `<small>${escapeHtml(detail)}</small>` : ''}
    </article>
  `
}

function emptyState(title, text, action = '') {
  return `
    <div class="section">
      <div class="section-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(text)}</p>
        </div>
      </div>
      ${action}
    </div>
  `
}

function feedCard(card) {
  const tone = card.tone === 'danger' ? 'tone-danger' : card.tone === 'warning' ? 'tone-warning' : card.tone === 'good' ? 'tone-good' : ''
  const type = String(card.type || 'insight')
  return `
    <article class="feed-card ${tone}">
      <div class="feed-icon">${escapeHtml(uiLabel('feedType', type, 'IA').slice(0, 2).toUpperCase())}</div>
      <div>
        <span class="badge blue">${escapeHtml(uiLabel('feedType', type, 'Insight'))}</span>
        <h3>${escapeHtml(card.title || 'Análise da IA')}</h3>
        <p>${escapeHtml(card.message || '')}</p>
        ${card.action ? `<button class="small-action" type="button" data-question="${escapeHtml(card.title)}">${escapeHtml(card.action)}</button>` : ''}
      </div>
      ${card.value ? `<strong class="feed-value">${escapeHtml(card.value)}</strong>` : ''}
    </article>
  `
}

function transactionIcon(transaction) {
  if (transaction.type === 'RECEIVABLE') return 'IN'
  if (transaction.form === 'CARD') return 'CR'
  if (transaction.source === 'OPEN_FINANCE') return 'OF'
  return 'OUT'
}

function transactionStatusBadge(transaction) {
  if (transaction.status === 'PAID' || transaction.status === 'RECEIVED') return '<span class="badge green">Concluído</span>'
  if (transaction.status === 'CANCELED') return '<span class="badge red">Cancelado</span>'
  return '<span class="badge amber">Pendente</span>'
}

function renderTransactionsList(limit = state.transactions.length) {
  if (!state.transactions.length) {
    return `<p class="empty-state">Nenhuma transação real cadastrada ainda.</p>`
  }

  return state.transactions
    .slice(0, limit)
    .map((transaction) => {
      const amount = money(transaction.amount)
      const isIncome = transaction.type === 'RECEIVABLE'
      const action =
        transaction.status === 'PENDING'
          ? `<button class="small-action" type="button" data-pay-id="${transaction.id}" data-pay-type="${transaction.type}">${isIncome ? 'Receber' : 'Pagar'}</button>`
          : ''

      return `
        <article class="list-item">
          <div class="data-icon">${transactionIcon(transaction)}</div>
          <div>
            <strong>${escapeHtml(transaction.title)}</strong>
            <p>${escapeHtml(transaction.categoryName || 'Sem categoria')} - ${formatDate(transaction.dueDate)} - ${escapeHtml(uiLabel('source', transaction.source, 'Manual'))}</p>
          </div>
          <div class="amount ${isIncome ? 'text-green' : 'text-red'}">
            ${isIncome ? '+' : '-'}${amount}
            <div style="margin-top:6px">${transactionStatusBadge(transaction)}</div>
            ${action}
          </div>
        </article>
      `
    })
    .join('')
}

function initials(name) {
  return String(name || 'FS')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'FS'
}

function expenseCategories() {
  const map = new Map()
  state.transactions.forEach((transaction) => {
    if (transaction.type !== 'PAYABLE') return
    const key = transaction.categoryName || 'Sem categoria'
    map.set(key, (map.get(key) || 0) + numberValue(transaction.amount))
  })

  const categories = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, amount]) => ({ name, amount }))

  while (categories.length < 3) {
    categories.push([
      { name: 'Moradia', amount: 0 },
      { name: 'Alimentação', amount: 0 },
      { name: 'Reserva', amount: 0 },
    ][categories.length])
  }

  return categories
}

function categoryBudgetCards(totalExpense) {
  const tones = ['purple', 'cyan', 'cream']
  return expenseCategories()
    .map((category, index) => {
      const usage = totalExpense > 0 ? Math.round((category.amount / totalExpense) * 100) : 0
      return `
        <article class="budget-category ${tones[index]}">
          <span>${escapeHtml(category.name)}</span>
          <strong>${money(category.amount)}</strong>
          <small>${usage}% do gasto</small>
        </article>
      `
    })
    .join('')
}

function renderIncomeCards(dashboard) {
  return [
    ['Salário', dashboard.salary || dashboard.netSalary || 0, 'Renda base'],
    ['Recebimentos', dashboard.totalReceivedThisMonth || 0, 'Entradas do mês'],
    ['Projetos', dashboard.projectProfit || 0, 'PJ / vendas'],
  ]
    .map(
      ([label, value, detail]) => `
        <article class="income-card">
          <span class="card-menu">...</span>
          <span>${escapeHtml(label)}</span>
          <strong>${money(value)}</strong>
          <small>${escapeHtml(detail)}</small>
        </article>
      `,
    )
    .join('')
}

function renderSpendingList(limit = 5) {
  const items = state.transactions
    .filter((transaction) => transaction.type === 'PAYABLE')
    .slice(0, limit)

  if (!items.length) {
    return '<p class="empty-state">Cadastre gastos reais para ver a lista mensal aqui.</p>'
  }

  return items
    .map((transaction) => `
      <article class="list-item">
        <div class="data-icon">${transactionIcon(transaction)}</div>
        <div>
          <strong>${escapeHtml(transaction.title)}</strong>
          <p>${escapeHtml(transaction.categoryName || 'Sem categoria')} - ${formatDate(transaction.dueDate)}</p>
        </div>
        <strong class="amount text-red">-${money(transaction.amount)}</strong>
      </article>
    `)
    .join('')
}

function renderToday() {
  const dashboard = state.dashboard || {}
  const feed = state.feed || {}
  const feedCards = Array.isArray(feed.cards) ? feed.cards : []
  const score = numberValue(feed.score)
  const safeSpend = numberValue(feed.safeDailySpend || dashboard.monthlySaving / 10)
  const goal = dashboard.monthlyGoal
  const monthlyExpense = numberValue(dashboard.totalPaidThisMonth) + numberValue(dashboard.totalToPay)
  const registeredExpense = state.transactions
    .filter((transaction) => transaction.type === 'PAYABLE')
    .reduce((sum, transaction) => sum + numberValue(transaction.amount), 0)
  const totalExpense = monthlyExpense || registeredExpense
  const balance = numberValue(dashboard.balance || dashboard.expectedBalance)
  const plannedBudget = numberValue(dashboard.salary) + numberValue(dashboard.totalReceivedThisMonth)
  const budgetUsed = plannedBudget > 0 ? Math.min(100, Math.round((totalExpense / plannedBudget) * 100)) : 0

  return `
    <div class="hero-today">
      <section class="budget-hero">
        <div class="budget-top">
          <div class="user-chip">
            <div class="user-avatar">${escapeHtml(initials(state.user?.name))}</div>
            <div>
              <p class="eyebrow">Oi, ${escapeHtml(state.user?.name?.split(' ')[0] || 'você')}</p>
              <h2>Orçamento mensal</h2>
            </div>
          </div>
          <span class="balance-pill">Meu saldo</span>
        </div>

        <div class="budget-main">
          <div class="budget-amount">
            <span>Despesas planejadas</span>
            <strong>${money(totalExpense)}</strong>
            <small>${money(Math.max(0, plannedBudget - totalExpense))} disponíveis no orçamento</small>
          </div>
          <div class="donut" style="--p:${budgetUsed}">
            <span>${budgetUsed}%</span>
          </div>
        </div>

        <div class="budget-categories">
          <button class="add-square" type="button" data-view="transactions">+</button>
          ${categoryBudgetCards(totalExpense)}
        </div>
      </section>

      <aside class="balance-panel">
        <p class="eyebrow">Meu saldo</p>
        <strong>${money(balance)}</strong>
        <span class="positive-pill">+ ${score || 0}% score</span>
        <div class="segmented-bar"><span></span><span></span><span></span><span></span></div>
        <div class="section-header">
          <div>
            <p class="eyebrow">Gastos do mês</p>
            <h2>${money(totalExpense)}</h2>
          </div>
          <span class="badge blue">Hoje ${money(safeSpend)}</span>
        </div>
        <div class="list">
          ${renderSpendingList(4)}
        </div>
      </aside>
    </div>

    <div class="page-grid">
      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Minhas entradas</p>
            <h2>Entradas do mês</h2>
            <p>Renda, recebimentos e projetos que alimentam seu orçamento.</p>
          </div>
        </div>
        <div class="grid-3">
          ${renderIncomeCards(dashboard)}
        </div>
        <div class="section-header" style="margin-top:18px">
          <div>
            <p class="eyebrow">Feed diário da IA</p>
            <h2>O que merece sua atenção</h2>
          </div>
          <button class="ghost-action" type="button" data-refresh>Atualizar</button>
        </div>
        <div class="feed-list">
          ${feedCards.length ? feedCards.slice(0, 4).map(feedCard).join('') : '<p class="empty-state">Cadastre transações, contas, cartões ou metas para a IA gerar seu feed diário.</p>'}
        </div>
      </section>

      <aside class="stack">
        <section class="section">
          <div class="section-header">
            <div>
              <p class="eyebrow">Ação rápida</p>
              <h2>Nova transação</h2>
            </div>
          </div>
          ${transactionForm('transactionForm')}
        </section>

        <section class="section">
          <div class="section-header">
            <div>
              <p class="eyebrow">Meta principal</p>
              <h2>${goal ? escapeHtml(goal.title) : 'Crie sua primeira meta'}</h2>
              <p>${goal ? `${money(goal.currentAmount)} de ${money(goal.targetAmount)}` : 'Metas deixam o app mais útil no dia a dia.'}</p>
            </div>
          </div>
          ${goal ? progressBar(numberValue(goal.currentAmount) / Math.max(1, numberValue(goal.targetAmount)) * 100) : '<button class="primary-action" type="button" data-view="goals">Criar meta</button>'}
        </section>

        <section class="section">
          <div class="section-header">
            <div>
              <p class="eyebrow">Modos</p>
              <h2>Rotinas especiais</h2>
            </div>
          </div>
          <div class="mode-grid">
            ${(feed.modeSuggestions || ['Viagem', 'Família', 'Festa', 'Autônomo']).map((mode) => `<button class="chip" type="button" data-question="Ative o modo ${escapeHtml(mode)}">${escapeHtml(mode)}</button>`).join('')}
          </div>
        </section>
      </aside>
    </div>
  `
}

function renderDashboard() {
  const d = state.dashboard || {}
  const pending = d.pending || {}
  return `
    <section class="grid-4">
      ${metric('Saldo atual', money(d.balance), 'Soma das contas', 'text-blue')}
      ${metric('Saldo previsto', money(d.expectedBalance), 'Salário - a pagar + a receber', numberValue(d.expectedBalance) >= 0 ? 'text-green' : 'text-red')}
      ${metric('A pagar', money(d.totalToPay), `${pending.payableTransactions || 0} pendências`, 'text-red')}
      ${metric('A receber', money(d.totalToReceive), `${pending.receivableTransactions || 0} entradas`, 'text-green')}
      ${metric('Patrimônio', money(d.netWorth), 'Contas + cartões + metas', 'text-blue')}
      ${metric('Lucro PJ', money(d.projectProfit), `${pending.projects || 0} projetos pendentes`, 'text-green')}
      ${metric('Economia mensal', money(d.monthlySaving), 'Estimativa do mês', numberValue(d.monthlySaving) >= 0 ? 'text-green' : 'text-red')}
      ${metric('Alertas IA', String((d.aiAlerts || []).length), 'Avisos ativos', 'text-amber')}
    </section>

    <div class="grid-2" style="margin-top:14px">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Categorias</p><h2>Gastos cadastrados</h2></div></div>
        ${categoryBreakdown()}
      </section>
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Próximas contas</p><h2>Vencimentos</h2></div></div>
        <div class="list">
          ${(d.upcomingBills || []).length ? d.upcomingBills.map((bill) => `
            <article class="list-item">
              <div class="data-icon">PG</div>
              <div><strong>${escapeHtml(bill.title)}</strong><p>${formatDate(bill.dueDate)} - ${escapeHtml(bill.categoryName || 'Sem categoria')}</p></div>
              <strong class="amount text-red">${money(bill.amount)}</strong>
            </article>
          `).join('') : '<p class="empty-state">Nenhuma conta pendente cadastrada.</p>'}
        </div>
      </section>
    </div>

    <section class="section" style="margin-top:14px">
      <div class="section-header"><div><p class="eyebrow">Resumo inteligente</p><h2>Leitura do mês</h2></div></div>
      <p class="muted">${dashboardSummary(d)}</p>
    </section>
  `
}

function dashboardSummary(dashboard) {
  const expected = numberValue(dashboard.expectedBalance)
  const toPay = numberValue(dashboard.totalToPay)
  const received = numberValue(dashboard.totalReceivedThisMonth)
  if (!state.transactions.length) return 'Cadastre transações ou importe dados Open Finance para gerar uma leitura real do mês.'
  if (expected < 0) return `Seu saldo previsto está negativo em ${money(Math.abs(expected))}. Priorize contas essenciais e evite novas parcelas.`
  if (toPay > received && received > 0) return 'As pendências ainda superam entradas confirmadas. A IA recomenda acompanhar vencimentos antes de assumir novos gastos.'
  return 'Seu mês está organizado com os dados atuais. Continue registrando movimentações para manter o score confiável.'
}

function categoryBreakdown() {
  if (!state.transactions.length) return '<p class="empty-state">Sem categorias suficientes para gráfico.</p>'
  const map = new Map()
  state.transactions.forEach((item) => {
    if (item.type !== 'PAYABLE') return
    const key = item.categoryName || 'Sem categoria'
    map.set(key, (map.get(key) || 0) + numberValue(item.amount))
  })
  const total = [...map.values()].reduce((sum, value) => sum + value, 0) || 1
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([category, value]) => `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <strong>${escapeHtml(category)}</strong>
          <span class="muted">${money(value)}</span>
        </div>
        ${progressBar((value / total) * 100)}
      </div>
    `)
    .join('')
}

function renderAI() {
  return `
    <section class="chat-shell">
      <div>
        <div class="chat-window" id="chatWindow">
          <div class="chat-bubble ai">Eu analiso seus dados reais: transações, contas, cartões, metas, projetos e investimentos cadastrados.</div>
          <div class="chat-bubble user">Quanto posso gastar hoje?</div>
          <div class="chat-bubble ai">${escapeHtml(`Com os dados atuais, seu gasto seguro diário estimado é ${money(state.feed?.safeDailySpend || 0)}. Para ficar mais preciso, mantenha transações e cartões atualizados.`)}</div>
        </div>
        <form class="form" id="assistantForm" style="margin-top:14px">
          <textarea name="question" rows="3" required>Posso gastar hoje sem comprometer o mês?</textarea>
          <div class="chip-row">
            ${['Quanto posso gastar hoje?', 'Posso parcelar uma compra de R$ 3000?', 'Quero tirar um empréstimo. Quanto consigo?', 'Onde estou exagerando?', 'Qual assinatura devo cancelar?']
              .map((question) => `<button class="chip" type="button" data-question="${escapeHtml(question)}">${escapeHtml(question.split('?')[0])}</button>`)
              .join('')}
          </div>
          <button class="primary-action" type="submit">Perguntar para IA</button>
        </form>
      </div>

      <aside class="stack">
        <section class="section">
          <div class="section-header"><div><p class="eyebrow">Resposta</p><h2>Análise da IA</h2></div></div>
          <p class="assistant-answer" id="assistantAnswer">A resposta aparece aqui usando os dados cadastrados/importados.</p>
        </section>
        <section class="section">
          <div class="section-header"><div><p class="eyebrow">Simulador</p><h2>Crédito rápido</h2><p>Estimativa, não garantia de aprovação.</p></div></div>
          ${creditForm('creditMiniForm')}
          <p class="message" id="creditMiniFormMessage"></p>
        </section>
      </aside>
    </section>
  `
}

function renderTransactions() {
  return `
    <div class="page-grid">
      <section class="section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Movimentações</p>
            <h2>Transações reais</h2>
            <p>Filtre por origem: manual, Open Finance ou importação.</p>
          </div>
          <button class="ghost-action" type="button" data-refresh>Atualizar</button>
        </div>
        <div class="chip-row" style="margin-bottom:12px">
          <span class="chip active">Mês</span>
          <span class="chip">Entradas</span>
          <span class="chip">Saídas</span>
          <span class="chip">Cartão</span>
          <span class="chip">Open Finance</span>
        </div>
        <div class="list">${renderTransactionsList()}</div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Nova transação</h2></div></div>
        ${transactionForm('transactionPageForm')}
      </aside>
    </div>
  `
}

function transactionForm(id) {
  return `
    <form class="form" id="${id}">
      <label>Nome <input name="title" type="text" value="Conta de luz" required /></label>
      <label>Valor <input name="amount" type="number" value="180" min="0.01" step="0.01" required /></label>
      <label>Tipo
        <select name="type">
          <option value="PAYABLE">A pagar</option>
          <option value="RECEIVABLE">A receber</option>
        </select>
      </label>
      <label>Forma
        <select name="form">
          <option value="PIX">Pix</option>
          <option value="CARD">Cartão</option>
          <option value="BOLETO">Boleto</option>
          <option value="DEBIT">Débito</option>
          <option value="TRANSFER">Transferência</option>
          <option value="OTHER">Outro</option>
        </select>
      </label>
      <label>Categoria <input name="categoryName" type="text" value="Casa" /></label>
      <label>Tag <input name="tag" type="text" value="MENSAL" /></label>
      <label>Vencimento <input name="dueDate" type="date" value="${todayISO()}" required /></label>
      <label>Observações <textarea name="notes" rows="2">Registro manual real</textarea></label>
      <button class="primary-action" type="submit">Salvar transação</button>
      <p class="message" id="${id}Message"></p>
    </form>
  `
}

function renderAccounts() {
  const activeConnections = state.connections.filter((item) => item.status === 'ACTIVE').length
  return `
    <div class="grid-3" style="margin-bottom:14px">
      ${metric('Contas cadastradas', String(state.accounts.length), 'Fontes de saldo', 'text-blue')}
      ${metric('Conexões Open Finance', String(state.connections.length), `${activeConnections} ativas`, activeConnections ? 'text-green' : 'text-amber')}
      ${metric('Saldo nas contas', money(state.accounts.reduce((sum, account) => sum + numberValue(account.currentBalance), 0)), 'Base da IA', 'text-green')}
    </div>

    <div class="page-grid">
      <section class="section">
        <div class="section-header">
          <div><p class="eyebrow">Bancos</p><h2>Contas e saldos</h2><p>Dados manuais ou importados por provedor Open Finance.</p></div>
        </div>
        <div class="list">
          ${state.accounts.length ? state.accounts.map((account) => `
            <article class="list-item">
              <div class="data-icon">${escapeHtml(account.bankName.slice(0, 2).toUpperCase())}</div>
              <div><strong>${escapeHtml(account.bankName)}</strong><p>${escapeHtml(uiLabel('accountType', account.accountType, 'Conta corrente'))} - ${escapeHtml(account.accountNumber || 'sem número')}</p></div>
              <strong class="amount">${money(account.currentBalance)}</strong>
            </article>
          `).join('') : '<p class="empty-state">Nenhuma conta real cadastrada ainda.</p>'}
        </div>
      </section>

      <aside class="stack">
        <section class="section">
          <div class="section-header"><div><p class="eyebrow">Manual</p><h2>Cadastrar conta real</h2></div></div>
          ${accountForm()}
        </section>
        <section class="section">
          <div class="section-header"><div><p class="eyebrow">Open Finance</p><h2>Pluggy Connect</h2><p>Gere o Connect Token e importe contas, cartões, transações e investimentos reais.</p></div></div>
          ${openFinanceForm()}
        </section>
      </aside>
    </div>
  `
}

function accountForm() {
  return `
    <form class="form" id="bankAccountForm">
      <label>Banco <input name="bankName" type="text" value="Nubank" required /></label>
      <label>Agência <input name="agency" type="text" placeholder="0001" /></label>
      <label>Conta <input name="accountNumber" type="text" placeholder="12345-6" /></label>
      <label>Tipo
        <select name="accountType">
          <option value="CHECKING">Conta corrente</option>
          <option value="SAVINGS">Poupança</option>
          <option value="PAYMENT">Pagamento</option>
          <option value="INVESTMENT">Investimento</option>
        </select>
      </label>
      <label>Saldo atual <input name="currentBalance" type="number" value="0" step="0.01" /></label>
      <label>Saldo disponível <input name="availableBalance" type="number" value="0" step="0.01" /></label>
      <button class="primary-action" type="submit">Salvar conta</button>
      <p class="message" id="bankAccountFormMessage"></p>
    </form>
  `
}

function openFinanceForm() {
  return `
    <p class="muted" style="margin-bottom:12px">Em produção, prefira configurar PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET ou PLUGGY_API_KEY no backend. Estes campos ajudam no ambiente local.</p>
    <form class="form" id="pluggyConnectTokenForm">
      <label>Banco <input name="bankName" type="text" value="Pluggy" /></label>
      <label>Client ID <input name="clientId" type="text" placeholder="Client ID da Pluggy" autocomplete="off" /></label>
      <label>Client Secret <input name="clientSecret" type="password" placeholder="Client Secret da Pluggy" autocomplete="off" /></label>
      <label>API Key <input name="apiKey" type="password" placeholder="Use se já tiver uma API Key ativa" autocomplete="off" /></label>
      <label>Item ID <input name="itemId" type="text" placeholder="Opcional: reconectar item existente" /></label>
      <button class="primary-action" type="submit">Gerar Connect Token</button>
      <p class="message" id="pluggyConnectTokenFormMessage"></p>
    </form>
    <form class="form form-divider" id="pluggyImportForm">
      <label>Item ID <input name="itemId" type="text" placeholder="Item ID retornado pela Pluggy" required /></label>
      <label>API Key <input name="apiKey" type="password" placeholder="Opcional se estiver no .env" autocomplete="off" /></label>
      <label>Data inicial <input name="dateFrom" type="date" /></label>
      <label>Data final <input name="dateTo" type="date" /></label>
      <button class="primary-action" type="submit">Importar dados da Pluggy</button>
      <p class="message" id="pluggyImportFormMessage"></p>
    </form>
  `
}

function renderCards() {
  const used = state.cards.reduce((sum, card) => sum + numberValue(card.usedLimit), 0)
  const total = state.cards.reduce((sum, card) => sum + numberValue(card.totalLimit), 0)
  const usage = total > 0 ? (used / total) * 100 : 0
  return `
    <div class="grid-3" style="margin-bottom:14px">
      ${metric('Cartões', String(state.cards.length), 'Cadastrados/conectados', 'text-blue')}
      ${metric('Limite usado', money(used), `${percent(usage)} do limite`, usage > 75 ? 'text-red' : 'text-amber')}
      ${metric('Limite disponível', money(Math.max(0, total - used)), 'Antes de fechar a fatura', 'text-green')}
    </div>
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Cartões</p><h2>Controle de fatura</h2></div></div>
        <div class="list">
          ${state.cards.length ? state.cards.map((card) => `
            <article class="data-card">
              <div class="section-header">
                <div><strong>${escapeHtml(card.name)}</strong><p>${escapeHtml(card.brand === 'OTHER' ? 'Outro' : card.brand || 'Outro')} - vence dia ${escapeHtml(card.dueDay || '--')}</p></div>
                <span class="badge ${numberValue(card.usedLimit) > numberValue(card.totalLimit) * 0.75 ? 'red' : 'blue'}">${percent(numberValue(card.totalLimit) ? numberValue(card.usedLimit) / numberValue(card.totalLimit) * 100 : 0)}</span>
              </div>
              ${progressBar(numberValue(card.totalLimit) ? numberValue(card.usedLimit) / numberValue(card.totalLimit) * 100 : 0)}
              <p>${money(card.usedLimit)} usados de ${money(card.totalLimit)}. Melhor dia: ${escapeHtml(card.bestPurchaseDay || '--')}</p>
            </article>
          `).join('') : '<p class="empty-state">Cadastre cartões para a IA prever faturas e parcelas.</p>'}
        </div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Novo cartão</h2></div></div>
        <form class="form" id="cardForm">
          <label>Nome <input name="name" type="text" value="Nubank Visa" required /></label>
          <label>Bandeira
            <select name="brand"><option value="VISA">Visa</option><option value="MASTERCARD">Mastercard</option><option value="ELO">Elo</option><option value="OTHER">Outro</option></select>
          </label>
          <label>Limite total <input name="totalLimit" type="number" value="2500" step="0.01" /></label>
          <label>Limite usado <input name="usedLimit" type="number" value="0" step="0.01" /></label>
          <label>Vencimento <input name="dueDay" type="number" min="1" max="31" value="15" /></label>
          <label>Melhor dia <input name="bestPurchaseDay" type="number" min="1" max="31" value="16" /></label>
          <button class="primary-action" type="submit">Salvar cartão</button>
          <p class="message" id="cardFormMessage"></p>
        </form>
      </aside>
    </div>
  `
}

function renderBudgets() {
  return `
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Limites</p><h2>Orçamento mensal</h2><p>A IA avisa quando uma categoria passa do ponto seguro.</p></div></div>
        <div class="list">
          ${state.budgets.length ? state.budgets.map((budget) => {
            const spent = state.transactions.filter((item) => item.categoryName === budget.category).reduce((sum, item) => sum + numberValue(item.amount), 0)
            const usage = numberValue(budget.limit) ? spent / numberValue(budget.limit) * 100 : 0
            return `
              <article class="data-card">
                <div class="section-header">
                  <div><strong>${escapeHtml(budget.category)}</strong><p>${money(spent)} usados de ${money(budget.limit)}</p></div>
                  <span class="badge ${usage >= 100 ? 'red' : usage >= numberValue(budget.alertAt) ? 'amber' : 'green'}">${percent(usage)}</span>
                </div>
                ${progressBar(usage, usage >= 100 ? 'red' : usage >= numberValue(budget.alertAt) ? 'amber' : 'blue')}
              </article>
            `
          }).join('') : '<p class="empty-state">Nenhum orçamento cadastrado.</p>'}
        </div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Novo limite</h2></div></div>
        <form class="form" id="budgetForm">
          <label>Categoria <input name="category" type="text" value="Alimentação" required /></label>
          <label>Limite <input name="limit" type="number" value="800" min="0.01" step="0.01" required /></label>
          <label>Mês <input name="month" type="number" value="${currentMonth()}" min="1" max="12" required /></label>
          <label>Ano <input name="year" type="number" value="${currentYear()}" min="2000" max="2100" required /></label>
          <label>Alertar em % <input name="alertAt" type="number" value="80" min="1" max="100" /></label>
          <button class="primary-action" type="submit">Salvar orçamento</button>
          <p class="message" id="budgetFormMessage"></p>
        </form>
      </aside>
    </div>
  `
}

function renderGoals() {
  return `
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Objetivos</p><h2>Metas financeiras</h2><p>O app transforma metas em hábito diário.</p></div></div>
        <div class="grid-2">
          ${state.goals.length ? state.goals.map((goal) => {
            const usage = numberValue(goal.currentAmount) / Math.max(1, numberValue(goal.targetAmount)) * 100
            return `
              <article class="data-card">
                <div class="section-header">
                  <div><strong>${escapeHtml(goal.title)}</strong><p>${money(goal.currentAmount)} de ${money(goal.targetAmount)}</p></div>
                  <span class="badge green">${percent(usage)}</span>
                </div>
                ${progressBar(usage)}
                <p>Prazo: ${formatDate(goal.deadline)}. Alvo mensal: ${money(goal.monthlyTarget || 0)}.</p>
              </article>
            `
          }).join('') : '<p class="empty-state">Nenhuma meta cadastrada.</p>'}
        </div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Nova meta</h2></div></div>
        <form class="form" id="goalForm">
          <label>Título <input name="title" type="text" value="Reserva de emergência" required /></label>
          <label>Valor alvo <input name="targetAmount" type="number" value="12000" min="0.01" step="0.01" required /></label>
          <label>Valor atual <input name="currentAmount" type="number" value="0" min="0" step="0.01" /></label>
          <label>Prazo <input name="deadline" type="date" /></label>
          <button class="primary-action" type="submit">Criar meta</button>
          <p class="message" id="goalFormMessage"></p>
        </form>
      </aside>
    </div>
  `
}

function renderDebts() {
  const debts = state.transactions.filter((item) => item.type === 'PAYABLE' && item.status === 'PENDING')
  const total = debts.reduce((sum, item) => sum + numberValue(item.amount), 0)
  return `
    <div class="grid-3" style="margin-bottom:14px">
      ${metric('Total pendente', money(total), `${debts.length} contas/dívidas`, 'text-red')}
      ${metric('Maior pendência', money(Math.max(0, ...debts.map((item) => numberValue(item.amount)))), 'Prioridade de caixa', 'text-amber')}
      ${metric('Estratégia IA', debts.length ? 'Priorizar' : 'Sem risco', debts.length ? 'Pague vencimentos mais próximos' : 'Nenhuma dívida pendente', debts.length ? 'text-amber' : 'text-green')}
    </div>
    <section class="section">
      <div class="section-header"><div><p class="eyebrow">Dívidas</p><h2>Plano de quitação</h2></div></div>
      <div class="list">${debts.length ? debts.map((item) => `
        <article class="list-item">
          <div class="data-icon">DV</div>
          <div><strong>${escapeHtml(item.title)}</strong><p>${formatDate(item.dueDate)} - ${escapeHtml(item.categoryName || 'Sem categoria')}</p></div>
          <strong class="amount text-red">${money(item.amount)}</strong>
        </article>
      `).join('') : '<p class="empty-state">Nenhuma dívida pendente cadastrada.</p>'}</div>
    </section>
  `
}

function renderCredit() {
  return `
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Empréstimos</p><h2>Análise de crédito com IA</h2><p>Estimativa baseada nos dados reais cadastrados. Não garante aprovação, taxa ou oferta.</p></div></div>
        ${creditForm('creditForm')}
        <p class="message" id="creditFormMessage"></p>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Resultado</p><h2>Simulação</h2></div></div>
        <div id="creditResult" class="stack">
          <p class="empty-state">Informe o valor desejado e prazo para a IA estimar parcela segura, risco, melhor data e onde buscar primeiro.</p>
        </div>
      </aside>
    </div>
  `
}

function creditForm(id) {
  return `
    <form class="form" id="${id}">
      <label>Valor desejado <input name="requestedAmount" type="number" value="5000" min="0.01" step="0.01" /></label>
      <label>Parcelas <input name="installments" type="number" value="24" min="1" max="96" /></label>
      <label>Finalidade <input name="purpose" type="text" value="Organizar dívidas e fluxo de caixa" /></label>
      <button class="primary-action" type="submit">Analisar crédito</button>
    </form>
  `
}

function renderInvestments() {
  const total = state.investments.reduce((sum, item) => sum + numberValue(item.amount), 0)
  return `
    <div class="grid-3" style="margin-bottom:14px">
      ${metric('Patrimônio investido', money(total), `${state.investments.length} produtos`, 'text-green')}
      ${metric('Perfil', state.user?.investorProfile || 'Não definido', 'Edite no perfil futuramente', 'text-amber')}
      ${metric('Resumo IA', total > 0 ? 'Ativo' : 'Aguardando dados', total > 0 ? 'Carteira cadastrada' : 'Cadastre investimentos', total > 0 ? 'text-green' : 'text-amber')}
    </div>
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Carteira</p><h2>Investimentos</h2></div></div>
        <div class="list">
          ${state.investments.length ? state.investments.map((item) => `
            <article class="list-item">
              <div class="data-icon">${escapeHtml(String(item.type || 'I').slice(0, 2))}</div>
              <div><strong>${escapeHtml(item.product)}</strong><p>${escapeHtml(item.institution)} - risco ${escapeHtml(uiLabel('risk', item.risk, 'Baixo'))} - liquidez ${escapeHtml(uiLabel('liquidity', item.liquidity, 'Diária'))}</p></div>
              <strong class="amount text-green">${money(item.amount)}</strong>
            </article>
          `).join('') : '<p class="empty-state">Nenhum investimento cadastrado.</p>'}
        </div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Novo investimento</h2></div></div>
        <form class="form" id="investmentForm">
          <label>Instituição <input name="institution" type="text" value="Banco" required /></label>
          <label>Produto <input name="product" type="text" value="CDB liquidez diária" required /></label>
          <label>Tipo
            <select name="type"><option value="CDB">CDB</option><option value="TREASURY">Tesouro</option><option value="FII">FII</option><option value="STOCK">Ação</option><option value="FUND">Fundo</option><option value="CRYPTO">Cripto</option><option value="OTHER">Outro</option></select>
          </label>
          <label>Valor <input name="amount" type="number" value="1000" min="0.01" step="0.01" required /></label>
          <label>Rentabilidade <input name="profitability" type="text" value="100% CDI" /></label>
          <button class="primary-action" type="submit">Salvar investimento</button>
          <p class="message" id="investmentFormMessage"></p>
        </form>
      </aside>
    </div>
  `
}

function renderPJ() {
  const pending = state.projects.filter((item) => item.status === 'PENDING')
  const paid = state.projects.filter((item) => item.status === 'PAID')
  return `
    <div class="grid-4" style="margin-bottom:14px">
      ${metric('Projetos', String(state.projects.length), 'Vendas cadastradas', 'text-blue')}
      ${metric('Pendente', money(pending.reduce((sum, item) => sum + numberValue(item.amount), 0)), `${pending.length} clientes`, 'text-amber')}
      ${metric('Recebido', money(paid.reduce((sum, item) => sum + numberValue(item.amount), 0)), 'Projetos pagos', 'text-green')}
      ${metric('Lucro do mês', money(state.projectDashboard?.monthlyProfit || paid.reduce((sum, item) => sum + numberValue(item.amount), 0)), 'PJ / autônomo', 'text-green')}
    </div>
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Vendas</p><h2>Projetos e clientes</h2></div></div>
        <div class="list">
          ${state.projects.length ? state.projects.map((project) => `
            <article class="list-item">
              <div class="data-icon">PJ</div>
              <div><strong>${escapeHtml(project.title)}</strong><p>${escapeHtml(project.client)} - ${escapeHtml(uiLabel('projectCategory', project.category, 'Outro'))} - ${formatDate(project.soldAt)}</p></div>
              <div class="amount ${project.status === 'PAID' ? 'text-green' : 'text-amber'}">
                ${money(project.amount)}
                <div style="margin-top:6px"><span class="badge ${project.status === 'PAID' ? 'green' : 'amber'}">${escapeHtml(uiLabel('projectStatus', project.status, 'Pendente'))}</span></div>
                ${project.status === 'PENDING' ? `<button class="small-action" type="button" data-project-pay-id="${project.id}">Marcar pago</button>` : ''}
              </div>
            </article>
          `).join('') : '<p class="empty-state">Nenhum projeto PJ cadastrado.</p>'}
        </div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Nova venda</h2></div></div>
        <form class="form" id="projectForm">
          <label>Produto/Sistema <input name="title" type="text" value="Sistema vendido" required /></label>
          <label>Cliente <input name="client" type="text" value="Cliente exemplo" required /></label>
          <label>Categoria
            <select name="category"><option value="SYSTEMS">Sistemas</option><option value="SERVICES">Serviços</option><option value="SPORTS">Esportivos</option><option value="ELECTRONICS">Eletrônicos</option><option value="OTHER">Outro</option></select>
          </label>
          <label>Valor <input name="amount" type="number" value="1200" min="0.01" step="0.01" required /></label>
          <label>Data da venda <input name="soldAt" type="date" value="${todayISO()}" required /></label>
          <label>Observações <textarea name="notes" rows="2"></textarea></label>
          <button class="primary-action" type="submit">Salvar venda</button>
          <p class="message" id="projectFormMessage"></p>
        </form>
      </aside>
    </div>
  `
}

function renderNews() {
  return `
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Feed</p><h2>Jornal inteligente</h2><p>Notícias financeiras podem ser conectadas aos seus investimentos e objetivos.</p></div></div>
        <div class="chip-row" style="margin-bottom:12px">
          ${['Tudo', 'Selic', 'Dólar', 'Bolsa', 'Cripto', 'Impostos'].map((item, index) => `<span class="chip ${index === 0 ? 'active' : ''}">${item}</span>`).join('')}
        </div>
        <div class="grid-2">
          ${state.news.length ? state.news.map((item) => `
            <article class="data-card">
              <span class="badge blue">${escapeHtml(uiLabel('newsCategory', item.category, 'Finanças'))}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.summary || 'Sem resumo cadastrado.')}</p>
              <p><strong>Impacto:</strong> relevância ${escapeHtml(item.relevance || 0)}/100</p>
            </article>
          `).join('') : '<p class="empty-state">Nenhuma notícia salva ainda.</p>'}
        </div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Salvar notícia</h2></div></div>
        <form class="form" id="newsForm">
          <label>Título <input name="title" type="text" value="Selic e renda fixa" required /></label>
          <label>Resumo <textarea name="summary" rows="3">Resumo curto da notícia e por que ela importa.</textarea></label>
          <label>Fonte <input name="source" type="text" value="Fonte" /></label>
          <label>URL <input name="url" type="url" placeholder="https://..." /></label>
          <label>Categoria
            <select name="category"><option value="FINANCE">Finanças</option><option value="BUSINESS">Negócios</option><option value="TECH">Tecnologia</option><option value="SPORTS">Esportes</option><option value="ELECTRONICS">Eletrônicos</option></select>
          </label>
          <label>Relevância <input name="relevance" type="number" value="70" min="0" max="100" /></label>
          <button class="primary-action" type="submit">Salvar notícia</button>
          <p class="message" id="newsFormMessage"></p>
        </form>
      </aside>
    </div>
  `
}

function renderAlerts() {
  return `
    <div class="page-grid">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Central</p><h2>Alertas inteligentes</h2></div></div>
        <div class="list">
          ${state.alerts.length ? state.alerts.map((alert) => `
            <article class="list-item">
              <div class="data-icon">${alert.severity === 'HIGH' ? '!' : 'IA'}</div>
              <div><strong>${escapeHtml(alert.title)}</strong><p>${escapeHtml(alert.message)}</p></div>
              <div class="amount">
                <span class="badge ${alert.severity === 'HIGH' ? 'red' : alert.severity === 'MEDIUM' ? 'amber' : 'blue'}">${escapeHtml(uiLabel('severity', alert.severity, 'Média'))}</span>
                ${!alert.read ? `<button class="small-action" type="button" data-alert-read-id="${alert.id}">Ler</button>` : ''}
              </div>
            </article>
          `).join('') : '<p class="empty-state">Nenhum alerta ativo.</p>'}
        </div>
      </section>
      <aside class="section">
        <div class="section-header"><div><p class="eyebrow">Cadastro</p><h2>Novo alerta</h2></div></div>
        <form class="form" id="alertForm">
          <label>Título <input name="title" type="text" value="Revisar cartão" required /></label>
          <label>Mensagem <textarea name="message" rows="3">Seu cartão está acima do limite saudável.</textarea></label>
          <label>Severidade
            <select name="severity"><option value="LOW">Baixa</option><option value="MEDIUM">Média</option><option value="HIGH">Alta</option></select>
          </label>
          <button class="primary-action" type="submit">Criar alerta</button>
          <p class="message" id="alertFormMessage"></p>
        </form>
      </aside>
    </div>
  `
}

function renderScore() {
  const feed = state.feed || {}
  const score = numberValue(feed.score)
  const cardUsage = state.dashboard?.cards?.usedLimit && state.dashboard?.cards?.availableLimit
    ? numberValue(state.dashboard.cards.usedLimit) / Math.max(1, numberValue(state.dashboard.cards.usedLimit) + numberValue(state.dashboard.cards.availableLimit)) * 100
    : 0

  return `
    <div class="hero-today">
      <section class="score-hero">
        <p class="eyebrow">Score financeiro</p>
        <span class="score-number">${score || '--'}</span>
        <p class="muted">${score ? 'Índice gerado por gastos, pendências, cartão, metas e sobra mensal.' : 'Cadastre dados reais para calcular o score.'}</p>
      </section>
      <section class="grid-2">
        ${metric('Compromisso de cartão', percent(cardUsage), 'Quanto do limite foi usado', cardUsage > 75 ? 'text-red' : 'text-green')}
        ${metric('Pendências', String(state.dashboard?.pendingTransactions || 0), 'Contas a pagar/receber', 'text-amber')}
        ${metric('Metas ativas', String(state.goals.length), 'Hábito de poupar', 'text-blue')}
        ${metric('Dados reais', String(state.transactions.length + state.accounts.length + state.cards.length), 'Base da IA', 'text-green')}
      </section>
    </div>
    <section class="section">
      <div class="section-header"><div><p class="eyebrow">Missões</p><h2>Como subir o score</h2></div></div>
      <div class="grid-3">
        ${[
          ['Atualizar dados', 'Cadastre contas, cartões e transações reais.', '+10 pts'],
          ['Reduzir cartão', 'Mantenha uso abaixo de 50% do limite.', '+12 pts'],
          ['Criar reserva', 'Transforme sobra mensal em meta.', '+15 pts'],
        ].map(([title, text, points]) => `<article class="data-card"><span class="badge green">${points}</span><strong>${title}</strong><p>${text}</p></article>`).join('')}
      </div>
    </section>
  `
}

function renderDataHub() {
  const dataSources = [
    ['Transações', state.transactions.length, 'Movimentações para a IA classificar'],
    ['Contas', state.accounts.length, 'Saldos reais ou manuais'],
    ['Cartões', state.cards.length, 'Limites e faturas'],
    ['Metas', state.goals.length, 'Objetivos financeiros'],
    ['Projetos PJ', state.projects.length, 'Recebimentos de negócio'],
    ['Investimentos', state.investments.length, 'Patrimônio e risco'],
  ]
  const total = dataSources.reduce((sum, item) => sum + item[1], 0)
  return `
    <div class="grid-3" style="margin-bottom:14px">
      ${metric('Qualidade da análise', total >= 10 ? 'Alta' : total >= 4 ? 'Média' : 'Inicial', `${total} registros reais`, total >= 10 ? 'text-green' : 'text-amber')}
      ${metric('Open Finance', state.connections.length ? 'Preparado' : 'Não conectado', `${state.connections.length} conexões`, state.connections.length ? 'text-green' : 'text-amber')}
      ${metric('Última leitura', 'Agora', 'Dados carregados da API', 'text-blue')}
    </div>
    <section class="section">
      <div class="section-header"><div><p class="eyebrow">Fontes</p><h2>Dados usados pela IA</h2><p>Sem dado real, a IA responde com baixa precisão. Complete as fontes abaixo.</p></div></div>
      <div class="grid-3">
        ${dataSources.map(([title, count, text]) => `
          <article class="data-card">
            <span class="badge ${count ? 'green' : 'amber'}">${count}</span>
            <strong>${title}</strong>
            <p>${text}</p>
          </article>
        `).join('')}
      </div>
    </section>
    <div class="grid-2" style="margin-top:14px">
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Conta real</p><h2>Cadastrar saldo</h2></div></div>
        ${accountForm()}
      </section>
      <section class="section">
        <div class="section-header"><div><p class="eyebrow">Open Finance</p><h2>Pluggy Connect</h2></div></div>
        ${openFinanceForm()}
      </section>
    </div>
  `
}

function renderSettings() {
  const settings = [
    ['Perfil', `${state.user?.name || 'Usuário'} - ${state.user?.email || ''}`, 'PF/PJ, renda, objetivos e conhecimento financeiro.'],
    ['Segurança', 'JWT ativo', 'Futuro: 2FA, sessões e dispositivos confiáveis.'],
    ['Privacidade', 'LGPD', 'Exportar dados, revogar Open Finance e excluir conta.'],
    ['Notificações', 'Alertas inteligentes', 'Push mobile, e-mail e rotinas diárias futuramente.'],
    ['Tema', 'Escuro futurista', 'Web, tablet e mobile com a mesma identidade.'],
    ['Plano', 'GRÁTIS', 'Estrutura premium sem cobrar do usuário.'],
  ]
  return `
    <section class="section">
      <div class="section-header"><div><p class="eyebrow">Sistema</p><h2>Configurações</h2></div></div>
      <div class="grid-3">
        ${settings.map(([title, value, text]) => `<article class="data-card"><span class="badge blue">${value}</span><strong>${title}</strong><p>${text}</p></article>`).join('')}
      </div>
    </section>
  `
}

function renderMenu() {
  return `
    <section class="section">
      <div class="section-header">
        <div><p class="eyebrow">Menu mobile</p><h2>Todas as abas</h2><p>No desktop, essas opções ficam na barra lateral. No mobile, entram aqui.</p></div>
      </div>
      <div class="menu-grid">
        ${NAV_ITEMS.filter((item) => !MOBILE_NAV.some((nav) => nav.id === item.id)).map((item) => `
          <button class="menu-card" type="button" data-view="${item.id}">
            <span>${renderIcon(item.icon)}</span>
            <strong>${item.label}</strong>
            <small>${item.subtitle}</small>
          </button>
        `).join('')}
      </div>
    </section>
  `
}

function progressBar(value, tone = 'blue') {
  const width = percent(value)
  const color = tone === 'red' ? 'var(--red)' : tone === 'amber' ? 'var(--amber)' : 'linear-gradient(90deg, var(--blue), var(--cyan))'
  return `<div class="progress-track"><div class="progress-fill" style="width:${width};background:${color}"></div></div>`
}

function renderView() {
  const renderers = {
    today: renderToday,
    dashboard: renderDashboard,
    ai: renderAI,
    transactions: renderTransactions,
    accounts: renderAccounts,
    cards: renderCards,
    budgets: renderBudgets,
    goals: renderGoals,
    debts: renderDebts,
    credit: renderCredit,
    investments: renderInvestments,
    pj: renderPJ,
    news: renderNews,
    alerts: renderAlerts,
    score: renderScore,
    data: renderDataHub,
    settings: renderSettings,
    menu: renderMenu,
  }

  viewRoot.innerHTML = (renderers[state.activeView] || renderToday)()
  viewRoot.focus({ preventScroll: true })
}

function setButtonLoading(form, isLoading) {
  const button = form.querySelector('button[type="submit"]')
  if (!button) return
  button.disabled = isLoading
  if (isLoading) {
    button.dataset.originalText = button.textContent
    button.textContent = 'Salvando...'
  } else if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText
  }
}

async function handleViewSubmit(event) {
  const form = event.target.closest('form')
  if (!form || !viewRoot.contains(form)) return
  event.preventDefault()

  setButtonLoading(form, true)
  const id = form.id

  try {
    if (id === 'assistantForm') {
      const body = withActiveProfile(formToJson(form))
      const answer = document.querySelector('#assistantAnswer')
      answer.textContent = 'Analisando seus dados reais...'
      const response = await request('/assistant/ask', { method: 'POST', body: JSON.stringify(body) })
      answer.textContent = response.answer || 'A IA respondeu, mas não retornou texto.'
      return
    }

    if (id === 'creditForm' || id === 'creditMiniForm') {
      const body = withActiveProfile(formToJson(form))
      if (body.requestedAmount) body.requestedAmount = Number(body.requestedAmount)
      if (body.installments) body.installments = Number(body.installments)
      const response = await request('/credit/analyze', { method: 'POST', body: JSON.stringify(body) })
      renderCreditResult(response)
      setInlineMessage(`${id}Message`, 'Análise gerada com dados reais cadastrados.', true)
      return
    }

    const routeMap = {
      transactionForm: '/transactions',
      transactionPageForm: '/transactions',
      bankAccountForm: '/banking/accounts',
      openFinanceForm: '/banking/open-finance/consent',
      pluggyConnectTokenForm: '/banking/pluggy/connect-token',
      pluggyImportForm: '/banking/pluggy/import',
      cardForm: '/cards',
      budgetForm: '/budgets',
      goalForm: '/goals',
      projectForm: '/projects',
      investmentForm: '/investments',
      alertForm: '/alerts',
      newsForm: '/news',
    }

    const route = routeMap[id]
    if (!route) return

    const body = withActiveProfile(formToJson(form))
    normalizeBody(body)
    const response = await request(route, { method: 'POST', body: JSON.stringify(body) })
    if (response.connectToken) {
      state.pluggyConnectToken = response.connectToken
      const message = 'Connect Token gerado com sucesso. A conexão bancária já pode ser aberta pelo Pluggy Connect.'
      setInlineMessage(`${id}Message`, message, true)
      showToast(message)
      return
    }

    const message = route.includes('pluggy') && response.message
        ? response.message
        : route.includes('open-finance') && response.message
          ? response.message
          : 'Dados salvos com sucesso.'
    setInlineMessage(`${id}Message`, message, true)
    showToast(message)
    await loadApp()
  } catch (error) {
    setInlineMessage(`${id}Message`, friendlyError(error), false)
    showToast(friendlyError(error))
  } finally {
    setButtonLoading(form, false)
  }
}

function normalizeBody(body) {
  const numericFields = [
    'amount',
    'returnValue',
    'currentBalance',
    'availableBalance',
    'totalLimit',
    'usedLimit',
    'availableLimit',
    'dueDay',
    'closingDay',
    'bestPurchaseDay',
    'limit',
    'month',
    'year',
    'alertAt',
    'targetAmount',
    'currentAmount',
    'relevance',
  ]

  numericFields.forEach((field) => {
    if (body[field] !== undefined) body[field] = Number(body[field])
  })

  if (body.type === 'PAYABLE') body.direction = 'EXPENSE'
  if (body.type === 'RECEIVABLE') body.direction = 'INCOME'
  if (body.usedLimit !== undefined && body.totalLimit !== undefined && body.availableLimit === undefined) {
    body.availableLimit = Math.max(0, Number(body.totalLimit) - Number(body.usedLimit))
  }
}

function renderCreditResult(analysis) {
  const container = document.querySelector('#creditResult')
  const html = `
    <div class="data-card">
      <span class="badge ${analysis.riskLevel === 'LOW' ? 'green' : analysis.riskLevel === 'MEDIUM' ? 'amber' : 'red'}">Risco ${escapeHtml(uiLabel('risk', analysis.riskLevel, 'Médio'))}</span>
      <strong>Score interno ${escapeHtml(analysis.score)}/100</strong>
      <p>${escapeHtml(analysis.disclaimer)}</p>
    </div>
    <div class="grid-2">
      ${metric('Parcela segura', money(analysis.safeInstallment), 'Compromisso mensal estimado', 'text-green')}
      ${metric('Faixa estimada', analysis.estimatedAmountRange?.formatted || money(0), `${analysis.requestedInstallments || 24} parcelas`, 'text-blue')}
    </div>
    <div class="data-card">
      <strong>Melhor data</strong>
      <p>${formatDate(analysis.bestDate?.date)} - ${escapeHtml(analysis.bestDate?.reason || '')}</p>
    </div>
    <div class="data-card">
      <strong>Onde tentar primeiro</strong>
      <p>${(analysis.providerOptions || []).slice(0, 3).map((option) => `${escapeHtml(option.name)} (${escapeHtml(uiLabel('risk', option.fit, 'Médio'))})`).join(', ') || 'Cadastre ou conecte bancos para priorizar opções por relacionamento.'}</p>
    </div>
    <div class="data-card">
      <strong>Como melhorar a aprovação</strong>
      <p>${(analysis.howToImproveApproval || []).map(escapeHtml).join(' ')}</p>
    </div>
  `
  if (container) container.innerHTML = html
  else showToast(`Parcela segura: ${money(analysis.safeInstallment)}. Faixa: ${analysis.estimatedAmountRange?.formatted || money(0)}.`)
}

async function handleViewClick(event) {
  const navButton = event.target.closest('[data-view]')
  if (navButton) {
    routeView(navButton.dataset.view)
    return
  }

  const profileButton = event.target.closest('[data-profile-id]')
  if (profileButton) {
    state.activeProfileId = profileButton.dataset.profileId
    localStorage.setItem(profileKey, state.activeProfileId)
    await loadApp()
    return
  }

  const quickQuestion = event.target.closest('[data-question]')
  if (quickQuestion) {
    const question = quickQuestion.dataset.question
    if (state.activeView !== 'ai') routeView('ai')
    const textarea = document.querySelector('#assistantForm textarea[name="question"]')
    if (textarea) textarea.value = question
    return
  }

  if (event.target.closest('[data-refresh]')) {
    await loadApp()
    showToast('Dados atualizados.')
    return
  }

  const payButton = event.target.closest('[data-pay-id]')
  if (payButton) {
    const action = payButton.dataset.payType === 'RECEIVABLE' ? 'receive' : 'pay'
    await request(`/transactions/${payButton.dataset.payId}/${action}`, { method: 'PATCH' })
    showToast(action === 'receive' ? 'Recebimento marcado.' : 'Pagamento marcado.')
    await loadApp()
    return
  }

  const projectPayButton = event.target.closest('[data-project-pay-id]')
  if (projectPayButton) {
    await request(`/projects/${projectPayButton.dataset.projectPayId}/pay`, { method: 'PATCH' })
    showToast('Projeto marcado como pago.')
    await loadApp()
    return
  }

  const alertButton = event.target.closest('[data-alert-read-id]')
  if (alertButton) {
    await request(`/alerts/${alertButton.dataset.alertReadId}/read`, { method: 'PATCH' })
    showToast('Alerta marcado como lido.')
    await loadApp()
  }
}

async function authenticate(path, form) {
  authMessage.textContent = ''
  const body = formToJson(form)
  if (body.salary) body.salary = Number(body.salary)
  const data = await request(path, { method: 'POST', body: JSON.stringify(body) })
  setToken(data.token)
  await loadApp()
}

document.querySelectorAll('[data-auth-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    const tab = button.dataset.authTab
    document.querySelectorAll('[data-auth-tab]').forEach((item) => item.classList.toggle('active', item === button))
    document.querySelector('#loginForm').classList.toggle('hidden', tab !== 'login')
    document.querySelector('#registerForm').classList.toggle('hidden', tab !== 'register')
    authMessage.textContent = ''
  })
})

document.querySelector('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault()
  try {
    await authenticate('/auth/login', event.currentTarget)
  } catch (error) {
    authMessage.textContent = friendlyError(error)
  }
})

document.querySelector('#registerForm').addEventListener('submit', async (event) => {
  event.preventDefault()
  try {
    await authenticate('/auth/register', event.currentTarget)
  } catch (error) {
    authMessage.textContent = friendlyError(error)
  }
})

document.querySelector('#logoutButton').addEventListener('click', () => {
  clearSession()
  appView.classList.add('hidden')
  authView.classList.remove('hidden')
})

document.querySelector('#mobileLogoutButton').addEventListener('click', () => {
  clearSession()
  appView.classList.add('hidden')
  authView.classList.remove('hidden')
})

viewRoot.addEventListener('submit', handleViewSubmit)
document.addEventListener('click', (event) => {
  handleViewClick(event).catch((error) => showToast(friendlyError(error)))
})

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredInstallPrompt = event
  installButton.hidden = false
})

installButton.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return
  deferredInstallPrompt.prompt()
  await deferredInstallPrompt.userChoice
  deferredInstallPrompt = undefined
  installButton.hidden = true
})

if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('/app/sw.js').catch(() => undefined)
}

if (getToken()) {
  loadApp().catch((error) => {
    clearSession()
    authMessage.textContent = friendlyError(error)
    authView.classList.remove('hidden')
    appView.classList.add('hidden')
  })
} else {
  renderNav()
}
