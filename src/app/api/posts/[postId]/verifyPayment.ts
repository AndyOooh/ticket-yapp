import { POST_FEE } from '@/constants';
import { PaymentSimple, PostExtended } from '@/types';
import { isAddressEqual } from 'viem';
import { Address } from 'viem';

export const verifyPayment = (
  payment: PaymentSimple,
  receiverAddress: Address,
  post: PostExtended | null
): boolean => {
  if (!post) return false;
  if (!isAddressEqual(payment.receiverAddress as Address, receiverAddress)) {
    throw new Error('Verification failed: Receiver address does not match');
  }

  if (Number(payment.invoiceAmount) < POST_FEE.amount)
    throw new Error('Verification failed: Amount is too small');

  if (payment.invoiceCurrency !== POST_FEE.currency)
    throw new Error(`Verification failed: Currency must be ${POST_FEE.currency}`);

  // TODO: indexerAPI has the code to return memo but deployment was rolled back
  // if (post.id && Number(payment.memo) !== post.id)
  //   throw new Error('Verification failed: Memo does not match');
  return true;
};
