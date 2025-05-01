'use client';

import { Button } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { isInIframe } from '@yodlpay/yapp-sdk';
import { setPlaceholderCookies } from '@/lib/actions/cookies';

const AUTH_COOKIES = [
  process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token',
  process.env.NODE_ENV === 'production' ? '__Secure-next-auth.csrf-token' : 'next-auth.csrf-token',
  process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.callback-url'
    : 'next-auth.callback-url',
];

export const CookieInitializer = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Only check in standalone mode
    if (!isInIframe()) {
      console.log('🔍 Checking auth cookies in standalone mode...');
      const hasAllCookies = AUTH_COOKIES.every((cookie) => {
        const exists = document.cookie.includes(cookie);
        console.log(`  ${exists ? '✅' : '❌'} ${cookie}`);
        return exists;
      });
      console.log(`📝 ${hasAllCookies ? 'All cookies present' : 'Some cookies missing'}`);
      setShowButton(!hasAllCookies);
    } else {
      console.log('🖼️ In iframe mode - skipping cookie check');
    }
  }, []);

  const handleSetCookies = async () => {
    console.log('🍪 Setting placeholder cookies...');
    try {
      await setPlaceholderCookies();
      console.log('✅ All placeholder cookies set');
      setShowButton(false);
    } catch (error) {
      console.error('❌ Failed to set cookies:', error);
    }
  };

  //   if (!showButton) return null;

  return (
    // <div className="fixed bottom-4 right-4">
    <Button onClick={handleSetCookies}>Initialize Cookies</Button>
    // </div>
  );
};
