import { PARENT_URL } from '@/constants';
import YappSDK from '@yodlpay/yapp-sdk';

export const sdk = new YappSDK({
  origin: PARENT_URL,
});
