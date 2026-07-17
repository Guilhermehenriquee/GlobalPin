var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// services/backend/src/middlewares/auth.ts
async function authMiddleware(request, reply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "N\xE3o autorizado" });
  }
}
var init_auth = __esm({
  "services/backend/src/middlewares/auth.ts"() {
    "use strict";
  }
});

// services/backend/src/utils/zod.ts
import { ZodError } from "zod";
function parseOrReply(schema, data, reply) {
  const result = schema.safeParse(data);
  if (!result.success) {
    reply.status(400).send({
      message: "Erro de valida\xE7\xE3o",
      issues: result.error instanceof ZodError ? result.error.issues : []
    });
    return null;
  }
  return result.data;
}
var init_zod = __esm({
  "services/backend/src/utils/zod.ts"() {
    "use strict";
  }
});

// services/backend/src/modules/auth/schema.ts
import { FinancialGoal, FinancialKnowledgeLevel, InvestorProfile } from "@prisma/client";
import { z } from "zod";
var registerSchema, loginSchema;
var init_schema = __esm({
  "services/backend/src/modules/auth/schema.ts"() {
    "use strict";
    registerSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      phone: z.string().optional(),
      salary: z.coerce.number().nonnegative().optional(),
      netSalary: z.coerce.number().nonnegative().optional(),
      financialGoals: z.array(z.nativeEnum(FinancialGoal)).optional(),
      investorProfile: z.nativeEnum(InvestorProfile).optional(),
      financialKnowledge: z.nativeEnum(FinancialKnowledgeLevel).optional()
    });
    loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(1)
    });
  }
});

// services/backend/src/database/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
var adapter, prisma;
var init_prisma = __esm({
  "services/backend/src/database/prisma.ts"() {
    "use strict";
    adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL
    });
    prisma = new PrismaClient({ adapter });
  }
});

// services/backend/src/modules/auth/repository.ts
var authRepository;
var init_repository = __esm({
  "services/backend/src/modules/auth/repository.ts"() {
    "use strict";
    init_prisma();
    authRepository = {
      findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
      },
      findUserById(id) {
        return prisma.user.findUnique({
          where: { id },
          select: { id: true, name: true, email: true, phone: true, salary: true, financialGoals: true, investorProfile: true, financialKnowledge: true, createdAt: true, updatedAt: true }
        });
      },
      createUser(data) {
        return prisma.user.create({
          data,
          select: { id: true, name: true, email: true, phone: true, salary: true, financialGoals: true, investorProfile: true, financialKnowledge: true, createdAt: true, updatedAt: true }
        });
      }
    };
  }
});

// services/backend/src/modules/auth/service.ts
import bcrypt from "bcrypt";
var authService;
var init_service = __esm({
  "services/backend/src/modules/auth/service.ts"() {
    "use strict";
    init_repository();
    authService = {
      async register(input, app) {
        const existingUser = await authRepository.findUserByEmail(input.email);
        if (existingUser) {
          throw new Error("EMAIL_ALREADY_IN_USE");
        }
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await authRepository.createUser({
          name: input.name,
          email: input.email,
          phone: input.phone,
          passwordHash,
          salary: input.salary ?? input.netSalary ?? 0,
          financialGoals: input.financialGoals ?? [],
          investorProfile: input.investorProfile,
          financialKnowledge: input.financialKnowledge
        });
        const token = app.jwt.sign({ sub: user.id });
        return { user, token };
      },
      async login(input, app) {
        const user = await authRepository.findUserByEmail(input.email);
        if (!user) {
          throw new Error("INVALID_CREDENTIALS");
        }
        const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
        if (!passwordMatches) {
          throw new Error("INVALID_CREDENTIALS");
        }
        const token = app.jwt.sign({ sub: user.id });
        const { passwordHash: _passwordHash, ...safeUser } = user;
        return { user: safeUser, token };
      },
      me(userId) {
        return authRepository.findUserById(userId);
      }
    };
  }
});

// services/backend/src/modules/auth/controller.ts
var authController;
var init_controller = __esm({
  "services/backend/src/modules/auth/controller.ts"() {
    "use strict";
    init_zod();
    init_schema();
    init_service();
    authController = {
      async register(request, reply) {
        const body = parseOrReply(registerSchema, request.body, reply);
        if (!body) return;
        try {
          return reply.status(201).send(await authService.register(body, request.server));
        } catch (error) {
          if (error.message === "EMAIL_ALREADY_IN_USE") {
            return reply.status(409).send({ message: "E-mail j\xE1 est\xE1 em uso" });
          }
          throw error;
        }
      },
      async login(request, reply) {
        const body = parseOrReply(loginSchema, request.body, reply);
        if (!body) return;
        try {
          return reply.send(await authService.login(body, request.server));
        } catch (error) {
          if (error.message === "INVALID_CREDENTIALS") {
            return reply.status(401).send({ message: "E-mail ou senha inv\xE1lidos" });
          }
          throw error;
        }
      },
      async me(request, reply) {
        const user = await authService.me(request.user.sub);
        if (!user) return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
        return reply.send(user);
      }
    };
  }
});

// services/backend/src/modules/auth/routes.ts
async function authRoutes(app) {
  app.post("/register", authController.register);
  app.post("/login", authController.login);
  app.get("/me", { preHandler: [authMiddleware] }, authController.me);
}
var init_routes = __esm({
  "services/backend/src/modules/auth/routes.ts"() {
    "use strict";
    init_auth();
    init_controller();
  }
});

// services/backend/src/modules/analytics/schema.ts
import { z as z2 } from "zod";
var analyticsQuerySchema, classifyTextSchema;
var init_schema2 = __esm({
  "services/backend/src/modules/analytics/schema.ts"() {
    "use strict";
    analyticsQuerySchema = z2.object({
      month: z2.coerce.number().int().min(1).max(12).optional(),
      year: z2.coerce.number().int().min(2e3).max(2100).optional()
    });
    classifyTextSchema = z2.object({
      text: z2.string().min(2)
    });
  }
});

// services/backend/src/modules/analytics/repository.ts
var analyticsRepository;
var init_repository2 = __esm({
  "services/backend/src/modules/analytics/repository.ts"() {
    "use strict";
    init_prisma();
    analyticsRepository = {
      listReports(userId) {
        return prisma.aiReport.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 });
      }
    };
  }
});

// services/backend/src/modules/analytics/service.ts
var analyticsService;
var init_service2 = __esm({
  "services/backend/src/modules/analytics/service.ts"() {
    "use strict";
    init_repository2();
    analyticsService = {
      async summary(userId, query) {
        const reports = await analyticsRepository.listReports(userId);
        return {
          period: {
            month: query.month ?? (/* @__PURE__ */ new Date()).getMonth() + 1,
            year: query.year ?? (/* @__PURE__ */ new Date()).getFullYear()
          },
          insights: [
            "Mock: classificar texto em categoria",
            "Mock: gerar insights financeiros",
            "Mock: prever gastos",
            "Mock: detectar anomalias",
            "Mock: gerar relat\xF3rio semanal"
          ],
          recentReports: reports
        };
      },
      classifyText(input) {
        const normalizedText = input.text.toLowerCase();
        const category = normalizedText.includes("boleto") || normalizedText.includes("conta") ? "CONTAS" : normalizedText.includes("pix") ? "PIX" : normalizedText.includes("cliente") || normalizedText.includes("sistema") ? "PROJETOS" : "OUTROS";
        return {
          category,
          confidence: 0.72,
          provider: "mock"
        };
      },
      weeklyReport() {
        return {
          provider: "mock",
          title: "Relat\xF3rio semanal",
          insights: ["Revise contas pendentes", "Acompanhe receb\xEDveis em atraso", "Separe entradas de projetos do sal\xE1rio"]
        };
      }
    };
  }
});

// services/backend/src/modules/analytics/controller.ts
var analyticsController;
var init_controller2 = __esm({
  "services/backend/src/modules/analytics/controller.ts"() {
    "use strict";
    init_zod();
    init_schema2();
    init_service2();
    analyticsController = {
      async summary(request, reply) {
        const query = parseOrReply(analyticsQuerySchema, request.query, reply);
        if (!query) return;
        return reply.send(await analyticsService.summary(request.user.sub, query));
      },
      async classifyText(request, reply) {
        const body = parseOrReply(classifyTextSchema, request.body, reply);
        if (!body) return;
        return reply.send(analyticsService.classifyText(body));
      },
      async weeklyReport(_request, reply) {
        return reply.send(analyticsService.weeklyReport());
      }
    };
  }
});

// services/backend/src/modules/analytics/routes.ts
async function analyticsRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/summary", analyticsController.summary);
  app.post("/classify", analyticsController.classifyText);
  app.get("/weekly-report", analyticsController.weeklyReport);
}
var init_routes2 = __esm({
  "services/backend/src/modules/analytics/routes.ts"() {
    "use strict";
    init_auth();
    init_controller2();
  }
});

// services/backend/src/modules/alerts/schema.ts
import { AlertSeverity, AlertType } from "@prisma/client";
import { z as z3 } from "zod";
var alertSchema, alertParamsSchema;
var init_schema3 = __esm({
  "services/backend/src/modules/alerts/schema.ts"() {
    "use strict";
    alertSchema = z3.object({
      type: z3.nativeEnum(AlertType).optional(),
      severity: z3.nativeEnum(AlertSeverity).optional(),
      title: z3.string().min(2),
      message: z3.string().min(2)
    });
    alertParamsSchema = z3.object({ id: z3.string().uuid() });
  }
});

// services/backend/src/modules/alerts/repository.ts
var alertRepository;
var init_repository3 = __esm({
  "services/backend/src/modules/alerts/repository.ts"() {
    "use strict";
    init_prisma();
    alertRepository = {
      list(userId) {
        return prisma.alert.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      },
      create(userId, input) {
        return prisma.alert.create({ data: { userId, ...input } });
      },
      async read(userId, id) {
        const alert = await prisma.alert.findFirst({ where: { id, userId } });
        if (!alert) throw new Error("ALERT_NOT_FOUND");
        return prisma.alert.update({ where: { id }, data: { read: true, readAt: /* @__PURE__ */ new Date() } });
      }
    };
  }
});

// services/backend/src/modules/alerts/service.ts
var alertService;
var init_service3 = __esm({
  "services/backend/src/modules/alerts/service.ts"() {
    "use strict";
    init_repository3();
    alertService = {
      list: alertRepository.list,
      create(userId, input) {
        return alertRepository.create(userId, input);
      },
      read(userId, id) {
        return alertRepository.read(userId, id);
      }
    };
  }
});

// services/backend/src/modules/alerts/controller.ts
var alertController;
var init_controller3 = __esm({
  "services/backend/src/modules/alerts/controller.ts"() {
    "use strict";
    init_zod();
    init_schema3();
    init_service3();
    alertController = {
      async list(request, reply) {
        return reply.send(await alertService.list(request.user.sub));
      },
      async create(request, reply) {
        const body = parseOrReply(alertSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await alertService.create(request.user.sub, body));
      },
      async read(request, reply) {
        const params = parseOrReply(alertParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await alertService.read(request.user.sub, params.id));
        } catch (error) {
          if (error.message === "ALERT_NOT_FOUND") return reply.status(404).send({ message: "Alerta n\xE3o encontrado" });
          throw error;
        }
      }
    };
  }
});

// services/backend/src/modules/alerts/routes.ts
async function alertRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", alertController.list);
  app.post("/", alertController.create);
  app.patch("/:id/read", alertController.read);
}
var init_routes3 = __esm({
  "services/backend/src/modules/alerts/routes.ts"() {
    "use strict";
    init_auth();
    init_controller3();
  }
});

// services/backend/src/modules/assistant/schema.ts
import { z as z4 } from "zod";
var assistantQuestionSchema;
var init_schema4 = __esm({
  "services/backend/src/modules/assistant/schema.ts"() {
    "use strict";
    assistantQuestionSchema = z4.object({
      question: z4.string().min(3),
      profileId: z4.string().uuid().optional()
    });
  }
});

// services/backend/src/modules/credit/repository.ts
import { TransactionStatus, TransactionType } from "@prisma/client";
var creditRepository;
var init_repository4 = __esm({
  "services/backend/src/modules/credit/repository.ts"() {
    "use strict";
    init_prisma();
    creditRepository = {
      async getContext(userId, profileId) {
        const now = /* @__PURE__ */ new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const [user, transactions, accounts, cards, connections, profile] = await Promise.all([
          prisma.user.findUnique({ where: { id: userId } }),
          prisma.transaction.findMany({ where: { userId, profileId, dueDate: { gte: start, lt: end } } }),
          prisma.bankAccount.findMany({ where: { userId } }),
          prisma.card.findMany({ where: { userId, profileId } }),
          prisma.bankConnection.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
          profileId ? prisma.financialProfile.findFirst({ where: { id: profileId, userId } }) : null
        ]);
        const receivables = transactions.filter((transaction) => transaction.type === TransactionType.RECEIVABLE).reduce((total, transaction) => total + Number(transaction.amount), 0);
        const pendingBills = transactions.filter((transaction) => transaction.type === TransactionType.PAYABLE && transaction.status === TransactionStatus.PENDING).reduce((total, transaction) => total + Number(transaction.amount), 0);
        const paidExpenses = transactions.filter((transaction) => transaction.type === TransactionType.PAYABLE && transaction.status === TransactionStatus.PAID).reduce((total, transaction) => total + Number(transaction.amount), 0);
        const cardUsed = cards.reduce((total, card) => total + Number(card.usedLimit), 0);
        const cardLimit = cards.reduce((total, card) => total + Number(card.totalLimit), 0);
        const balance = accounts.reduce((total, account) => total + Number(account.availableBalance), 0);
        return {
          user,
          profile,
          transactions,
          accounts,
          cards,
          connections,
          monthlyIncome: Number(user?.salary ?? 0) + receivables,
          pendingBills,
          paidExpenses,
          cardUsed,
          cardLimit,
          balance
        };
      }
    };
  }
});

