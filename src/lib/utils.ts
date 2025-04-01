import crypto from 'crypto';
import { PaymentSimple } from '@/types';
import { isAddressEqual } from 'viem';
import { Address } from 'viem';
import { FiatCurrencyString } from '@yodlpay/yapp-sdk';

export const truncateAddress = (address?: string) => {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
};

export const generateValidationToken = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const verifyPayment = (
  payment: PaymentSimple,
  receiverAddress: Address,
  invoiceAmount: number,
  invoiceCurrency: FiatCurrencyString,
  memo: number
): boolean => {
  if (!memo) return false;
  if (!isAddressEqual(payment.receiverAddress as Address, receiverAddress)) {
    throw new Error('Verification failed: Receiver address does not match');
  }

  if (Number(payment.invoiceAmount) < invoiceAmount)
    throw new Error('Verification failed: Amount is too small');

  if (payment.invoiceCurrency !== invoiceCurrency)
    throw new Error(`Verification failed: Currency must be ${invoiceCurrency}`);

  // TODO: indexerAPI has the code to return memo but deployment was rolled back
  if (memo && Number(payment.memo) !== memo)
    throw new Error('Verification failed: Memo does not match');
  return true;
};
