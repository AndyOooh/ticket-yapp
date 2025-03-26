/*
  Warnings:

  - You are about to alter the column `price_amount` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "price_amount" SET DATA TYPE DOUBLE PRECISION;
