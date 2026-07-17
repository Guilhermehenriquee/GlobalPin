-- Preserve existing data while aligning names and enums with the final architecture.

ALTER TABLE "User" RENAME COLUMN "netSalary" TO "salary";
ALTER TABLE "Transaction" RENAME COLUMN "name" TO "title";
ALTER TABLE "Project" RENAME COLUMN "productName" TO "title";
ALTER TABLE "Project" RENAME COLUMN "returnValue" TO "amount";

ALTER TABLE "Notification" ADD COLUMN "read" BOOLEAN NOT NULL DEFAULT false;
UPDATE "Notification" SET "read" = true WHERE "readAt" IS NOT NULL;

ALTER TYPE "ProjectStatus" ADD VALUE IF NOT EXISTS 'CANCELED';

CREATE TYPE "ProjectCategory_new" AS ENUM ('SPORTS', 'ELECTRONICS', 'SYSTEMS', 'SERVICES', 'OTHER');
ALTER TABLE "Project" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Project"
  ALTER COLUMN "category" TYPE "ProjectCategory_new"
  USING (
    CASE "category"::text
      WHEN 'ESPORTIVOS' THEN 'SPORTS'
      WHEN 'ELETRONICOS' THEN 'ELECTRONICS'
      WHEN 'SISTEMAS' THEN 'SYSTEMS'
      WHEN 'OUTROS' THEN 'OTHER'
      ELSE 'OTHER'
    END
  )::"ProjectCategory_new";
DROP TYPE "ProjectCategory";
ALTER TYPE "ProjectCategory_new" RENAME TO "ProjectCategory";

CREATE TYPE "NotificationType_new" AS ENUM ('INFO', 'WARNING', 'SUCCESS', 'ERROR');
ALTER TABLE "Notification" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Notification"
  ALTER COLUMN "type" TYPE "NotificationType_new"
  USING (
    CASE "type"::text
      WHEN 'PROJECT_PAID' THEN 'SUCCESS'
      WHEN 'BILL_DUE_TOMORROW' THEN 'WARNING'
      WHEN 'HIGH_VALUE_REGISTERED' THEN 'WARNING'
      WHEN 'GENERAL' THEN 'INFO'
      ELSE 'INFO'
    END
  )::"NotificationType_new";
ALTER TABLE "Notification" ALTER COLUMN "type" SET DEFAULT 'INFO';
DROP TYPE "NotificationType";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";

CREATE TYPE "NewsCategory" AS ENUM ('SPORTS', 'ELECTRONICS', 'TECH', 'FINANCE', 'BUSINESS');
ALTER TABLE "NewsItem" ADD COLUMN "summary" TEXT;
ALTER TABLE "NewsItem" ADD COLUMN "relevance" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "NewsItem"
  ALTER COLUMN "category" TYPE "NewsCategory"
  USING (
    CASE UPPER("category")
      WHEN 'SPORTS' THEN 'SPORTS'
      WHEN 'ELECTRONICS' THEN 'ELECTRONICS'
      WHEN 'TECH' THEN 'TECH'
      WHEN 'FINANCE' THEN 'FINANCE'
      WHEN 'BUSINESS' THEN 'BUSINESS'
      ELSE NULL
    END
  )::"NewsCategory";
