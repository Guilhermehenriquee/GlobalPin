ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "externalId" TEXT;
ALTER TABLE "BankConnection" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "externalId" TEXT;
ALTER TABLE "Card" ADD COLUMN IF NOT EXISTS "externalId" TEXT;
ALTER TABLE "Investment" ADD COLUMN IF NOT EXISTS "externalId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_userId_source_externalId_key"
  ON "Transaction"("userId", "source", "externalId");

CREATE UNIQUE INDEX IF NOT EXISTS "BankAccount_userId_externalId_key"
  ON "BankAccount"("userId", "externalId");

CREATE UNIQUE INDEX IF NOT EXISTS "Card_userId_externalId_key"
  ON "Card"("userId", "externalId");

CREATE UNIQUE INDEX IF NOT EXISTS "Investment_userId_externalId_key"
  ON "Investment"("userId", "externalId");
