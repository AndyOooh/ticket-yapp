-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "creator_ens" TEXT,
    "creator_address" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "capacity" INTEGER,
    "price_amount" DECIMAL(10,2),
    "price_currency" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "owner_ens" TEXT,
    "owner_address" TEXT NOT NULL,
    "tx_hash" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_creator_address_idx" ON "Event"("creator_address");

-- CreateIndex
CREATE INDEX "Event_tags_idx" ON "Event"("tags");

-- CreateIndex
CREATE INDEX "Event_event_time_idx" ON "Event"("event_time");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_tx_hash_key" ON "Ticket"("tx_hash");

-- CreateIndex
CREATE INDEX "Ticket_event_id_idx" ON "Ticket"("event_id");

-- CreateIndex
CREATE INDEX "Ticket_owner_address_idx" ON "Ticket"("owner_address");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
