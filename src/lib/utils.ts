import crypto from 'crypto';
import { PaymentSimple } from '@/types';
import { isAddressEqual } from 'viem';
import { Address } from 'viem';
import { FiatCurrencyString } from '@yodlpay/yapp-sdk';

export const truncateAddress = (address?: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

/**
 * Debug function to check common cookie issues in browsers
 * Can be called from client components to help troubleshoot auth issues
 */
export function debugCookieEnvironment(): {
  cookiesEnabled: boolean;
  thirdPartyCookiesBlocked: boolean | null;
  isSecureContext: boolean;
  isCrossOrigin: boolean;
  isMobile: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      cookiesEnabled: false,
      thirdPartyCookiesBlocked: null,
      isSecureContext: false,
      isCrossOrigin: false,
      isMobile: false,
    };
  }

  const cookiesEnabled = navigator.cookieEnabled;
  const isSecureContext = window.isSecureContext;

  // Estimate if we're in a cross-origin iframe
  const isCrossOrigin = (() => {
    try {
      return window.parent !== window && window.parent.location.origin !== window.location.origin;
    } catch (e) {
      // If we can't access parent.location, we're likely cross-origin
      return true;
    }
  })();

  // Detect mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Try to detect third-party cookie blocking
  // This is not foolproof, but can help identify some issues
  let thirdPartyCookiesBlocked = null;

  if (isCrossOrigin) {
    // In cross-origin contexts, we can't reliably detect if third-party cookies
    // are blocked, but we can make a guess based on known browser behaviors
    if (isMobile) {
      // Many mobile browsers block third-party cookies by default
      if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
        // Safari blocks third-party cookies by default
        thirdPartyCookiesBlocked = true;
      }
    }
  }

  return {
    cookiesEnabled,
    thirdPartyCookiesBlocked,
    isSecureContext,
    isCrossOrigin,
    isMobile,
  };
}
