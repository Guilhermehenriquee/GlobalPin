-- CreateEnum
CREATE TYPE "FinancialGoal" AS ENUM ('PAY_OFF_DEBT', 'SAVE_MONEY', 'INVEST_BETTER', 'BUY_CAR', 'BUY_HOUSE', 'EMERGENCY_RESERVE', 'CONTROL_CARD', 'TRACK_NET_WORTH');

-- CreateEnum
CREATE TYPE "InvestorProfile" AS ENUM ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE');

-- CreateEnum
CREATE TYPE "FinancialKnowledgeLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "BankConnectionStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED', 'EXPIRED', 'ERROR');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('CHECKING', 'SAVINGS', 'PAYMENT', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionForm" AS ENUM ('PIX', 'CARD', 'BOLETO', 'DEBIT', 'TRANSFER', 'TED', 'DOC', 'INVESTMENT', 'LOAN', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionSource" AS ENUM ('MANUAL', 'OPEN_FINANCE', 'IMPORT');

-- CreateEnum
CREATE TYPE "CardBrand" AS ENUM ('VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('OPEN', 'CLOSED', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('CDB', 'TREASURY', 'FII', 'STOCK', 'FUND', 'CRYPTO', 'SAVINGS', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestmentRisk" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "InvestmentLiquidity" AS ENUM ('DAILY', 'MATURITY', 'VARIABLE');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('SALARY_RECEIVED', 'CARD_INCREASE', 'DUPLICATE_CHARGE', 'UNUSED_SUBSCRIPTION', 'NEGATIVE_BALANCE_RISK', 'ANOMALY', 'SAVING_OPPORTUNITY', 'BUDGET_LIMIT', 'GENERAL');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('CATEGORY_ANALYSIS', 'ANOMALY', 'RECOMMENDATION', 'FORECAST', 'SUBSCRIPTION', 'DEBT');

-- CreateEnum
CREATE TYPE "AiConversationRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bankAccountId" TEXT,
ADD COLUMN     "direction" "TransactionDirection",
ADD COLUMN     "form" "TransactionForm",
ADD COLUMN     "merchant" TEXT,
ADD COLUMN     "originalDescription" TEXT,
ADD COLUMN     "recurrence" TEXT,
ADD COLUMN     "source" "TransactionSource" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "subcategory" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "financialGoals" "FinancialGoal"[],
ADD COLUMN     "financialKnowledge" "FinancialKnowledgeLevel" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN     "investorProfile" "InvestorProfile",
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "BankConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "status" "BankConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "consentId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenFinanceConsent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankConnectionId" TEXT,
    "externalId" TEXT,
    "status" "ConsentStatus" NOT NULL DEFAULT 'PENDING',
    "permissions" TEXT[],
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenFinanceConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankConnectionId" TEXT,
    "bankName" TEXT NOT NULL,
    "agency" TEXT,
    "accountNumber" TEXT,
    "accountType" "BankAccountType" NOT NULL DEFAULT 'CHECKING',
    "currentBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "availableBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "limit" DECIMAL(12,2) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "alertAt" INTEGER NOT NULL DEFAULT 80,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetAmount" DECIMAL(12,2) NOT NULL,
    "currentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "monthlyTarget" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankAccountId" TEXT,
    "name" TEXT NOT NULL,
    "brand" "CardBrand" NOT NULL DEFAULT 'OTHER',
    "totalLimit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "usedLimit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "availableLimit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "closingDay" INTEGER,
    "dueDay" INTEGER,
    "bestPurchaseDay" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "type" "InvestmentType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "profitability" TEXT,
    "maturity" TIMESTAMP(3),
    "risk" "InvestmentRisk" NOT NULL DEFAULT 'LOW',
    "liquidity" "InvestmentLiquidity" NOT NULL DEFAULT 'DAILY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "InsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL DEFAULT 'GENERAL',
    "severity" "AlertSeverity" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNewsPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL,
    "keyword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNewsPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AiConversationRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BankConnection_userId_status_idx" ON "BankConnection"("userId", "status");

-- CreateIndex
CREATE INDEX "OpenFinanceConsent_userId_status_idx" ON "OpenFinanceConsent"("userId", "status");

-- CreateIndex
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_category_month_year_key" ON "Budget"("userId", "category", "month", "year");

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "Card_userId_idx" ON "Card"("userId");

-- CreateIndex
CREATE INDEX "Invoice_cardId_status_idx" ON "Invoice"("cardId", "status");

-- CreateIndex
CREATE INDEX "Investment_userId_type_idx" ON "Investment"("userId", "type");

-- CreateIndex
CREATE INDEX "FinancialInsight_userId_type_idx" ON "FinancialInsight"("userId", "type");

-- CreateIndex
CREATE INDEX "Alert_userId_read_idx" ON "Alert"("userId", "read");

-- CreateIndex
CREATE INDEX "UserNewsPreference_userId_category_idx" ON "UserNewsPreference"("userId", "category");

-- CreateIndex
CREATE INDEX "AiConversation_userId_createdAt_idx" ON "AiConversation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_bankAccountId_idx" ON "Transaction"("bankAccountId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankConnection" ADD CONSTRAINT "BankConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenFinanceConsent" ADD CONSTRAINT "OpenFinanceConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenFinanceConsent" ADD CONSTRAINT "OpenFinanceConsent_bankConnectionId_fkey" FOREIGN KEY ("bankConnectionId") REFERENCES "BankConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_bankConnectionId_fkey" FOREIGN KEY ("bankConnectionId") REFERENCES "BankConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialInsight" ADD CONSTRAINT "FinancialInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNewsPreference" ADD CONSTRAINT "UserNewsPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
