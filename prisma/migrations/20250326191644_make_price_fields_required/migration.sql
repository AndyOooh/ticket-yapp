/*
  Warnings:

  - Made the column `price_amount` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price_currency` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "price_amount" SET NOT NULL,
ALTER COLUMN "price_currency" SET NOT NULL;
