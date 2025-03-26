import { FiatCurrency } from '@yodlpay/yapp-sdk';
import { Address } from 'viem';

export * from './tag';

// Configure the payment details for posting
// - currency: The currency in which fees are charged (USD, EUR, etc.)
// - amount: The cost per post in the specified currency
// - address: Your wallet address that will receive the fees
export const POST_FEE = {
  currency: FiatCurrency.USD,
  amount: 0.01,
  address: '0xDC3Cac69C81161ab8Fea6AB84fE90a7ECa43912A' as Address, // alecity.eth.
};

// The URL where your Yapp is hosted
// Will automatically use localhost for development
export const YAPP_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://messageboard-alecity.vercel.app/';

// The ENS name for your Yapp (required for Yodl integration)
export const YAPP_ENS_NAME = 'messageboard.alecity.eth';

// The parent URL of the Yodl super app that will embed this Yapp
export const PARENT_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://yodl.me';

// The title of your message board that appears on the homepage
export const BOARD_TITLE = 'Alecity Posts';
export const BOARD_SUB_TITLE = 'Community Message Board';

// The color of the accent color for your message board
export const ACCENT_COLOR = 'gray';
