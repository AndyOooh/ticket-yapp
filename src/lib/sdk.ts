import YappSDK from '@yodlpay/yapp-sdk';

export const sdk = new YappSDK({
  origin: process.env.NEXT_PUBLIC_PARENT_URL!,
});