// services/backend/src/modules/credit/service.ts
import { FinancialProfileType } from "@prisma/client";
function calculatePrincipal(installment, months, monthlyRate) {
  if (monthlyRate <= 0) return installment * months;
  return installment * ((1 - (1 + monthlyRate) ** -months) / monthlyRate);
}
function nextBestDate() {
  const now = /* @__PURE__ */ new Date();
  const candidate = new Date(now.getFullYear(), now.getMonth(), 5);
  if (now.getDate() > 8) candidate.setMonth(candidate.getMonth() + 1);
  return candidate.toISOString().slice(0, 10);
}
function buildProviderOptions(input) {
  const options = [];
  const primaryBanks = [...new Set(input.bankNames)].slice(0, 3);
  primaryBanks.forEach((bankName) => {
    options.push({
      name: bankName,
      type: "CONNECTED_BANK",
      fit: input.score >= 65 ? "HIGH" : "MEDIUM",
      reason: "Institui\xE7\xE3o j\xE1 conectada/registrada no app; hist\xF3rico e relacionamento podem ajudar na avalia\xE7\xE3o.",
      nextStep: "Simular cr\xE9dito no app/site do banco e comparar CET, prazo e seguros embutidos."
    });
  });
  options.push({
    name: "Marketplace de cr\xE9dito autorizado",
    type: "CREDIT_MARKETPLACE",
    fit: input.score >= 55 ? "MEDIUM" : "LOW",
    reason: "Permite comparar v\xE1rias institui\xE7\xF5es sem aceitar a primeira oferta.",
    nextStep: "Buscar propostas com CET total e evitar contratos com tarifas escondidas."
  });
  if (input.monthlyIncome > 0) {
    options.push({
      name: "Cr\xE9dito com renda comprovada",
      type: "PAYROLL",
      fit: input.score >= 60 ? "HIGH" : "MEDIUM",
      reason: "Renda recorrente melhora previsibilidade de pagamento.",
      nextStep: "Separar comprovante de renda, extratos e verificar se consignado/garantia se aplica ao seu caso."
    });
  }
  if (input.balance > 0) {
    options.push({
      name: "Cr\xE9dito com garantia ou relacionamento",
      type: "SECURED_LOAN",
      fit: "MEDIUM",
      reason: "Garantia ou saldo positivo pode reduzir risco percebido, mas exige cuidado com perda do bem/garantia.",
      nextStep: "Comparar custo total e risco antes de usar garantia."
    });
  }
  if (input.profileType === FinancialProfileType.BUSINESS) {
    options.push({
      name: "Capital de giro PJ",
      type: "BUSINESS_CREDIT",
      fit: input.score >= 60 ? "HIGH" : "MEDIUM",
      reason: "Perfil PJ pode buscar cr\xE9dito para fluxo de caixa, estoque ou antecipa\xE7\xE3o de receb\xEDveis.",
      nextStep: "Simular capital de giro e antecipa\xE7\xE3o de receb\xEDveis comparando CET e impacto no caixa."
    });
  }
  return options;
}
async function analyzeCredit(userId, input = {}) {
  const context = await creditRepository.getContext(userId, input.profileId);
  const monthlyIncome = context.monthlyIncome;
  const committed = context.pendingBills + context.paidExpenses + context.cardUsed;
  const freeCash = monthlyIncome - context.pendingBills - context.paidExpenses;
  const cardUsage = context.cardLimit > 0 ? context.cardUsed / context.cardLimit : 0;
  const debtToIncome = monthlyIncome > 0 ? committed / monthlyIncome : 1;
  const safeInstallment = Math.max(0, Math.min(monthlyIncome * 0.22, freeCash * 0.45));
  const requestedInstallments = input.installments ?? 24;
  const conservativeMonthlyRate = Number(process.env.CREDIT_ANALYSIS_MONTHLY_RATE ?? 0.035);
  const estimatedPrincipal = calculatePrincipal(safeInstallment, requestedInstallments, conservativeMonthlyRate);
  const requestedAmount = input.requestedAmount;
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        68 + (monthlyIncome > 0 ? 10 : -20) + (freeCash > 0 ? 12 : -18) + (debtToIncome <= 0.35 ? 12 : debtToIncome <= 0.55 ? 2 : -16) + (cardUsage <= 0.5 ? 8 : cardUsage <= 0.75 ? 0 : -12) + (context.balance > 0 ? 6 : 0)
      )
    )
  );
  const maxRecommendedAmount = Math.floor(estimatedPrincipal);
  const requestStatus = requestedAmount ? requestedAmount <= maxRecommendedAmount ? "O valor solicitado parece caber na faixa segura estimada." : "O valor solicitado parece acima da faixa segura estimada; reduza valor, aumente prazo ou reorganize despesas." : "Informe um valor desejado para comparar com sua capacidade estimada.";
  const bankNames = [...context.accounts.map((account) => account.bankName), ...context.connections.map((connection) => connection.bankName)];
  const providerOptions = buildProviderOptions({
    bankNames,
    score,
    profileType: context.profile?.type,
    monthlyIncome,
    balance: context.balance
  });
  return {
    disclaimer: "An\xE1lise estimada com base nos dados cadastrados/importados. N\xE3o garante aprova\xE7\xE3o, taxa ou oferta. Compare sempre o CET total antes de contratar.",
    score,
    riskLevel: score >= 75 ? "LOW" : score >= 55 ? "MEDIUM" : "HIGH",
    monthlyIncome,
    committed,
    freeCash,
    debtToIncome: Number(debtToIncome.toFixed(2)),
    cardUsage: Number(cardUsage.toFixed(2)),
    safeInstallment,
    estimatedAmountRange: {
      min: Math.floor(maxRecommendedAmount * 0.65),
      max: maxRecommendedAmount,
      formatted: `${money(maxRecommendedAmount * 0.65)} a ${money(maxRecommendedAmount)}`
    },
    requestedAmount,
    requestedInstallments,
    requestStatus,
    bestDate: {
      date: nextBestDate(),
      reason: "Preferencialmente logo ap\xF3s receber renda e antes de comprometer o m\xEAs com cart\xE3o/contas."
    },
    bestBenefitStrategy: [
      "Compare CET total, n\xE3o apenas juros mensal.",
      "Use o banco onde recebe renda ou tem maior relacionamento como primeira simula\xE7\xE3o.",
      "Evite contratar quando o cart\xE3o estiver acima de 75% do limite.",
      "Se o objetivo for quitar d\xEDvida cara, s\xF3 vale se a nova parcela reduzir o custo total."
    ],
    howToImproveApproval: [
      "Atualize renda, contas e cart\xF5es com dados reais.",
      "Pague ou renegocie pend\xEAncias antes de simular.",
      "Reduza uso de cart\xE3o e evite novas parcelas antes da an\xE1lise.",
      "Separe comprovante de renda, extratos e finalidade do empr\xE9stimo."
    ],
    providerOptions
  };
}
function formatAnalysisForAssistant(analysis) {
  const bestProviders = analysis.providerOptions.slice(0, 3).map((provider) => `${provider.name} (${provider.fit})`).join(", ");
  return [
    `Fiz uma an\xE1lise estimada de cr\xE9dito com seus dados reais.`,
    `Score interno: ${analysis.score}/100, risco ${analysis.riskLevel}.`,
    `Parcela segura estimada: ${money(analysis.safeInstallment)}.`,
    `Faixa de empr\xE9stimo estimada: ${analysis.estimatedAmountRange.formatted} em ${analysis.requestedInstallments}x.`,
    `Melhor janela: ${analysis.bestDate.date}, ${analysis.bestDate.reason.toLowerCase()}`,
    `Onde buscar primeiro: ${bestProviders || "cadastre/conecte bancos para eu sugerir institui\xE7\xF5es com base no seu relacionamento."}`,
    analysis.requestStatus,
    `Importante: ${analysis.disclaimer}`
  ].join(" ");
}
var money, creditService;
var init_service4 = __esm({
  "services/backend/src/modules/credit/service.ts"() {
    "use strict";
    init_repository4();
    money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.max(0, value));
    creditService = {
      analyze: analyzeCredit,
      formatAnalysisForAssistant
    };
  }
});

// services/backend/src/modules/assistant/repository.ts
import { TransactionType as TransactionType2 } from "@prisma/client";
var assistantRepository;
var init_repository5 = __esm({
  "services/backend/src/modules/assistant/repository.ts"() {
    "use strict";
    init_prisma();
    assistantRepository = {
      saveMessage(userId, role, content, metadata) {
        return prisma.aiConversation.create({ data: { userId, role, content, metadata: metadata ?? void 0 } });
      },
      getMonthTransactions(userId, profileId) {
        const now = /* @__PURE__ */ new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return prisma.transaction.findMany({ where: { userId, profileId, dueDate: { gte: start, lt: end } } });
      },
      async getFinancialContext(userId, profileId) {
        const [user, transactions, budgets] = await Promise.all([
          prisma.user.findUnique({ where: { id: userId } }),
          this.getMonthTransactions(userId, profileId),
          prisma.budget.findMany({ where: { userId, profileId } })
        ]);
        const income = transactions.filter((item) => item.type === TransactionType2.RECEIVABLE).reduce((sum2, item) => sum2 + Number(item.amount), 0);
        const expenses = transactions.filter((item) => item.type === TransactionType2.PAYABLE).reduce((sum2, item) => sum2 + Number(item.amount), 0);
        return { user, transactions, budgets, income, expenses };
      }
    };
  }
});

// services/backend/src/modules/assistant/service.ts
import { AiConversationRole as AiConversationRole2 } from "@prisma/client";
var assistantService;
var init_service5 = __esm({
  "services/backend/src/modules/assistant/service.ts"() {
    "use strict";
    init_service4();
    init_repository5();
    assistantService = {
      async ask(userId, input) {
        await assistantRepository.saveMessage(userId, AiConversationRole2.USER, input.question);
        const context = await assistantRepository.getFinancialContext(userId, input.profileId);
        const lowerQuestion = input.question.toLowerCase();
        const answer = lowerQuestion.includes("emprestimo") || lowerQuestion.includes("empr\xE9stimo") || lowerQuestion.includes("credito") || lowerQuestion.includes("cr\xE9dito") || lowerQuestion.includes("financiamento") ? creditService.formatAnalysisForAssistant(await creditService.analyze(userId, { profileId: input.profileId })) : lowerQuestion.includes("guardar") || lowerQuestion.includes("economizar") ? `Neste m\xEAs, sua renda registrada \xE9 R$ ${context.income.toFixed(2)} e suas despesas somam R$ ${context.expenses.toFixed(2)}. Um alvo conservador seria guardar parte do saldo livre antes de novas compras.` : lowerQuestion.includes("gastei") || lowerQuestion.includes("gastos") ? `Voc\xEA tem ${context.transactions.length} transa\xE7\xF5es no m\xEAs, com despesas de R$ ${context.expenses.toFixed(2)}. As maiores oportunidades aparecem por categoria no dashboard/or\xE7amento.` : "Ainda sou um assistente mockado, mas j\xE1 consigo ler seu contexto financeiro e responder perguntas b\xE1sicas sobre gastos, economia e or\xE7amento.";
        await assistantRepository.saveMessage(userId, AiConversationRole2.ASSISTANT, answer, { provider: "mock" });
        return { answer, provider: "mock" };
      }
    };
  }
});

// services/backend/src/modules/assistant/controller.ts
var assistantController;
var init_controller4 = __esm({
  "services/backend/src/modules/assistant/controller.ts"() {
    "use strict";
    init_zod();
    init_schema4();
    init_service5();
    assistantController = {
      async ask(request, reply) {
        const body = parseOrReply(assistantQuestionSchema, request.body, reply);
        if (!body) return;
        return reply.send(await assistantService.ask(request.user.sub, body));
      }
    };
  }
});

// services/backend/src/modules/assistant/routes.ts
async function assistantRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.post("/ask", assistantController.ask);
}
var init_routes4 = __esm({
  "services/backend/src/modules/assistant/routes.ts"() {
    "use strict";
    init_auth();
    init_controller4();
  }
});

// services/backend/src/modules/banking/schema.ts
import { BankAccountType, CardBrand, InvestmentLiquidity, InvestmentRisk, InvestmentType, TransactionDirection, TransactionForm, TransactionType as TransactionType3 } from "@prisma/client";
import { z as z5 } from "zod";
var bankConnectionSchema, bankAccountSchema, openFinanceConsentSchema, openFinanceImportSchema, pluggyCredentialsSchema, pluggyApiKeySchema, pluggyConnectTokenSchema, pluggyImportSchema, bankingParamsSchema;
var init_schema5 = __esm({
  "services/backend/src/modules/banking/schema.ts"() {
    "use strict";
    bankConnectionSchema = z5.object({
      provider: z5.string().min(2),
      bankName: z5.string().min(2)
    });
    bankAccountSchema = z5.object({
      bankConnectionId: z5.string().uuid().optional(),
      externalId: z5.string().optional(),
      bankName: z5.string().min(2),
      agency: z5.string().optional(),
      accountNumber: z5.string().optional(),
      accountType: z5.nativeEnum(BankAccountType).optional(),
      currentBalance: z5.coerce.number().optional(),
      availableBalance: z5.coerce.number().optional()
    });
    openFinanceConsentSchema = z5.object({
      provider: z5.string().min(2),
      bankName: z5.string().min(2),
      redirectUri: z5.string().url().optional(),
      permissions: z5.array(z5.string().min(2)).optional()
    });
    openFinanceImportSchema = z5.object({
      bankConnectionId: z5.string().uuid().optional(),
      profileId: z5.string().uuid().optional(),
      accounts: z5.array(bankAccountSchema).optional(),
      transactions: z5.array(z5.object({
        externalId: z5.string().min(1),
        bankAccountExternalId: z5.string().optional(),
        bankAccountId: z5.string().uuid().optional(),
        title: z5.string().min(2),
        amount: z5.coerce.number().positive(),
        type: z5.nativeEnum(TransactionType3),
        direction: z5.nativeEnum(TransactionDirection).optional(),
        form: z5.nativeEnum(TransactionForm).optional(),
        originalDescription: z5.string().optional(),
        categoryName: z5.string().optional(),
        subcategory: z5.string().optional(),
        merchant: z5.string().optional(),
        recurrence: z5.string().optional(),
        dueDate: z5.coerce.date(),
        paidAt: z5.coerce.date().optional(),
        notes: z5.string().optional()
      })).optional(),
      cards: z5.array(z5.object({
        externalId: z5.string().min(1),
        bankAccountExternalId: z5.string().optional(),
        name: z5.string().min(2),
        brand: z5.nativeEnum(CardBrand).optional(),
        totalLimit: z5.coerce.number().nonnegative().optional(),
        usedLimit: z5.coerce.number().nonnegative().optional(),
        availableLimit: z5.coerce.number().nonnegative().optional(),
        closingDay: z5.coerce.number().int().min(1).max(31).optional(),
        dueDay: z5.coerce.number().int().min(1).max(31).optional(),
        bestPurchaseDay: z5.coerce.number().int().min(1).max(31).optional()
      })).optional(),
      investments: z5.array(z5.object({
        externalId: z5.string().min(1),
        institution: z5.string().min(2),
        product: z5.string().min(2),
        type: z5.nativeEnum(InvestmentType),
        amount: z5.coerce.number().positive(),
        profitability: z5.string().optional(),
        maturity: z5.coerce.date().optional(),
        risk: z5.nativeEnum(InvestmentRisk).optional(),
        liquidity: z5.nativeEnum(InvestmentLiquidity).optional()
      })).optional()
    });
    pluggyCredentialsSchema = {
      clientId: z5.string().uuid().optional(),
      clientSecret: z5.string().min(1).optional(),
      apiKey: z5.string().min(1).optional()
    };
    pluggyApiKeySchema = z5.object({
      clientId: z5.string().uuid().optional(),
      clientSecret: z5.string().min(1).optional()
    });
    pluggyConnectTokenSchema = z5.object({
      ...pluggyCredentialsSchema,
      itemId: z5.string().uuid().optional(),
      bankName: z5.string().min(2).optional(),
      clientUserId: z5.string().min(1).optional(),
      webhookUrl: z5.string().url().optional(),
      oauthRedirectUri: z5.string().url().optional(),
      avoidDuplicates: z5.coerce.boolean().optional()
    });
    pluggyImportSchema = z5.object({
      ...pluggyCredentialsSchema,
      itemId: z5.string().uuid(),
      bankConnectionId: z5.string().uuid().optional(),
      profileId: z5.string().uuid().optional(),
      dateFrom: z5.coerce.date().optional(),
      dateTo: z5.coerce.date().optional()
    });
    bankingParamsSchema = z5.object({ id: z5.string().uuid() });
  }
});

