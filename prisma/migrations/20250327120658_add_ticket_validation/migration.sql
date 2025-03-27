/*
  Warnings:

  - A unique constraint covering the columns `[validation_token]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "redeemed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validation_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_validation_token_key" ON "Ticket"("validation_token");
