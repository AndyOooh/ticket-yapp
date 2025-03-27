import { CREATE_EVENT_FEE } from '@/constants';
import { PaymentSimple } from '@/types';
import { isAddressEqual } from 'viem';
import { Address } from 'viem';
import { Event } from '@prisma/client';

export const verifyPayment = (
  payment: PaymentSimple,
  receiverAddress: Address,
  event: Event
): boolean => {
  if (!event) return false;
  if (!isAddressEqual(payment.receiverAddress as Address, receiverAddress)) {
    throw new Error('Verification failed: Receiver address does not match');
  }

  if (Number(payment.invoiceAmount) < CREATE_EVENT_FEE.amount)
    throw new Error('Verification failed: Amount is too small');

  if (payment.invoiceCurrency !== CREATE_EVENT_FEE.currency)
    throw new Error(`Verification failed: Currency must be ${CREATE_EVENT_FEE.currency}`);

  // TODO: indexerAPI has the code to return memo but deployment was rolled back
  // if (post.id && Number(payment.memo) !== post.id)
  //   throw new Error('Verification failed: Memo does not match');
  return true;
};