// services/backend/src/modules/banking/repository.ts
import { BankConnectionStatus, ConsentStatus, TransactionDirection as TransactionDirection2, TransactionSource } from "@prisma/client";
var bankingRepository;
var init_repository6 = __esm({
  "services/backend/src/modules/banking/repository.ts"() {
    "use strict";
    init_prisma();
    bankingRepository = {
      listConnections(userId) {
        return prisma.bankConnection.findMany({ where: { userId }, include: { accounts: true }, orderBy: { createdAt: "desc" } });
      },
      async createConnection(userId, input) {
        return prisma.bankConnection.create({
          data: {
            userId,
            provider: input.provider,
            bankName: input.bankName,
            status: BankConnectionStatus.PENDING,
            consents: {
              create: {
                userId,
                status: ConsentStatus.PENDING,
                permissions: ["ACCOUNTS_READ", "TRANSACTIONS_READ", "CREDIT_CARDS_READ"]
              }
            }
          },
          include: { consents: true }
        });
      },
      revokeConnection(userId, id) {
        return prisma.bankConnection.update({
          where: { id, userId },
          data: { status: BankConnectionStatus.REVOKED, revokedAt: /* @__PURE__ */ new Date(), consents: { updateMany: { where: {}, data: { status: ConsentStatus.REVOKED, revokedAt: /* @__PURE__ */ new Date() } } } }
        });
      },
      listAccounts(userId) {
        return prisma.bankAccount.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      },
      createAccount(userId, input) {
        return prisma.bankAccount.create({ data: { userId, ...input } });
      },
      updateConnection(id, userId, data) {
        return prisma.bankConnection.update({ where: { id, userId }, data });
      },
      async importOpenFinanceData(userId, input) {
        return prisma.$transaction(async (tx) => {
          const accountsByExternalId = /* @__PURE__ */ new Map();
          let accounts = 0;
          let transactions = 0;
          let cards = 0;
          let investments = 0;
          for (const account of input.accounts ?? []) {
            const saved = account.externalId ? await tx.bankAccount.upsert({
              where: { userId_externalId: { userId, externalId: account.externalId } },
              create: { userId, bankConnectionId: input.bankConnectionId ?? account.bankConnectionId, ...account },
              update: { bankConnectionId: input.bankConnectionId ?? account.bankConnectionId, ...account }
            }) : await tx.bankAccount.create({ data: { userId, bankConnectionId: input.bankConnectionId ?? account.bankConnectionId, ...account } });
            if (saved.externalId) accountsByExternalId.set(saved.externalId, saved.id);
            accounts += 1;
          }
          for (const transaction of input.transactions ?? []) {
            const bankAccountId = transaction.bankAccountId ?? (transaction.bankAccountExternalId ? accountsByExternalId.get(transaction.bankAccountExternalId) : void 0);
            const data = {
              userId,
              profileId: input.profileId,
              bankAccountId,
              externalId: transaction.externalId,
              title: transaction.title,
              amount: transaction.amount,
              type: transaction.type,
              direction: transaction.direction ?? (transaction.type === "RECEIVABLE" ? TransactionDirection2.INCOME : TransactionDirection2.EXPENSE),
              form: transaction.form,
              source: TransactionSource.OPEN_FINANCE,
              status: transaction.type === "RECEIVABLE" ? "RECEIVED" : "PAID",
              originalDescription: transaction.originalDescription,
              categoryName: transaction.categoryName,
              subcategory: transaction.subcategory,
              merchant: transaction.merchant,
              recurrence: transaction.recurrence,
              dueDate: transaction.dueDate,
              paidAt: transaction.paidAt,
              notes: transaction.notes
            };
            await tx.transaction.upsert({
              where: { userId_source_externalId: { userId, source: TransactionSource.OPEN_FINANCE, externalId: transaction.externalId } },
              create: data,
              update: data
            });
            transactions += 1;
          }
          for (const card of input.cards ?? []) {
            const bankAccountId = card.bankAccountExternalId ? accountsByExternalId.get(card.bankAccountExternalId) : void 0;
            const totalLimit = card.totalLimit ?? 0;
            const usedLimit = card.usedLimit ?? 0;
            await tx.card.upsert({
              where: { userId_externalId: { userId, externalId: card.externalId } },
              create: {
                userId,
                profileId: input.profileId,
                bankAccountId,
                externalId: card.externalId,
                name: card.name,
                brand: card.brand,
                totalLimit,
                usedLimit,
                availableLimit: card.availableLimit ?? totalLimit - usedLimit,
                closingDay: card.closingDay,
                dueDay: card.dueDay,
                bestPurchaseDay: card.bestPurchaseDay
              },
              update: {
                profileId: input.profileId,
                bankAccountId,
                name: card.name,
                brand: card.brand,
                totalLimit,
                usedLimit,
                availableLimit: card.availableLimit ?? totalLimit - usedLimit,
                closingDay: card.closingDay,
                dueDay: card.dueDay,
                bestPurchaseDay: card.bestPurchaseDay
              }
            });
            cards += 1;
          }
          for (const investment of input.investments ?? []) {
            await tx.investment.upsert({
              where: { userId_externalId: { userId, externalId: investment.externalId } },
              create: { userId, profileId: input.profileId, ...investment },
              update: { profileId: input.profileId, ...investment }
            });
            investments += 1;
          }
          if (input.bankConnectionId) {
            await tx.bankConnection.update({
              where: { id: input.bankConnectionId, userId },
              data: { status: BankConnectionStatus.ACTIVE, metadata: { lastImportAt: (/* @__PURE__ */ new Date()).toISOString(), source: "OPEN_FINANCE_IMPORT" } }
            });
          }
          return { accounts, transactions, cards, investments };
        });
      }
    };
  }
});

