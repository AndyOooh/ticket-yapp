import { Post, Vote, Comment } from '@prisma/client';

export type PostExtended = Post & {
  _count?: {
    comments: number;
  };
  votes?: Vote[];
  comments?: Comment[];
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
