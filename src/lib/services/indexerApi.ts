import { PaymentSimple } from '@/types';

/**
 * Fetches payment data from the Yodl indexer API
 * @param txHash Transaction hash to fetch payment information for
 * @returns PaymentSimple - Payment information
 */
export const getPayment = async (txHash: string): Promise<PaymentSimple> => {
  const INDEXER_URL = 'https://tx.yodl.me/api/v1';
  const response = await fetch(`${INDEXER_URL}/payments/${txHash}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch payment: ${response.status}`);
  }

  const data = await response.json();
  return data.payment;
};
