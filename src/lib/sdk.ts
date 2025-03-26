import { PARENT_URL, YAPP_ENS_NAME } from '@/constants';
import YappSDK from '@yodlpay/yapp-sdk';

export const sdk = new YappSDK({
  ensName: YAPP_ENS_NAME,
  origin: PARENT_URL,
});
