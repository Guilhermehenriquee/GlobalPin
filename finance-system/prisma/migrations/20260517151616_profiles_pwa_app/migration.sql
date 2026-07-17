-- CreateEnum
CREATE TYPE "FinancialProfileType" AS ENUM ('PERSONAL', 'BUSINESS');

-- DropIndex
DROP INDEX "Budget_userId_category_month_year_key";

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "profileId" TEXT;

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "profileId" TEXT;

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "profileId" TEXT;

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "profileId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "profileId" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "profileId" TEXT;

-- CreateTable
CREATE TABLE "FinancialProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FinancialProfileType" NOT NULL,
    "document" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinancialProfile_userId_type_idx" ON "FinancialProfile"("userId", "type");

-- CreateIndex
CREATE INDEX "Budget_profileId_idx" ON "Budget"("profileId");

-- CreateIndex
CREATE INDEX "Card_profileId_idx" ON "Card"("profileId");

-- CreateIndex
CREATE INDEX "Goal_profileId_idx" ON "Goal"("profileId");

-- CreateIndex
CREATE INDEX "Investment_profileId_idx" ON "Investment"("profileId");

-- CreateIndex
CREATE INDEX "Project_profileId_idx" ON "Project"("profileId");

-- CreateIndex
CREATE INDEX "Transaction_profileId_idx" ON "Transaction"("profileId");

-- AddForeignKey
ALTER TABLE "FinancialProfile" ADD CONSTRAINT "FinancialProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FinancialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FinancialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FinancialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FinancialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FinancialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "FinancialProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