// services/backend/src/modules/banking/pluggy.ts
import { BankAccountType as BankAccountType2, CardBrand as CardBrand2, InvestmentLiquidity as InvestmentLiquidity2, InvestmentRisk as InvestmentRisk2, InvestmentType as InvestmentType2, TransactionForm as TransactionForm2, TransactionType as TransactionType4 } from "@prisma/client";
function pluggyBaseUrl() {
  return (process.env.PLUGGY_API_URL ?? DEFAULT_PLUGGY_API_URL).replace(/\/$/, "");
}
function envCredential(input) {
  const credentialInput = input;
  return {
    apiKey: credentialInput.apiKey ?? process.env.PLUGGY_API_KEY,
    clientId: credentialInput.clientId ?? process.env.PLUGGY_CLIENT_ID,
    clientSecret: credentialInput.clientSecret ?? process.env.PLUGGY_CLIENT_SECRET
  };
}
async function pluggyRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (options.apiKey) headers.set("X-API-KEY", options.apiKey);
  const response = await fetch(`${pluggyBaseUrl()}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message ?? data?.error ?? `Erro Pluggy ${response.status}`;
    throw new Error(`Pluggy: ${message}`);
  }
  return data;
}
function collection(data) {
  if (Array.isArray(data)) return data;
  const record = data;
  return record?.results ?? record?.data ?? record?.accounts ?? record?.transactions ?? record?.investments ?? [];
}
function nextCursor(data) {
  const value = data?.next;
  if (!value || typeof value !== "string") return null;
  if (value.startsWith("http")) return new URL(value).searchParams.get("after");
  return value;
}
function dateOnly(value) {
  return value ? value.toISOString().slice(0, 10) : void 0;
}
function asDate(value) {
  if (!value) return /* @__PURE__ */ new Date();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? /* @__PURE__ */ new Date() : date;
}
function asNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}
function accountType(account) {
  const type = String(account.subtype ?? account.type ?? "").toUpperCase();
  if (type.includes("SAVING")) return BankAccountType2.SAVINGS;
  if (type.includes("INVEST")) return BankAccountType2.INVESTMENT;
  if (type.includes("PAYMENT")) return BankAccountType2.PAYMENT;
  return BankAccountType2.CHECKING;
}
function bankNameFrom(account, item) {
  return account.marketingName ?? account.name ?? item?.connector?.name ?? item?.institution?.name ?? "Pluggy";
}
function accountNumberFrom(account) {
  return account.number ?? account.bankData?.transferNumber ?? account.bankData?.accountNumber ?? account.bankData?.account;
}
function transactionType(amount) {
  return amount >= 0 ? TransactionType4.RECEIVABLE : TransactionType4.PAYABLE;
}
function transactionForm(transaction) {
  const value = `${transaction.type ?? ""} ${transaction.description ?? ""} ${transaction.descriptionRaw ?? ""}`.toLowerCase();
  if (value.includes("pix")) return TransactionForm2.PIX;
  if (value.includes("boleto")) return TransactionForm2.BOLETO;
  if (value.includes("ted")) return TransactionForm2.TED;
  if (value.includes("doc")) return TransactionForm2.DOC;
  if (value.includes("transfer")) return TransactionForm2.TRANSFER;
  if (value.includes("card") || value.includes("cart")) return TransactionForm2.CARD;
  return TransactionForm2.OTHER;
}
function categoryName(transaction) {
  const category = transaction.category;
  if (typeof category === "string") return category;
  return category?.description ?? category?.name ?? transaction.categoryDescription;
}
function cardFromAccount(account, item) {
  const creditData = account.creditData ?? {};
  const totalLimit = asNumber(creditData.creditLimit ?? creditData.limit ?? account.limit);
  const availableLimit = asNumber(creditData.availableCreditLimit ?? creditData.availableLimit ?? account.availableCreditLimit);
  const usedLimit = totalLimit > 0 && availableLimit > 0 ? Math.max(0, totalLimit - availableLimit) : Math.abs(asNumber(account.balance));
  const dueDate = creditData.balanceDueDate ? new Date(creditData.balanceDueDate) : null;
  return {
    externalId: String(account.id),
    bankAccountExternalId: void 0,
    name: account.marketingName ?? account.name ?? `${bankNameFrom(account, item)} Cart\xE3o`,
    brand: CardBrand2.OTHER,
    totalLimit,
    usedLimit,
    availableLimit: totalLimit > 0 ? Math.max(0, totalLimit - usedLimit) : availableLimit,
    dueDay: dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate.getDate() : void 0
  };
}
function investmentType(investment) {
  const value = `${investment.type ?? ""} ${investment.subtype ?? ""} ${investment.name ?? ""}`.toUpperCase();
  if (value.includes("TESOURO") || value.includes("TREASURY")) return InvestmentType2.TREASURY;
  if (value.includes("FII")) return InvestmentType2.FII;
  if (value.includes("STOCK") || value.includes("ACAO") || value.includes("A\xC7\xC3O")) return InvestmentType2.STOCK;
  if (value.includes("FUND") || value.includes("FUNDO")) return InvestmentType2.FUND;
  if (value.includes("CRYPTO")) return InvestmentType2.CRYPTO;
  if (value.includes("SAVING") || value.includes("POUPAN")) return InvestmentType2.SAVINGS;
  return InvestmentType2.CDB;
}
function investmentLiquidity(investment) {
  const value = `${investment.liquidity ?? ""} ${investment.dueDate ?? ""} ${investment.maturityDate ?? ""}`.toUpperCase();
  if (value.includes("DAILY") || value.includes("DI\xC1RIA") || value.includes("DIARIA")) return InvestmentLiquidity2.DAILY;
  if (value.includes("VARIABLE") || value.includes("VARI")) return InvestmentLiquidity2.VARIABLE;
  return InvestmentLiquidity2.MATURITY;
}
var DEFAULT_PLUGGY_API_URL, API_KEY_TTL_MS, cachedApiKey, pluggyClient;
var init_pluggy = __esm({
  "services/backend/src/modules/banking/pluggy.ts"() {
    "use strict";
    DEFAULT_PLUGGY_API_URL = "https://api.pluggy.ai";
    API_KEY_TTL_MS = 1e3 * 60 * 90;
    cachedApiKey = null;
    pluggyClient = {
      async apiKey(input = {}) {
        const credential = envCredential(input);
        if (credential.apiKey) return credential.apiKey;
        if (cachedApiKey && cachedApiKey.expiresAt > Date.now()) return cachedApiKey.value;
        if (!credential.clientId || !credential.clientSecret) {
          throw new Error("Pluggy: informe Client ID e Client Secret, ou configure PLUGGY_API_KEY no .env.");
        }
        const data = await pluggyRequest("/auth", {
          method: "POST",
          body: JSON.stringify({ clientId: credential.clientId, clientSecret: credential.clientSecret })
        });
        const apiKey = data.apiKey ?? data.accessToken ?? data.token;
        if (!apiKey) throw new Error("Pluggy: a autentica\xE7\xE3o n\xE3o retornou API Key.");
        cachedApiKey = { value: apiKey, expiresAt: Date.now() + API_KEY_TTL_MS };
        return apiKey;
      },
      async connectToken(input, userId) {
        const apiKey = await this.apiKey(input);
        const body = {
          itemId: input.itemId,
          clientUserId: input.clientUserId ?? userId,
          webhookUrl: input.webhookUrl ?? process.env.PLUGGY_WEBHOOK_URL,
          oauthRedirectUri: input.oauthRedirectUri ?? process.env.PLUGGY_OAUTH_REDIRECT_URI,
          avoidDuplicates: input.avoidDuplicates ?? true
        };
        return pluggyRequest("/connect_token", {
          method: "POST",
          apiKey,
          body: JSON.stringify(Object.fromEntries(Object.entries(body).filter(([, value]) => value !== void 0)))
        });
      },
      async item(input) {
        const apiKey = await this.apiKey(input);
        return pluggyRequest(`/items/${input.itemId}`, { apiKey });
      },
      async accounts(input) {
        const apiKey = await this.apiKey(input);
        const data = await pluggyRequest(`/accounts?itemId=${encodeURIComponent(input.itemId)}`, { apiKey });
        return collection(data);
      },
      async transactions(input, accountId) {
        const apiKey = await this.apiKey(input);
        const transactions = [];
        let after = null;
        let pages = 0;
        do {
          const params = new URLSearchParams({ accountId, pageSize: "100" });
          if (input.dateFrom) params.set("from", dateOnly(input.dateFrom));
          if (input.dateTo) params.set("to", dateOnly(input.dateTo));
          if (after) params.set("after", after);
          const data = await pluggyRequest(`/transactions?${params.toString()}`, { apiKey });
          transactions.push(...collection(data));
          after = nextCursor(data);
          pages += 1;
        } while (after && pages < 20);
        return transactions;
      },
      async investments(input) {
        const apiKey = await this.apiKey(input);
        const data = await pluggyRequest(`/investments?itemId=${encodeURIComponent(input.itemId)}`, { apiKey });
        return collection(data);
      },
      async importPayload(input) {
        const [item, accounts, investments] = await Promise.all([
          this.item(input).catch(() => void 0),
          this.accounts(input),
          this.investments(input).catch(() => [])
        ]);
        const bankAccounts = accounts.filter((account) => String(account.type ?? "").toUpperCase() !== "CREDIT");
        const creditAccounts = accounts.filter((account) => String(account.type ?? "").toUpperCase() === "CREDIT");
        const transactionsByAccount = await Promise.all(accounts.map(async (account) => this.transactions(input, String(account.id)).catch(() => [])));
        const transactions = transactionsByAccount.flat();
        return {
          bankConnectionId: input.bankConnectionId,
          profileId: input.profileId,
          accounts: bankAccounts.map((account) => ({
            externalId: String(account.id),
            bankName: bankNameFrom(account, item),
            agency: account.bankData?.branchCode ?? account.bankData?.agency,
            accountNumber: accountNumberFrom(account),
            accountType: accountType(account),
            currentBalance: asNumber(account.balance),
            availableBalance: asNumber(account.balance)
          })),
          cards: creditAccounts.map((account) => cardFromAccount(account, item)),
          transactions: transactions.map((transaction) => {
            const amount = asNumber(transaction.amount);
            const type = transactionType(amount);
            return {
              externalId: String(transaction.id),
              bankAccountExternalId: String(transaction.accountId ?? transaction.account?.id ?? ""),
              title: transaction.description ?? transaction.descriptionRaw ?? transaction.title ?? "Transa\xE7\xE3o Pluggy",
              amount: Math.abs(amount),
              type,
              form: transactionForm(transaction),
              originalDescription: transaction.descriptionRaw ?? transaction.description,
              categoryName: categoryName(transaction),
              merchant: transaction.merchant?.name ?? transaction.merchantName,
              dueDate: asDate(transaction.date ?? transaction.paymentDate ?? transaction.createdAt),
              paidAt: asDate(transaction.date ?? transaction.paymentDate ?? transaction.createdAt),
              notes: "Importado pela Pluggy"
            };
          }),
          investments: investments.map((investment) => ({
            externalId: String(investment.id),
            institution: investment.institution?.name ?? item?.connector?.name ?? "Pluggy",
            product: investment.name ?? investment.code ?? investment.type ?? "Investimento Pluggy",
            type: investmentType(investment),
            amount: asNumber(investment.amount ?? investment.balance ?? investment.value),
            profitability: investment.rate ?? investment.profitability ?? investment.annualRate,
            maturity: investment.dueDate ? asDate(investment.dueDate) : investment.maturityDate ? asDate(investment.maturityDate) : void 0,
            risk: InvestmentRisk2.LOW,
            liquidity: investmentLiquidity(investment)
          })).filter((investment) => investment.amount > 0)
        };
      }
    };
  }
});

// services/backend/src/modules/banking/service.ts
function buildAuthorizationUrl(connectionId, input) {
  const authUrl = process.env.OPEN_FINANCE_AUTH_URL;
  const clientId = process.env.OPEN_FINANCE_CLIENT_ID;
  const redirectUri = input.redirectUri ?? process.env.OPEN_FINANCE_REDIRECT_URI;
  if (!authUrl || !clientId || !redirectUri) {
    return null;
  }
  const url = new URL(authUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", (input.permissions ?? ["ACCOUNTS_READ", "TRANSACTIONS_READ", "CREDIT_CARDS_READ"]).join(" "));
  url.searchParams.set("state", connectionId);
  return url.toString();
}
var bankingService;
var init_service6 = __esm({
  "services/backend/src/modules/banking/service.ts"() {
    "use strict";
    init_repository6();
    init_pluggy();
    bankingService = {
      listConnections: bankingRepository.listConnections,
      createConnection(userId, input) {
        return bankingRepository.createConnection(userId, input);
      },
      revokeConnection(userId, id) {
        return bankingRepository.revokeConnection(userId, id);
      },
      listAccounts: bankingRepository.listAccounts,
      createAccount(userId, input) {
        return bankingRepository.createAccount(userId, input);
      },
      async createOpenFinanceConsent(userId, input) {
        const connection = await bankingRepository.createConnection(userId, {
          provider: input.provider,
          bankName: input.bankName
        });
        const authorizationUrl = buildAuthorizationUrl(connection.id, input);
        await bankingRepository.updateConnection(connection.id, userId, {
          metadata: {
            integrationReady: Boolean(authorizationUrl),
            permissions: input.permissions ?? ["ACCOUNTS_READ", "TRANSACTIONS_READ", "CREDIT_CARDS_READ"],
            redirectUri: input.redirectUri ?? process.env.OPEN_FINANCE_REDIRECT_URI ?? null
          }
        });
        return {
          connection,
          authorizationUrl,
          integrationReady: Boolean(authorizationUrl),
          message: authorizationUrl ? "Redirecione o usuario para authorizationUrl e importe os dados retornados pelo provedor." : "Configure OPEN_FINANCE_AUTH_URL, OPEN_FINANCE_CLIENT_ID e OPEN_FINANCE_REDIRECT_URI para ativar o fluxo real do provedor."
        };
      },
      importOpenFinanceData(userId, input) {
        return bankingRepository.importOpenFinanceData(userId, input);
      },
      async createPluggyApiKey(input) {
        const apiKey = await pluggyClient.apiKey(input);
        return {
          apiKey,
          message: "API Key da Pluggy gerada com sucesso."
        };
      },
      async createPluggyConnectToken(userId, input) {
        const connection = await bankingRepository.createConnection(userId, {
          provider: "Pluggy",
          bankName: input.bankName ?? "Pluggy"
        });
        const response = await pluggyClient.connectToken(input, userId);
        const connectToken = response.accessToken ?? response.connectToken ?? response.token;
        if (!connectToken) throw new Error("Pluggy: o connect token n\xE3o foi retornado.");
        await bankingRepository.updateConnection(connection.id, userId, {
          metadata: {
            provider: "PLUGGY",
            itemId: input.itemId ?? null,
            clientUserId: input.clientUserId ?? userId,
            connectTokenCreatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
        return {
          connection,
          connectToken,
          accessToken: connectToken,
          expiresIn: response.expiresIn,
          integrationReady: true,
          message: "Connect Token da Pluggy gerado. Use esse token no Pluggy Connect para o usu\xE1rio autorizar o banco."
        };
      },
      async importPluggyItem(userId, input) {
        const payload = await pluggyClient.importPayload(input);
        let bankConnectionId = input.bankConnectionId;
        if (!bankConnectionId) {
          const connection = await bankingRepository.createConnection(userId, {
            provider: "Pluggy",
            bankName: payload.accounts?.[0]?.bankName ?? "Pluggy"
          });
          bankConnectionId = connection.id;
        }
        const result = await bankingRepository.importOpenFinanceData(userId, {
          ...payload,
          bankConnectionId
        });
        await bankingRepository.updateConnection(bankConnectionId, userId, {
          consentId: input.itemId,
          metadata: {
            provider: "PLUGGY",
            itemId: input.itemId,
            lastImportAt: (/* @__PURE__ */ new Date()).toISOString(),
            summary: result
          }
        });
        return {
          bankConnectionId,
          ...result,
          message: `Importa\xE7\xE3o Pluggy conclu\xEDda: ${result.accounts} contas, ${result.transactions} transa\xE7\xF5es, ${result.cards} cart\xF5es e ${result.investments} investimentos.`
        };
      }
    };
  }
});

// services/backend/src/modules/banking/controller.ts
var bankingController;
var init_controller5 = __esm({
  "services/backend/src/modules/banking/controller.ts"() {
    "use strict";
    init_zod();
    init_schema5();
    init_service6();
    bankingController = {
      async listConnections(request, reply) {
        return reply.send(await bankingService.listConnections(request.user.sub));
      },
      async createConnection(request, reply) {
        const body = parseOrReply(bankConnectionSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await bankingService.createConnection(request.user.sub, body));
      },
      async revokeConnection(request, reply) {
        const params = parseOrReply(bankingParamsSchema, request.params, reply);
        if (!params) return;
        return reply.send(await bankingService.revokeConnection(request.user.sub, params.id));
      },
      async listAccounts(request, reply) {
        return reply.send(await bankingService.listAccounts(request.user.sub));
      },
      async createAccount(request, reply) {
        const body = parseOrReply(bankAccountSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await bankingService.createAccount(request.user.sub, body));
      },
      async createOpenFinanceConsent(request, reply) {
        const body = parseOrReply(openFinanceConsentSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await bankingService.createOpenFinanceConsent(request.user.sub, body));
      },
      async importOpenFinanceData(request, reply) {
        const body = parseOrReply(openFinanceImportSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await bankingService.importOpenFinanceData(request.user.sub, body));
      },
      async createPluggyApiKey(request, reply) {
        const body = parseOrReply(pluggyApiKeySchema, request.body, reply);
        if (!body) return;
        return reply.send(await bankingService.createPluggyApiKey(body));
      },
      async createPluggyConnectToken(request, reply) {
        const body = parseOrReply(pluggyConnectTokenSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await bankingService.createPluggyConnectToken(request.user.sub, body));
      },
      async importPluggyItem(request, reply) {
        const body = parseOrReply(pluggyImportSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await bankingService.importPluggyItem(request.user.sub, body));
      }
    };
  }
});

// services/backend/src/modules/banking/routes.ts
async function bankingRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/connections", bankingController.listConnections);
  app.post("/connections", bankingController.createConnection);
  app.patch("/connections/:id/revoke", bankingController.revokeConnection);
  app.post("/open-finance/consent", bankingController.createOpenFinanceConsent);
  app.post("/open-finance/import", bankingController.importOpenFinanceData);
  app.post("/pluggy/api-key", bankingController.createPluggyApiKey);
  app.post("/pluggy/connect-token", bankingController.createPluggyConnectToken);
  app.post("/pluggy/import", bankingController.importPluggyItem);
  app.get("/accounts", bankingController.listAccounts);
  app.post("/accounts", bankingController.createAccount);
}
var init_routes5 = __esm({
  "services/backend/src/modules/banking/routes.ts"() {
    "use strict";
    init_auth();
    init_controller5();
  }
});

// services/backend/src/modules/budgets/schema.ts
import { z as z6 } from "zod";
var budgetSchema, budgetQuerySchema;
var init_schema6 = __esm({
  "services/backend/src/modules/budgets/schema.ts"() {
    "use strict";
    budgetSchema = z6.object({
      profileId: z6.string().uuid().optional(),
      category: z6.string().min(2),
      limit: z6.coerce.number().positive(),
      month: z6.coerce.number().int().min(1).max(12),
      year: z6.coerce.number().int().min(2e3).max(2100),
      alertAt: z6.coerce.number().int().min(1).max(100).optional()
    });
    budgetQuerySchema = z6.object({
      profileId: z6.string().uuid().optional(),
      month: z6.coerce.number().int().min(1).max(12).optional(),
      year: z6.coerce.number().int().min(2e3).max(2100).optional()
    });
  }
});

// services/backend/src/modules/budgets/repository.ts
var budgetRepository;
var init_repository7 = __esm({
  "services/backend/src/modules/budgets/repository.ts"() {
    "use strict";
    init_prisma();
    budgetRepository = {
      list(userId, query) {
        return prisma.budget.findMany({ where: { userId, profileId: query.profileId, month: query.month, year: query.year }, orderBy: { category: "asc" } });
      },
      async upsert(userId, input) {
        const existing = await prisma.budget.findFirst({
          where: { userId, profileId: input.profileId, category: input.category, month: input.month, year: input.year }
        });
        if (existing) {
          return prisma.budget.update({ where: { id: existing.id }, data: input });
        }
        return prisma.budget.create({ data: { userId, ...input } });
      }
    };
  }
});

// services/backend/src/modules/budgets/service.ts
import { TransactionType as TransactionType5 } from "@prisma/client";
var budgetService;
var init_service7 = __esm({
  "services/backend/src/modules/budgets/service.ts"() {
    "use strict";
    init_prisma();
    init_repository7();
    budgetService = {
      list(userId, query) {
        return budgetRepository.list(userId, query);
      },
      upsert(userId, input) {
        return budgetRepository.upsert(userId, input);
      },
      async usage(userId, query) {
        const now = /* @__PURE__ */ new Date();
        const month = query.month ?? now.getMonth() + 1;
        const year = query.year ?? now.getFullYear();
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const [budgets, transactions] = await Promise.all([
          budgetRepository.list(userId, { month, year }),
          prisma.transaction.findMany({ where: { userId, type: TransactionType5.PAYABLE, dueDate: { gte: start, lt: end } } })
        ]);
        return budgets.map((budget) => {
          const spent = transactions.filter((transaction) => transaction.categoryName === budget.category).reduce((total, transaction) => total + Number(transaction.amount), 0);
          const percentage = Number(budget.limit) > 0 ? Math.round(spent / Number(budget.limit) * 100) : 0;
          return { ...budget, spent, percentage, shouldAlert: percentage >= budget.alertAt };
        });
      }
    };
  }
});

// services/backend/src/modules/budgets/controller.ts
var budgetController;
var init_controller6 = __esm({
  "services/backend/src/modules/budgets/controller.ts"() {
    "use strict";
    init_zod();
    init_schema6();
    init_service7();
    budgetController = {
      async list(request, reply) {
        const query = parseOrReply(budgetQuerySchema, request.query, reply);
        if (!query) return;
        return reply.send(await budgetService.list(request.user.sub, query));
      },
      async upsert(request, reply) {
        const body = parseOrReply(budgetSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await budgetService.upsert(request.user.sub, body));
      },
      async usage(request, reply) {
        const query = parseOrReply(budgetQuerySchema, request.query, reply);
        if (!query) return;
        return reply.send(await budgetService.usage(request.user.sub, query));
      }
    };
  }
});

// services/backend/src/modules/budgets/routes.ts
async function budgetRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", budgetController.list);
  app.post("/", budgetController.upsert);
  app.get("/usage", budgetController.usage);
}
var init_routes6 = __esm({
  "services/backend/src/modules/budgets/routes.ts"() {
    "use strict";
    init_auth();
    init_controller6();
  }
});

// services/backend/src/modules/cards/schema.ts
import { CardBrand as CardBrand3 } from "@prisma/client";
import { z as z7 } from "zod";
var cardSchema;
var init_schema7 = __esm({
  "services/backend/src/modules/cards/schema.ts"() {
    "use strict";
    cardSchema = z7.object({
      profileId: z7.string().uuid().optional(),
      bankAccountId: z7.string().uuid().optional(),
      externalId: z7.string().optional(),
      name: z7.string().min(2),
      brand: z7.nativeEnum(CardBrand3).optional(),
      totalLimit: z7.coerce.number().nonnegative().optional(),
      usedLimit: z7.coerce.number().nonnegative().optional(),
      availableLimit: z7.coerce.number().nonnegative().optional(),
      closingDay: z7.coerce.number().int().min(1).max(31).optional(),
      dueDay: z7.coerce.number().int().min(1).max(31).optional(),
      bestPurchaseDay: z7.coerce.number().int().min(1).max(31).optional()
    });
  }
});

// services/backend/src/modules/cards/repository.ts
var cardRepository;
var init_repository8 = __esm({
  "services/backend/src/modules/cards/repository.ts"() {
    "use strict";
    init_prisma();
    cardRepository = {
      list(userId) {
        return prisma.card.findMany({ where: { userId }, include: { invoices: true }, orderBy: { createdAt: "desc" } });
      },
      create(userId, input) {
        const usedLimit = input.usedLimit ?? 0;
        const totalLimit = input.totalLimit ?? 0;
        return prisma.card.create({ data: { userId, ...input, usedLimit, totalLimit, availableLimit: input.availableLimit ?? totalLimit - usedLimit } });
      }
    };
  }
});

// services/backend/src/modules/cards/service.ts
var cardService;
var init_service8 = __esm({
  "services/backend/src/modules/cards/service.ts"() {
    "use strict";
    init_repository8();
    cardService = {
      list: cardRepository.list,
      create(userId, input) {
        return cardRepository.create(userId, input);
      },
      simulatePurchase(amount, installments, monthlyIncome) {
        const monthlyImpact = amount / installments;
        const healthyLimit = monthlyIncome * 0.3;
        return {
          amount,
          installments,
          monthlyImpact,
          healthyLimit,
          isHealthy: monthlyImpact <= healthyLimit,
          message: monthlyImpact > healthyLimit ? `Essa compra adiciona R$ ${monthlyImpact.toFixed(2)} por m\xEAs e pode pressionar sua fatura.` : `Essa compra parece caber no limite saud\xE1vel informado.`
        };
      }
    };
  }
});

// services/backend/src/modules/cards/controller.ts
import { z as z8 } from "zod";
var simulateSchema, cardController;
var init_controller7 = __esm({
  "services/backend/src/modules/cards/controller.ts"() {
    "use strict";
    init_zod();
    init_schema7();
    init_service8();
    simulateSchema = z8.object({
      amount: z8.coerce.number().positive(),
      installments: z8.coerce.number().int().min(1).max(48),
      monthlyIncome: z8.coerce.number().positive()
    });
    cardController = {
      async list(request, reply) {
        return reply.send(await cardService.list(request.user.sub));
      },
      async create(request, reply) {
        const body = parseOrReply(cardSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await cardService.create(request.user.sub, body));
      },
      async simulate(request, reply) {
        const body = parseOrReply(simulateSchema, request.body, reply);
        if (!body) return;
        return reply.send(cardService.simulatePurchase(body.amount, body.installments, body.monthlyIncome));
      }
    };
  }
});

// services/backend/src/modules/cards/routes.ts
async function cardRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", cardController.list);
  app.post("/", cardController.create);
  app.post("/simulate-purchase", cardController.simulate);
}
var init_routes7 = __esm({
  "services/backend/src/modules/cards/routes.ts"() {
    "use strict";
    init_auth();
    init_controller7();
  }
});

// services/backend/src/modules/credit/schema.ts
import { z as z9 } from "zod";
var creditAnalysisSchema;
var init_schema8 = __esm({
  "services/backend/src/modules/credit/schema.ts"() {
    "use strict";
    creditAnalysisSchema = z9.object({
      profileId: z9.string().uuid().optional(),
      requestedAmount: z9.coerce.number().positive().optional(),
      installments: z9.coerce.number().int().min(1).max(96).optional(),
      purpose: z9.string().optional()
    });
  }
});

// services/backend/src/modules/credit/controller.ts
var creditController;
var init_controller8 = __esm({
  "services/backend/src/modules/credit/controller.ts"() {
    "use strict";
    init_zod();
    init_schema8();
    init_service4();
    creditController = {
      async analyze(request, reply) {
        const body = parseOrReply(creditAnalysisSchema, request.body ?? {}, reply);
        if (!body) return;
        return reply.send(await creditService.analyze(request.user.sub, body));
      }
    };
  }
});

// services/backend/src/modules/credit/routes.ts
async function creditRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.post("/analyze", creditController.analyze);
}
var init_routes8 = __esm({
  "services/backend/src/modules/credit/routes.ts"() {
    "use strict";
    init_auth();
    init_controller8();
  }
});

// services/backend/src/modules/dashboard/schema.ts
import { z as z10 } from "zod";
var dashboardQuerySchema;
var init_schema9 = __esm({
  "services/backend/src/modules/dashboard/schema.ts"() {
    "use strict";
    dashboardQuerySchema = z10.object({
      profileId: z10.string().uuid().optional(),
      month: z10.coerce.number().int().min(1).max(12).optional(),
      year: z10.coerce.number().int().min(2e3).max(2100).optional()
    });
  }
});

// services/backend/src/modules/dashboard/repository.ts
import { ProjectStatus, TransactionStatus as TransactionStatus2, TransactionType as TransactionType6 } from "@prisma/client";
var dashboardRepository;
var init_repository9 = __esm({
  "services/backend/src/modules/dashboard/repository.ts"() {
    "use strict";
    init_prisma();
    dashboardRepository = {
      getUser(userId) {
        return prisma.user.findUnique({ where: { id: userId }, select: { salary: true } });
      },
      getTransactions(userId, start, end, profileId) {
        return prisma.transaction.findMany({
          where: { userId, profileId, dueDate: { gte: start, lt: end } }
        });
      },
      getProjects(userId, start, end, profileId) {
        return prisma.project.findMany({
          where: { userId, profileId, soldAt: { gte: start, lt: end } }
        });
      },
      getAccounts(userId) {
        return prisma.bankAccount.findMany({ where: { userId } });
      },
      getCards(userId, profileId) {
        return prisma.card.findMany({ where: { userId, profileId } });
      },
      getGoals(userId, profileId) {
        return prisma.goal.findMany({ where: { userId, profileId } });
      },
      getAlerts(userId) {
        return prisma.alert.findMany({ where: { userId, read: false }, orderBy: { createdAt: "desc" }, take: 5 });
      },
      getPendingCounts(userId, profileId) {
        return Promise.all([
          prisma.transaction.count({ where: { userId, profileId, status: TransactionStatus2.PENDING, type: TransactionType6.PAYABLE } }),
          prisma.transaction.count({ where: { userId, profileId, status: TransactionStatus2.PENDING, type: TransactionType6.RECEIVABLE } }),
          prisma.project.count({ where: { userId, profileId, status: ProjectStatus.PENDING } })
        ]);
      }
    };
  }
});

// services/backend/src/modules/dashboard/service.ts
import { ProjectStatus as ProjectStatus2, TransactionStatus as TransactionStatus3, TransactionType as TransactionType7 } from "@prisma/client";
var money2, sum, dashboardService;
var init_service9 = __esm({
  "services/backend/src/modules/dashboard/service.ts"() {
    "use strict";
    init_repository9();
    money2 = (value) => Number(value ?? 0);
    sum = (items, selector) => items.reduce((total, item) => total + money2(selector(item)), 0);
    dashboardService = {
      async summary(userId, query) {
        const now = /* @__PURE__ */ new Date();
        const month = query.month ?? now.getMonth() + 1;
        const year = query.year ?? now.getFullYear();
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const [user, transactions, projects, pendingCounts, accounts, cards, goals, alerts] = await Promise.all([
          dashboardRepository.getUser(userId),
          dashboardRepository.getTransactions(userId, start, end, query.profileId),
          dashboardRepository.getProjects(userId, start, end, query.profileId),
          dashboardRepository.getPendingCounts(userId, query.profileId),
          dashboardRepository.getAccounts(userId),
          dashboardRepository.getCards(userId, query.profileId),
          dashboardRepository.getGoals(userId, query.profileId),
          dashboardRepository.getAlerts(userId)
        ]);
        const salary = money2(user?.salary);
        const totalToPay = sum(
          transactions.filter((item) => item.type === TransactionType7.PAYABLE && item.status === TransactionStatus3.PENDING),
          (item) => item.amount
        );
        const totalToReceive = sum(
          transactions.filter((item) => item.type === TransactionType7.RECEIVABLE && item.status === TransactionStatus3.PENDING),
          (item) => item.amount
        );
        const totalPaidThisMonth = sum(
          transactions.filter((item) => item.status === TransactionStatus3.PAID),
          (item) => item.amount
        );
        const totalReceivedThisMonth = sum(
          transactions.filter((item) => item.status === TransactionStatus3.RECEIVED),
          (item) => item.amount
        );
        const projectProfit = sum(
          projects.filter((item) => item.status === ProjectStatus2.PAID),
          (item) => item.amount
        );
        const balance = sum(accounts, (item) => item.currentBalance);
        const netWorth = balance + sum(cards, (item) => Number(item.availableLimit) - Number(item.usedLimit)) + sum(goals, (item) => item.currentAmount);
        const cardsUsed = sum(cards, (item) => item.usedLimit);
        const cardsAvailable = sum(cards, (item) => item.availableLimit);
        return {
          month,
          year,
          balance,
          salary,
          netSalary: salary,
          monthlyIncome: totalReceivedThisMonth,
          monthlyExpenses: totalPaidThisMonth + totalToPay,
          netWorth,
          cards: {
            total: cards.length,
            usedLimit: cardsUsed,
            availableLimit: cardsAvailable
          },
          upcomingBills: transactions.filter((item) => item.type === TransactionType7.PAYABLE && item.status === TransactionStatus3.PENDING).slice(0, 5),
          monthlySaving: salary + totalReceivedThisMonth - totalPaidThisMonth - totalToPay,
          monthlyGoal: goals[0] ?? null,
          aiAlerts: alerts,
          totalToPay,
          totalToReceive,
          forecastBalance: salary - totalToPay + totalToReceive,
          expectedBalance: salary - totalToPay + totalToReceive,
          totalReceived: totalReceivedThisMonth,
          totalPaid: totalPaidThisMonth,
          totalReceivedThisMonth,
          totalPaidThisMonth,
          projectProfit,
          monthlyProfit: projectProfit,
          pending: {
            payableTransactions: pendingCounts[0],
            receivableTransactions: pendingCounts[1],
            projects: pendingCounts[2]
          },
          pendingTransactions: pendingCounts[0] + pendingCounts[1]
        };
      }
    };
  }
});

// services/backend/src/modules/dashboard/controller.ts
var dashboardController;
var init_controller9 = __esm({
  "services/backend/src/modules/dashboard/controller.ts"() {
    "use strict";
    init_zod();
    init_schema9();
    init_service9();
    dashboardController = {
      async summary(request, reply) {
        const query = parseOrReply(dashboardQuerySchema, request.query, reply);
        if (!query) return;
        return reply.send(await dashboardService.summary(request.user.sub, query));
      }
    };
  }
});

// services/backend/src/modules/dashboard/routes.ts
async function dashboardRoutes(app) {
  app.get("/", { preHandler: [authMiddleware] }, dashboardController.summary);
}
var init_routes9 = __esm({
  "services/backend/src/modules/dashboard/routes.ts"() {
    "use strict";
    init_auth();
    init_controller9();
  }
});

// services/backend/src/modules/feed/schema.ts
import { z as z11 } from "zod";
var feedQuerySchema;
var init_schema10 = __esm({
  "services/backend/src/modules/feed/schema.ts"() {
    "use strict";
    feedQuerySchema = z11.object({
      profileId: z11.string().uuid().optional(),
      month: z11.coerce.number().int().min(1).max(12).optional(),
      year: z11.coerce.number().int().min(2e3).max(2100).optional()
    });
  }
});

// services/backend/src/modules/feed/repository.ts
import { TransactionType as TransactionType8 } from "@prisma/client";
var feedRepository;
var init_repository10 = __esm({
  "services/backend/src/modules/feed/repository.ts"() {
    "use strict";
    init_prisma();
    feedRepository = {
      getContext(userId, start, end, profileId) {
        return Promise.all([
          prisma.user.findUnique({ where: { id: userId } }),
          prisma.transaction.findMany({ where: { userId, profileId, dueDate: { gte: start, lt: end } } }),
          prisma.card.findMany({ where: { userId, profileId } }),
          prisma.goal.findMany({ where: { userId, profileId }, orderBy: { createdAt: "asc" } }),
          prisma.budget.findMany({ where: { userId, profileId, month: start.getMonth() + 1, year: start.getFullYear() } }),
          prisma.alert.findMany({ where: { userId, read: false }, orderBy: { createdAt: "desc" }, take: 5 })
        ]);
      },
      getIncome(transactions) {
        return transactions.filter((item) => item.type === TransactionType8.RECEIVABLE).reduce((total, item) => total + Number(item.amount), 0);
      },
      getExpenses(transactions) {
        return transactions.filter((item) => item.type === TransactionType8.PAYABLE).reduce((total, item) => total + Number(item.amount), 0);
      }
    };
  }
});

// services/backend/src/modules/feed/service.ts
function scoreFrom(input) {
  let score = 58;
  if (input.salary > 0 && input.expenses <= input.salary * 0.8) score += 14;
  if (input.salary > 0 && input.expenses > input.salary) score -= 18;
  if (input.pending <= 2) score += 8;
  if (input.cardUsage <= 60) score += 10;
  if (input.cardUsage > 80) score -= 14;
  if (input.goalProgress >= 50) score += 10;
  return Math.max(0, Math.min(100, score));
}
var money3, feedService;
var init_service10 = __esm({
  "services/backend/src/modules/feed/service.ts"() {
    "use strict";
    init_repository10();
    money3 = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    feedService = {
      async home(userId, query) {
        const now = /* @__PURE__ */ new Date();
        const month = query.month ?? now.getMonth() + 1;
        const year = query.year ?? now.getFullYear();
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        const daysLeft = Math.max(1, Math.ceil((end.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24)));
        const [user, transactions, cards, goals, budgets, alerts] = await feedRepository.getContext(userId, start, end, query.profileId);
        const salary = Number(user?.salary ?? 0);
        const income = feedRepository.getIncome(transactions);
        const expenses = feedRepository.getExpenses(transactions);
        const freeCash = salary + income - expenses;
        const safeDailySpend = Math.max(0, freeCash / daysLeft);
        const totalCardLimit = cards.reduce((total, card) => total + Number(card.totalLimit), 0);
        const usedCardLimit = cards.reduce((total, card) => total + Number(card.usedLimit), 0);
        const cardUsage = totalCardLimit > 0 ? Math.round(usedCardLimit / totalCardLimit * 100) : 0;
        const primaryGoal = goals[0];
        const goalProgress = primaryGoal ? Math.round(Number(primaryGoal.currentAmount) / Number(primaryGoal.targetAmount) * 100) : 0;
        const score = scoreFrom({ salary, expenses, pending: alerts.length, cardUsage, goalProgress });
        const delivery = transactions.filter((item) => `${item.title} ${item.categoryName ?? ""} ${item.subcategory ?? ""}`.toLowerCase().includes("delivery") || item.title.toLowerCase().includes("ifood")).reduce((total, item) => total + Number(item.amount), 0);
        const cardsFeed = [
          {
            id: "score",
            type: "score",
            tone: score >= 75 ? "good" : score >= 55 ? "warning" : "danger",
            title: `Score financeiro ${score}/100`,
            message: score >= 75 ? "Seu m\xEAs est\xE1 sob controle." : "H\xE1 pontos de aten\xE7\xE3o para proteger seu caixa.",
            value: `${score}`,
            action: "Ver diagnostico"
          },
          {
            id: "safe-spend",
            type: "opportunity",
            tone: safeDailySpend > 0 ? "good" : "danger",
            title: `Voc\xEA pode gastar ${money3(safeDailySpend)} por dia`,
            message: "Estimativa segura at\xE9 o fim do m\xEAs considerando renda, entradas e despesas cadastradas.",
            value: money3(safeDailySpend),
            action: "Perguntar para IA"
          }
        ];
        if (cardUsage > 0) {
          cardsFeed.push({
            id: "card-usage",
            type: "card",
            tone: cardUsage >= 80 ? "danger" : cardUsage >= 65 ? "warning" : "neutral",
            title: `Seu cart\xE3o chegou a ${cardUsage}% do limite`,
            message: "Acompanhe o ritmo antes do fechamento para evitar uma fatura pesada.",
            value: `${cardUsage}%`,
            action: "Simular compra"
          });
        }
        if (freeCash > 0) {
          cardsFeed.push({
            id: "invest",
            type: "opportunity",
            tone: "good",
            title: `Voc\xEA pode investir ${money3(Math.floor(freeCash * 0.3))} este m\xEAs`,
            message: "Sugest\xE3o educativa: priorize reserva de emerg\xEAncia antes de risco maior.",
            value: money3(Math.floor(freeCash * 0.3)),
            action: "Criar meta"
          });
        }
        if (delivery > 0) {
          cardsFeed.push({
            id: "delivery",
            type: "spending",
            tone: "warning",
            title: `Delivery soma ${money3(delivery)} no m\xEAs`,
            message: "Se reduzir esse bloco, a sobra pode virar meta ou investimento.",
            value: money3(delivery),
            action: "Analisar categoria"
          });
        }
        if (primaryGoal) {
          cardsFeed.push({
            id: "goal",
            type: "goal",
            tone: goalProgress >= 70 ? "good" : "neutral",
            title: `${primaryGoal.title} est\xE1 em ${goalProgress}%`,
            message: `Voc\xEA acumulou ${money3(Number(primaryGoal.currentAmount))} de ${money3(Number(primaryGoal.targetAmount))}.`,
            value: `${goalProgress}%`,
            action: "Atualizar meta"
          });
        }
        budgets.forEach((budget) => {
          const spent = transactions.filter((transaction) => transaction.categoryName === budget.category).reduce((total, transaction) => total + Number(transaction.amount), 0);
          const percentage = Number(budget.limit) > 0 ? Math.round(spent / Number(budget.limit) * 100) : 0;
          if (percentage >= budget.alertAt) {
            cardsFeed.push({
              id: `budget-${budget.id}`,
              type: "alert",
              tone: percentage >= 100 ? "danger" : "warning",
              title: `${budget.category} j\xE1 usou ${percentage}% do or\xE7amento`,
              message: `Limite de ${money3(Number(budget.limit))}; gasto atual ${money3(spent)}.`,
              value: `${percentage}%`,
              action: "Ajustar gastos"
            });
          }
        });
        alerts.forEach((alert) => {
          cardsFeed.push({
            id: `alert-${alert.id}`,
            type: "alert",
            tone: alert.severity === "HIGH" ? "danger" : alert.severity === "MEDIUM" ? "warning" : "neutral",
            title: alert.title,
            message: alert.message,
            action: "Marcar como lido"
          });
        });
        return {
          month,
          year,
          score,
          safeDailySpend,
          cards: cardsFeed,
          modeSuggestions: ["Viagem", "Fam\xEDlia", "Festa", "Aut\xF4nomo"],
          plan: {
            tier: "GR\xC1TIS",
            premiumPitch: "Estrutura premium gratuita com IA avan\xE7ada, previs\xF5es, score completo e bancos ilimitados."
          }
        };
      }
    };
  }
});

// services/backend/src/modules/feed/controller.ts
var feedController;
var init_controller10 = __esm({
  "services/backend/src/modules/feed/controller.ts"() {
    "use strict";
    init_zod();
    init_schema10();
    init_service10();
    feedController = {
      async home(request, reply) {
        const query = parseOrReply(feedQuerySchema, request.query, reply);
        if (!query) return;
        return reply.send(await feedService.home(request.user.sub, query));
      }
    };
  }
});

// services/backend/src/modules/feed/routes.ts
async function feedRoutes(app) {
  app.get("/", { preHandler: [authMiddleware] }, feedController.home);
}
var init_routes10 = __esm({
  "services/backend/src/modules/feed/routes.ts"() {
    "use strict";
    init_auth();
    init_controller10();
  }
});

// services/backend/src/modules/goals/schema.ts
import { z as z12 } from "zod";
var goalSchema;
var init_schema11 = __esm({
  "services/backend/src/modules/goals/schema.ts"() {
    "use strict";
    goalSchema = z12.object({
      profileId: z12.string().uuid().optional(),
      title: z12.string().min(2),
      targetAmount: z12.coerce.number().positive(),
      currentAmount: z12.coerce.number().nonnegative().optional(),
      deadline: z12.coerce.date().optional()
    });
  }
});

// services/backend/src/modules/goals/repository.ts
var goalRepository;
var init_repository11 = __esm({
  "services/backend/src/modules/goals/repository.ts"() {
    "use strict";
    init_prisma();
    goalRepository = {
      list(userId) {
        return prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      },
      create(userId, input) {
        const monthlyTarget = input.deadline ? Math.max((input.targetAmount - (input.currentAmount ?? 0)) / Math.max(1, Math.ceil((input.deadline.getTime() - Date.now()) / (1e3 * 60 * 60 * 24 * 30))), 0) : void 0;
        return prisma.goal.create({ data: { userId, ...input, monthlyTarget } });
      }
    };
  }
});

// services/backend/src/modules/goals/service.ts
var goalService;
var init_service11 = __esm({
  "services/backend/src/modules/goals/service.ts"() {
    "use strict";
    init_repository11();
    goalService = {
      list: goalRepository.list,
      create(userId, input) {
        return goalRepository.create(userId, input);
      }
    };
  }
});

// services/backend/src/modules/goals/controller.ts
var goalController;
var init_controller11 = __esm({
  "services/backend/src/modules/goals/controller.ts"() {
    "use strict";
    init_zod();
    init_schema11();
    init_service11();
    goalController = {
      async list(request, reply) {
        return reply.send(await goalService.list(request.user.sub));
      },
      async create(request, reply) {
        const body = parseOrReply(goalSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await goalService.create(request.user.sub, body));
      }
    };
  }
});

// services/backend/src/modules/goals/routes.ts
async function goalRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", goalController.list);
  app.post("/", goalController.create);
}
var init_routes11 = __esm({
  "services/backend/src/modules/goals/routes.ts"() {
    "use strict";
    init_auth();
    init_controller11();
  }
});

// services/backend/src/modules/investments/schema.ts
import { InvestmentLiquidity as InvestmentLiquidity3, InvestmentRisk as InvestmentRisk3, InvestmentType as InvestmentType3 } from "@prisma/client";
import { z as z13 } from "zod";
var investmentSchema;
var init_schema12 = __esm({
  "services/backend/src/modules/investments/schema.ts"() {
    "use strict";
    investmentSchema = z13.object({
      profileId: z13.string().uuid().optional(),
      externalId: z13.string().optional(),
      institution: z13.string().min(2),
      product: z13.string().min(2),
      type: z13.nativeEnum(InvestmentType3),
      amount: z13.coerce.number().positive(),
      profitability: z13.string().optional(),
      maturity: z13.coerce.date().optional(),
      risk: z13.nativeEnum(InvestmentRisk3).optional(),
      liquidity: z13.nativeEnum(InvestmentLiquidity3).optional()
    });
  }
});

// services/backend/src/modules/investments/repository.ts
var investmentRepository;
var init_repository12 = __esm({
  "services/backend/src/modules/investments/repository.ts"() {
    "use strict";
    init_prisma();
    investmentRepository = {
      list(userId) {
        return prisma.investment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      },
      create(userId, input) {
        return prisma.investment.create({ data: { userId, ...input } });
      }
    };
  }
});

// services/backend/src/modules/investments/service.ts
import { InvestmentRisk as InvestmentRisk4 } from "@prisma/client";
var investmentService;
var init_service12 = __esm({
  "services/backend/src/modules/investments/service.ts"() {
    "use strict";
    init_repository12();
    investmentService = {
      list: investmentRepository.list,
      create(userId, input) {
        return investmentRepository.create(userId, input);
      },
      async summary(userId) {
        const investments = await investmentRepository.list(userId);
        const total = investments.reduce((sum2, item) => sum2 + Number(item.amount), 0);
        const highRisk = investments.filter((item) => item.risk === InvestmentRisk4.HIGH).reduce((sum2, item) => sum2 + Number(item.amount), 0);
        return {
          total,
          count: investments.length,
          highRiskExposure: total > 0 ? Math.round(highRisk / total * 100) : 0,
          educationalNote: "Sugestoes de investimento sao educativas; recomendacao personalizada pode exigir regras regulatorias."
        };
      }
    };
  }
});

// services/backend/src/modules/investments/controller.ts
var investmentController;
var init_controller12 = __esm({
  "services/backend/src/modules/investments/controller.ts"() {
    "use strict";
    init_zod();
    init_schema12();
    init_service12();
    investmentController = {
      async list(request, reply) {
        return reply.send(await investmentService.list(request.user.sub));
      },
      async create(request, reply) {
        const body = parseOrReply(investmentSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await investmentService.create(request.user.sub, body));
      },
      async summary(request, reply) {
        return reply.send(await investmentService.summary(request.user.sub));
      }
    };
  }
});

// services/backend/src/modules/investments/routes.ts
async function investmentRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", investmentController.list);
  app.post("/", investmentController.create);
  app.get("/summary", investmentController.summary);
}
var init_routes12 = __esm({
  "services/backend/src/modules/investments/routes.ts"() {
    "use strict";
    init_auth();
    init_controller12();
  }
});

// services/backend/src/modules/news/schema.ts
import { NewsCategory } from "@prisma/client";
import { z as z14 } from "zod";
var createNewsSchema, newsParamsSchema, updateNewsSchema;
var init_schema13 = __esm({
  "services/backend/src/modules/news/schema.ts"() {
    "use strict";
    createNewsSchema = z14.object({
      title: z14.string().min(2),
      summary: z14.string().optional(),
      url: z14.string().url().optional(),
      source: z14.string().optional(),
      category: z14.nativeEnum(NewsCategory).optional(),
      relevance: z14.coerce.number().int().min(0).max(100).optional(),
      isRelevant: z14.boolean().optional(),
      publishedAt: z14.coerce.date().optional()
    });
    newsParamsSchema = z14.object({ id: z14.string().uuid() });
    updateNewsSchema = createNewsSchema.partial();
  }
});

// services/backend/src/modules/news/repository.ts
var newsRepository;
var init_repository13 = __esm({
  "services/backend/src/modules/news/repository.ts"() {
    "use strict";
    init_prisma();
    newsRepository = {
      list(userId) {
        return prisma.newsItem.findMany({
          where: { OR: [{ userId }, { userId: null }] },
          orderBy: { createdAt: "desc" }
        });
      },
      create(userId, data) {
        return prisma.newsItem.create({ data: { ...data, userId } });
      },
      findById(userId, id) {
        return prisma.newsItem.findFirst({ where: { id, OR: [{ userId }, { userId: null }] } });
      },
      update(userId, id, data) {
        return prisma.newsItem.update({ where: { id }, data: { ...data, userId } });
      }
    };
  }
});

// services/backend/src/modules/news/service.ts
async function ensureNews(userId, id) {
  const news = await newsRepository.findById(userId, id);
  if (!news) throw new Error("NEWS_NOT_FOUND");
  return news;
}
var newsService;
var init_service13 = __esm({
  "services/backend/src/modules/news/service.ts"() {
    "use strict";
    init_repository13();
    newsService = {
      list(userId) {
        return newsRepository.list(userId);
      },
      create(userId, input) {
        return newsRepository.create(userId, input);
      },
      async update(userId, id, input) {
        await ensureNews(userId, id);
        return newsRepository.update(userId, id, input);
      },
      async markRelevant(userId, id) {
        await ensureNews(userId, id);
        return newsRepository.update(userId, id, { isRelevant: true });
      }
    };
  }
});

// services/backend/src/modules/news/controller.ts
function handleNewsError(error, reply) {
  if (error.message === "NEWS_NOT_FOUND") {
    return reply.status(404).send({ message: "Not\xEDcia n\xE3o encontrada" });
  }
  throw error;
}
var newsController;
var init_controller13 = __esm({
  "services/backend/src/modules/news/controller.ts"() {
    "use strict";
    init_zod();
    init_schema13();
    init_service13();
    newsController = {
      async list(request, reply) {
        return reply.send(await newsService.list(request.user.sub));
      },
      async create(request, reply) {
        const body = parseOrReply(createNewsSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await newsService.create(request.user.sub, body));
      },
      async update(request, reply) {
        const params = parseOrReply(newsParamsSchema, request.params, reply);
        const body = parseOrReply(updateNewsSchema, request.body, reply);
        if (!params || !body) return;
        try {
          return reply.send(await newsService.update(request.user.sub, params.id, body));
        } catch (error) {
          return handleNewsError(error, reply);
        }
      },
      async markRelevant(request, reply) {
        const params = parseOrReply(newsParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await newsService.markRelevant(request.user.sub, params.id));
        } catch (error) {
          return handleNewsError(error, reply);
        }
      }
    };
  }
});

// services/backend/src/modules/news/routes.ts
async function newsRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", newsController.list);
  app.post("/", newsController.create);
  app.put("/:id", newsController.update);
  app.patch("/:id/relevant", newsController.markRelevant);
}
var init_routes13 = __esm({
  "services/backend/src/modules/news/routes.ts"() {
    "use strict";
    init_auth();
    init_controller13();
  }
});

// services/backend/src/modules/notifications/schema.ts
import { z as z15 } from "zod";
var notificationParamsSchema;
var init_schema14 = __esm({
  "services/backend/src/modules/notifications/schema.ts"() {
    "use strict";
    notificationParamsSchema = z15.object({ id: z15.string().uuid() });
  }
});

// services/backend/src/modules/notifications/repository.ts
var notificationRepository;
var init_repository14 = __esm({
  "services/backend/src/modules/notifications/repository.ts"() {
    "use strict";
    init_prisma();
    notificationRepository = {
      list(userId) {
        return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
      },
      async markAsRead(userId, id) {
        const notification = await prisma.notification.findFirst({ where: { id, userId } });
        if (!notification) throw new Error("NOTIFICATION_NOT_FOUND");
        return prisma.notification.update({ where: { id }, data: { read: true, readAt: /* @__PURE__ */ new Date() } });
      }
    };
  }
});

// services/backend/src/modules/notifications/service.ts
var notificationService;
var init_service14 = __esm({
  "services/backend/src/modules/notifications/service.ts"() {
    "use strict";
    init_repository14();
    notificationService = {
      list(userId) {
        return notificationRepository.list(userId);
      },
      read(userId, id) {
        return notificationRepository.markAsRead(userId, id);
      }
    };
  }
});

// services/backend/src/modules/notifications/controller.ts
var notificationController;
var init_controller14 = __esm({
  "services/backend/src/modules/notifications/controller.ts"() {
    "use strict";
    init_zod();
    init_schema14();
    init_service14();
    notificationController = {
      async list(request, reply) {
        return reply.send(await notificationService.list(request.user.sub));
      },
      async read(request, reply) {
        const params = parseOrReply(notificationParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await notificationService.read(request.user.sub, params.id));
        } catch (error) {
          if (error.message === "NOTIFICATION_NOT_FOUND") {
            return reply.status(404).send({ message: "Notifica\xE7\xE3o n\xE3o encontrada" });
          }
          throw error;
        }
      }
    };
  }
});

// services/backend/src/modules/notifications/routes.ts
async function notificationRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", notificationController.list);
  app.patch("/:id/read", notificationController.read);
}
var init_routes14 = __esm({
  "services/backend/src/modules/notifications/routes.ts"() {
    "use strict";
    init_auth();
    init_controller14();
  }
});

// services/backend/src/modules/profiles/schema.ts
import { FinancialProfileType as FinancialProfileType2 } from "@prisma/client";
import { z as z16 } from "zod";
var profileSchema, profileParamsSchema;
var init_schema15 = __esm({
  "services/backend/src/modules/profiles/schema.ts"() {
    "use strict";
    profileSchema = z16.object({
      name: z16.string().min(2),
      type: z16.nativeEnum(FinancialProfileType2),
      document: z16.string().optional(),
      color: z16.string().optional()
    });
    profileParamsSchema = z16.object({
      id: z16.string().uuid()
    });
  }
});

// services/backend/src/modules/profiles/repository.ts
import { FinancialProfileType as FinancialProfileType3 } from "@prisma/client";
var profileRepository;
var init_repository15 = __esm({
  "services/backend/src/modules/profiles/repository.ts"() {
    "use strict";
    init_prisma();
    profileRepository = {
      list(userId) {
        return prisma.financialProfile.findMany({ where: { userId }, orderBy: [{ type: "asc" }, { createdAt: "asc" }] });
      },
      create(userId, input) {
        return prisma.financialProfile.create({ data: { userId, ...input } });
      },
      async ensureDefaults(userId) {
        const profiles = await this.list(userId);
        const hasPersonal = profiles.some((profile) => profile.type === FinancialProfileType3.PERSONAL);
        const hasBusiness = profiles.some((profile) => profile.type === FinancialProfileType3.BUSINESS);
        if (!hasPersonal) {
          await this.create(userId, { name: "Pessoa fisica", type: FinancialProfileType3.PERSONAL, color: "#31f3b7" });
        }
        if (!hasBusiness) {
          await this.create(userId, { name: "Pessoa juridica", type: FinancialProfileType3.BUSINESS, color: "#62a8ff" });
        }
        return this.list(userId);
      }
    };
  }
});

// services/backend/src/modules/profiles/service.ts
var profileService;
var init_service15 = __esm({
  "services/backend/src/modules/profiles/service.ts"() {
    "use strict";
    init_repository15();
    profileService = {
      list(userId) {
        return profileRepository.ensureDefaults(userId);
      },
      create(userId, input) {
        return profileRepository.create(userId, input);
      }
    };
  }
});

// services/backend/src/modules/profiles/controller.ts
var profileController;
var init_controller15 = __esm({
  "services/backend/src/modules/profiles/controller.ts"() {
    "use strict";
    init_zod();
    init_schema15();
    init_service15();
    profileController = {
      async list(request, reply) {
        return reply.send(await profileService.list(request.user.sub));
      },
      async create(request, reply) {
        const body = parseOrReply(profileSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await profileService.create(request.user.sub, body));
      }
    };
  }
});

// services/backend/src/modules/profiles/routes.ts
async function profileRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.get("/", profileController.list);
  app.post("/", profileController.create);
}
var init_routes15 = __esm({
  "services/backend/src/modules/profiles/routes.ts"() {
    "use strict";
    init_auth();
    init_controller15();
  }
});

// services/backend/src/modules/projects/schema.ts
import { ProjectCategory, ProjectStatus as ProjectStatus3 } from "@prisma/client";
import { z as z17 } from "zod";
var projectParamsSchema, projectBaseSchema, createProjectSchema, updateProjectSchema;
var init_schema16 = __esm({
  "services/backend/src/modules/projects/schema.ts"() {
    "use strict";
    projectParamsSchema = z17.object({ id: z17.string().uuid() });
    projectBaseSchema = z17.object({
      title: z17.string().min(2).optional(),
      productName: z17.string().min(2).optional(),
      client: z17.string().min(2),
      category: z17.nativeEnum(ProjectCategory),
      amount: z17.coerce.number().positive().optional(),
      returnValue: z17.coerce.number().positive().optional(),
      status: z17.nativeEnum(ProjectStatus3).optional(),
      soldAt: z17.coerce.date(),
      paidAt: z17.coerce.date().optional(),
      notes: z17.string().optional()
    });
    createProjectSchema = projectBaseSchema.refine((data) => data.title || data.productName, { message: "O t\xEDtulo \xE9 obrigat\xF3rio", path: ["title"] }).refine((data) => data.amount || data.returnValue, { message: "O valor \xE9 obrigat\xF3rio", path: ["amount"] });
    updateProjectSchema = projectBaseSchema.partial();
  }
});

// services/backend/src/websocket/socket.ts
import { Server } from "socket.io";
function initSocket(app) {
  app.addHook("onReady", async () => {
    io = new Server(app.server, {
      cors: { origin: "*" }
    });
  });
}
function emitEvent(event, payload) {
  io?.emit(event, payload);
}
var io, setupWebsocket;
var init_socket = __esm({
  "services/backend/src/websocket/socket.ts"() {
    "use strict";
    io = null;
    setupWebsocket = initSocket;
  }
});

// services/backend/src/modules/projects/repository.ts
import { ProjectStatus as ProjectStatus4 } from "@prisma/client";
var projectRepository;
var init_repository16 = __esm({
  "services/backend/src/modules/projects/repository.ts"() {
    "use strict";
    init_prisma();
    projectRepository = {
      create(data) {
        return prisma.project.create({ data });
      },
      findMany(userId) {
        return prisma.project.findMany({ where: { userId }, orderBy: { soldAt: "desc" } });
      },
      findManyByPeriod(userId, start, end) {
        return prisma.project.findMany({
          where: { userId, soldAt: { gte: start, lt: end } },
          orderBy: { soldAt: "desc" }
        });
      },
      findById(userId, id) {
        return prisma.project.findFirst({ where: { id, userId } });
      },
      update(id, data) {
        return prisma.project.update({ where: { id }, data });
      },
      delete(id) {
        return prisma.project.delete({ where: { id } });
      },
      markPaid(id) {
        return prisma.project.update({
          where: { id },
          data: { status: ProjectStatus4.PAID, paidAt: /* @__PURE__ */ new Date() }
        });
      }
    };
  }
});

// services/backend/src/modules/projects/service.ts
import { NotificationType, ProjectStatus as ProjectStatus5 } from "@prisma/client";
async function ensureProject(userId, id) {
  const project = await projectRepository.findById(userId, id);
  if (!project) throw new Error("PROJECT_NOT_FOUND");
  return project;
}
var projectService;
var init_service16 = __esm({
  "services/backend/src/modules/projects/service.ts"() {
    "use strict";
    init_prisma();
    init_socket();
    init_repository16();
    projectService = {
      async create(userId, input) {
        const { productName: _productName, returnValue: _returnValue, ...data } = input;
        const project = await projectRepository.create({
          ...data,
          title: input.title ?? input.productName ?? "",
          amount: input.amount ?? input.returnValue ?? 0,
          userId
        });
        emitEvent("project:created", project);
        emitEvent("dashboard:updated", { userId });
        return project;
      },
      list(userId) {
        return projectRepository.findMany(userId);
      },
      async dashboard(userId) {
        const now = /* @__PURE__ */ new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const projects = await projectRepository.findManyByPeriod(userId, start, end);
        const totalPending = projects.filter((project) => project.status === ProjectStatus5.PENDING).reduce((total, project) => total + Number(project.amount), 0);
        const paidProjects = projects.filter((project) => project.status === ProjectStatus5.PAID);
        const totalReceived = paidProjects.reduce((total, project) => total + Number(project.amount), 0);
        const biggestSale = projects.reduce((biggest, project) => {
          if (!biggest || Number(project.amount) > Number(biggest.amount)) return project;
          return biggest;
        }, null);
        const salesByCategory = projects.reduce((totals, project) => {
          totals[project.category] = (totals[project.category] ?? 0) + Number(project.amount);
          return totals;
        }, {});
        return {
          totalPending,
          totalReceived,
          monthlyProfit: totalReceived,
          biggestSale,
          pendingClients: projects.filter((project) => project.status === ProjectStatus5.PENDING).map((project) => ({ id: project.id, client: project.client, title: project.title, value: Number(project.amount) })),
          salesByCategory
        };
      },
      get(userId, id) {
        return ensureProject(userId, id);
      },
      async update(userId, id, input) {
        await ensureProject(userId, id);
        const { productName: _productName, returnValue: _returnValue, ...data } = input;
        const project = await projectRepository.update(id, {
          ...data,
          ...input.productName && !input.title ? { title: input.productName } : {},
          ...input.returnValue && !input.amount ? { amount: input.returnValue } : {}
        });
        emitEvent("project:updated", project);
        emitEvent("dashboard:updated", { userId });
        return project;
      },
      async delete(userId, id) {
        await ensureProject(userId, id);
        await projectRepository.delete(id);
        emitEvent("dashboard:updated", { userId });
        return { deleted: true };
      },
      async pay(userId, id) {
        const current = await ensureProject(userId, id);
        const project = await projectRepository.markPaid(id);
        await prisma.notification.create({
          data: {
            userId,
            type: NotificationType.SUCCESS,
            title: "Projeto pago",
            message: `${current.title} foi marcado como pago.`
          }
        });
        emitEvent("project:paid", project);
        emitEvent("dashboard:updated", { userId });
        return project;
      }
    };
  }
});

// services/backend/src/modules/projects/controller.ts
function handleProjectError(error, reply) {
  if (error.message === "PROJECT_NOT_FOUND") {
    return reply.status(404).send({ message: "Projeto n\xE3o encontrado" });
  }
  throw error;
}
var projectController;
var init_controller16 = __esm({
  "services/backend/src/modules/projects/controller.ts"() {
    "use strict";
    init_zod();
    init_schema16();
    init_service16();
    projectController = {
      async create(request, reply) {
        const body = parseOrReply(createProjectSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await projectService.create(request.user.sub, body));
      },
      async list(request, reply) {
        return reply.send(await projectService.list(request.user.sub));
      },
      async dashboard(request, reply) {
        return reply.send(await projectService.dashboard(request.user.sub));
      },
      async get(request, reply) {
        const params = parseOrReply(projectParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await projectService.get(request.user.sub, params.id));
        } catch (error) {
          return handleProjectError(error, reply);
        }
      },
      async update(request, reply) {
        const params = parseOrReply(projectParamsSchema, request.params, reply);
        const body = parseOrReply(updateProjectSchema, request.body, reply);
        if (!params || !body) return;
        try {
          return reply.send(await projectService.update(request.user.sub, params.id, body));
        } catch (error) {
          return handleProjectError(error, reply);
        }
      },
      async delete(request, reply) {
        const params = parseOrReply(projectParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await projectService.delete(request.user.sub, params.id));
        } catch (error) {
          return handleProjectError(error, reply);
        }
      },
      async pay(request, reply) {
        const params = parseOrReply(projectParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await projectService.pay(request.user.sub, params.id));
        } catch (error) {
          return handleProjectError(error, reply);
        }
      }
    };
  }
});

// services/backend/src/modules/projects/routes.ts
async function projectRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.post("/", projectController.create);
  app.get("/", projectController.list);
  app.get("/dashboard", projectController.dashboard);
  app.get("/:id", projectController.get);
  app.put("/:id", projectController.update);
  app.delete("/:id", projectController.delete);
  app.patch("/:id/pay", projectController.pay);
}
var init_routes16 = __esm({
  "services/backend/src/modules/projects/routes.ts"() {
    "use strict";
    init_auth();
    init_controller16();
  }
});

// services/backend/src/modules/transactions/schema.ts
import { TransactionDirection as TransactionDirection3, TransactionForm as TransactionForm3, TransactionStatus as TransactionStatus4, TransactionType as TransactionType9 } from "@prisma/client";
import { z as z18 } from "zod";
var transactionParamsSchema, transactionQuerySchema, transactionBaseSchema, createTransactionSchema, updateTransactionSchema;
var init_schema17 = __esm({
  "services/backend/src/modules/transactions/schema.ts"() {
    "use strict";
    transactionParamsSchema = z18.object({ id: z18.string().uuid() });
    transactionQuerySchema = z18.object({
      profileId: z18.string().uuid().optional(),
      type: z18.nativeEnum(TransactionType9).optional(),
      status: z18.nativeEnum(TransactionStatus4).optional(),
      category: z18.string().optional(),
      month: z18.coerce.number().int().min(1).max(12).optional(),
      year: z18.coerce.number().int().min(2e3).max(2100).optional()
    });
    transactionBaseSchema = z18.object({
      title: z18.string().min(2).optional(),
      name: z18.string().min(2).optional(),
      profileId: z18.string().uuid().optional(),
      bankAccountId: z18.string().uuid().optional(),
      externalId: z18.string().optional(),
      amount: z18.coerce.number().positive(),
      type: z18.nativeEnum(TransactionType9),
      direction: z18.nativeEnum(TransactionDirection3).optional(),
      form: z18.nativeEnum(TransactionForm3).optional(),
      status: z18.nativeEnum(TransactionStatus4).optional(),
      originalDescription: z18.string().optional(),
      categoryName: z18.string().optional(),
      subcategory: z18.string().optional(),
      merchant: z18.string().optional(),
      recurrence: z18.string().optional(),
      tag: z18.string().optional(),
      dueDate: z18.coerce.date(),
      paidAt: z18.coerce.date().optional(),
      notes: z18.string().optional()
    });
    createTransactionSchema = transactionBaseSchema.refine((data) => data.title || data.name, {
      message: "O t\xEDtulo \xE9 obrigat\xF3rio",
      path: ["title"]
    });
    updateTransactionSchema = transactionBaseSchema.partial();
  }
});

// services/backend/src/modules/transactions/repository.ts
function buildWhere(userId, filters) {
  const where = { userId };
  if (filters?.profileId) where.profileId = filters.profileId;
  if (filters?.type) where.type = filters.type;
  if (filters?.status) where.status = filters.status;
  if (filters?.category) where.categoryName = { equals: filters.category, mode: "insensitive" };
  if (filters?.month && filters.year) {
    const start = new Date(filters.year, filters.month - 1, 1);
    const end = new Date(filters.year, filters.month, 1);
    where.dueDate = { gte: start, lt: end };
  }
  return where;
}
var transactionRepository;
var init_repository17 = __esm({
  "services/backend/src/modules/transactions/repository.ts"() {
    "use strict";
    init_prisma();
    transactionRepository = {
      create(data) {
        return prisma.transaction.create({ data });
      },
      findMany(userId, filters) {
        return prisma.transaction.findMany({
          where: buildWhere(userId, filters),
          orderBy: { dueDate: "asc" }
        });
      },
      findById(userId, id) {
        return prisma.transaction.findFirst({ where: { id, userId } });
      },
      update(id, data) {
        return prisma.transaction.update({ where: { id }, data });
      },
      delete(id) {
        return prisma.transaction.delete({ where: { id } });
      },
      mark(id, status) {
        return prisma.transaction.update({
          where: { id },
          data: { status, paidAt: /* @__PURE__ */ new Date() }
        });
      }
    };
  }
});

// services/backend/src/modules/transactions/service.ts
import { NotificationType as NotificationType2, TransactionDirection as TransactionDirection4, TransactionStatus as TransactionStatus5, TransactionType as TransactionType10 } from "@prisma/client";
async function ensureTransaction(userId, id) {
  const transaction = await transactionRepository.findById(userId, id);
  if (!transaction) throw new Error("TRANSACTION_NOT_FOUND");
  return transaction;
}
function isTomorrow(date) {
  const tomorrow = /* @__PURE__ */ new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate();
}
async function createTransactionNotifications(userId, input) {
  const notifications = [];
  if (input.amount !== void 0 && Number(input.amount) >= 1e3) {
    notifications.push({
      userId,
      type: NotificationType2.WARNING,
      title: "Valor alto registrado",
      message: `Uma movimenta\xE7\xE3o de R$ ${Number(input.amount).toFixed(2)} foi registrada.`
    });
  }
  if (input.type === TransactionType10.PAYABLE && (!input.status || input.status === TransactionStatus5.PENDING) && input.dueDate && isTomorrow(input.dueDate)) {
    notifications.push({
      userId,
      type: NotificationType2.WARNING,
      title: "Conta vence amanh\xE3",
      message: `${input.title ?? input.name ?? "Uma conta"} vence amanh\xE3.`
    });
  }
  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }
}
function classifyTransaction(title) {
  const value = title.toLowerCase();
  if (value.includes("ifood") || value.includes("mercado") || value.includes("restaurante")) return { categoryName: "Alimenta\xE7\xE3o", subcategory: value.includes("ifood") ? "Delivery" : void 0 };
  if (value.includes("uber") || value.includes("99") || value.includes("metro")) return { categoryName: "Transporte", subcategory: "Aplicativo" };
  if (value.includes("netflix") || value.includes("spotify") || value.includes("amazon") || value.includes("icloud")) return { categoryName: "Assinaturas" };
  if (value.includes("drogasil") || value.includes("farmacia")) return { categoryName: "Sa\xFAde", subcategory: "Farm\xE1cia" };
  if (value.includes("salario") || value.includes("pix recebido")) return { categoryName: "Renda" };
  return { categoryName: void 0, subcategory: void 0 };
}
var transactionService;
var init_service17 = __esm({
  "services/backend/src/modules/transactions/service.ts"() {
    "use strict";
    init_prisma();
    init_socket();
    init_repository17();
    transactionService = {
      async create(userId, input) {
        const { name: _name, ...data } = input;
        const title = input.title ?? input.name ?? "";
        const classified = classifyTransaction(title);
        const transaction = await transactionRepository.create({
          ...data,
          title,
          categoryName: input.categoryName ?? classified.categoryName,
          subcategory: input.subcategory ?? classified.subcategory,
          direction: input.direction ?? (input.type === TransactionType10.RECEIVABLE ? TransactionDirection4.INCOME : TransactionDirection4.EXPENSE),
          userId
        });
        await createTransactionNotifications(userId, input);
        emitEvent("transaction:created", transaction);
        emitEvent("dashboard:updated", { userId });
        return transaction;
      },
      list(userId, filters) {
        return transactionRepository.findMany(userId, filters);
      },
      get(userId, id) {
        return ensureTransaction(userId, id);
      },
      async update(userId, id, input) {
        await ensureTransaction(userId, id);
        const { name: _name, ...data } = input;
        const transaction = await transactionRepository.update(id, { ...data, ...input.name && !input.title ? { title: input.name } : {} });
        await createTransactionNotifications(userId, input);
        emitEvent("transaction:updated", transaction);
        emitEvent("dashboard:updated", { userId });
        return transaction;
      },
      async delete(userId, id) {
        await ensureTransaction(userId, id);
        await transactionRepository.delete(id);
        emitEvent("transaction:deleted", { id, userId });
        emitEvent("dashboard:updated", { userId });
        return { deleted: true };
      },
      async pay(userId, id) {
        const current = await ensureTransaction(userId, id);
        if (current.type !== TransactionType10.PAYABLE) throw new Error("INVALID_TRANSACTION_TYPE");
        const transaction = await transactionRepository.mark(id, TransactionStatus5.PAID);
        emitEvent("transaction:paid", transaction);
        emitEvent("dashboard:updated", { userId });
        return transaction;
      },
      async receive(userId, id) {
        const current = await ensureTransaction(userId, id);
        if (current.type !== TransactionType10.RECEIVABLE) throw new Error("INVALID_TRANSACTION_TYPE");
        const transaction = await transactionRepository.mark(id, TransactionStatus5.RECEIVED);
        emitEvent("transaction:received", transaction);
        emitEvent("dashboard:updated", { userId });
        return transaction;
      }
    };
  }
});

// services/backend/src/modules/transactions/controller.ts
function handleTransactionError(error, reply) {
  const message = error.message;
  if (message === "TRANSACTION_NOT_FOUND") return reply.status(404).send({ message: "Transa\xE7\xE3o n\xE3o encontrada" });
  if (message === "INVALID_TRANSACTION_TYPE") return reply.status(400).send({ message: "Tipo de transa\xE7\xE3o inv\xE1lido" });
  throw error;
}
var transactionController;
var init_controller17 = __esm({
  "services/backend/src/modules/transactions/controller.ts"() {
    "use strict";
    init_zod();
    init_schema17();
    init_service17();
    transactionController = {
      async create(request, reply) {
        const body = parseOrReply(createTransactionSchema, request.body, reply);
        if (!body) return;
        return reply.status(201).send(await transactionService.create(request.user.sub, body));
      },
      async list(request, reply) {
        const query = parseOrReply(transactionQuerySchema, request.query, reply);
        if (!query) return;
        return reply.send(await transactionService.list(request.user.sub, query));
      },
      async get(request, reply) {
        const params = parseOrReply(transactionParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await transactionService.get(request.user.sub, params.id));
        } catch (error) {
          return handleTransactionError(error, reply);
        }
      },
      async update(request, reply) {
        const params = parseOrReply(transactionParamsSchema, request.params, reply);
        const body = parseOrReply(updateTransactionSchema, request.body, reply);
        if (!params || !body) return;
        try {
          return reply.send(await transactionService.update(request.user.sub, params.id, body));
        } catch (error) {
          return handleTransactionError(error, reply);
        }
      },
      async delete(request, reply) {
        const params = parseOrReply(transactionParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await transactionService.delete(request.user.sub, params.id));
        } catch (error) {
          return handleTransactionError(error, reply);
        }
      },
      async pay(request, reply) {
        const params = parseOrReply(transactionParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await transactionService.pay(request.user.sub, params.id));
        } catch (error) {
          return handleTransactionError(error, reply);
        }
      },
      async receive(request, reply) {
        const params = parseOrReply(transactionParamsSchema, request.params, reply);
        if (!params) return;
        try {
          return reply.send(await transactionService.receive(request.user.sub, params.id));
        } catch (error) {
          return handleTransactionError(error, reply);
        }
      }
    };
  }
});

// services/backend/src/modules/transactions/routes.ts
async function transactionRoutes(app) {
  app.addHook("preHandler", authMiddleware);
  app.post("/", transactionController.create);
  app.get("/", transactionController.list);
  app.get("/:id", transactionController.get);
  app.put("/:id", transactionController.update);
  app.delete("/:id", transactionController.delete);
  app.patch("/:id/pay", transactionController.pay);
  app.patch("/:id/receive", transactionController.receive);
}
var init_routes17 = __esm({
  "services/backend/src/modules/transactions/routes.ts"() {
    "use strict";
    init_auth();
    init_controller17();
  }
});

// services/backend/src/server.ts
import "dotenv/config";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import { createReadStream } from "fs";
import { join } from "path";
var require_server = __commonJS({
  "services/backend/src/server.ts"() {
    init_routes();
    init_routes2();
    init_routes3();
    init_routes4();
    init_routes5();
    init_routes6();
    init_routes7();
    init_routes8();
    init_routes9();
    init_routes10();
    init_routes11();
    init_routes12();
    init_routes13();
    init_routes14();
    init_routes15();
    init_routes16();
    init_routes17();
    init_prisma();
    init_socket();
    var app = Fastify({ logger: true });
    var webRoot = join(process.cwd(), "apps", "web");
    async function bootstrap() {
      await app.register(cors, { origin: true });
      await app.register(jwt, {
        secret: process.env.JWT_SECRET ?? "super-secret"
      });
      setupWebsocket(app);
      await app.register(authRoutes, { prefix: "/auth" });
      await app.register(transactionRoutes, { prefix: "/transactions" });
      await app.register(projectRoutes, { prefix: "/projects" });
      await app.register(dashboardRoutes, { prefix: "/dashboard" });
      await app.register(feedRoutes, { prefix: "/feed" });
      await app.register(notificationRoutes, { prefix: "/notifications" });
      await app.register(profileRoutes, { prefix: "/profiles" });
      await app.register(newsRoutes, { prefix: "/news" });
      await app.register(analyticsRoutes, { prefix: "/analytics" });
      await app.register(bankingRoutes, { prefix: "/banking" });
      await app.register(budgetRoutes, { prefix: "/budgets" });
      await app.register(goalRoutes, { prefix: "/goals" });
      await app.register(cardRoutes, { prefix: "/cards" });
      await app.register(creditRoutes, { prefix: "/credit" });
      await app.register(investmentRoutes, { prefix: "/investments" });
      await app.register(alertRoutes, { prefix: "/alerts" });
      await app.register(assistantRoutes, { prefix: "/assistant" });
      app.get("/", async () => ({ ok: true, name: "finance-system", version: "1.0.0" }));
      app.get("/app", async (_request, reply) => {
        return reply.type("text/html").send(createReadStream(join(webRoot, "index.html")));
      });
      app.get("/app/app.js", async (_request, reply) => {
        return reply.type("application/javascript").send(createReadStream(join(webRoot, "app.js")));
      });
      app.get("/app/styles.css", async (_request, reply) => {
        return reply.type("text/css").send(createReadStream(join(webRoot, "styles.css")));
      });
      app.get("/app/manifest.json", async (_request, reply) => {
        return reply.type("application/manifest+json").send(createReadStream(join(webRoot, "manifest.json")));
      });
      app.get("/app/sw.js", async (_request, reply) => {
        return reply.type("application/javascript").send(createReadStream(join(webRoot, "sw.js")));
      });
      app.get("/app/icon.svg", async (_request, reply) => {
        return reply.type("image/svg+xml").send(createReadStream(join(webRoot, "icon.svg")));
      });
      app.get("/app/logo.svg", async (_request, reply) => {
        return reply.type("image/svg+xml").send(createReadStream(join(webRoot, "logo.svg")));
      });
      app.get("/app/onboarding-illustration.svg", async (_request, reply) => {
        return reply.type("image/svg+xml").send(createReadStream(join(webRoot, "onboarding-illustration.svg")));
      });
      app.get("/health", async () => ({ ok: true }));
      const port = Number(process.env.PORT ?? 3333);
      await app.listen({ port, host: "0.0.0.0" });
    }
    bootstrap().catch(async (error) => {
      app.log.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
  }
});
export default require_server();
