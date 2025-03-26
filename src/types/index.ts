// Extended Event types
import type { Event, Ticket } from '@prisma/client';

// Event with ticket count
export type EventWithCount = Event & {
  _count: {
    tickets: number;
  };
};

// Event with tickets and count
export type EventWithTickets = Event & {
  tickets: Ticket[];
  _count: {
    tickets: number;
  };
};

// From indexer api
export type PaymentSimple = {
  chainId: number;
  txHash: string;
  paymentIndex: number;
  blockTimestamp: string;

  tokenOutSymbol: string;
  tokenOutAddress: string;
  tokenOutAmountGross: string;

  receiverAddress: string;
  receiverEnsPrimaryName: string;
  receiverYodlConfig: any;

  invoiceCurrency: string;
  invoiceAmount: string;

  senderAddress: string;
  senderEnsPrimaryName: string;

  memo: string;
};
