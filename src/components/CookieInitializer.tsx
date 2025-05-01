'use client';

import { Button } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { isInIframe } from '@yodlpay/yapp-sdk';

const AUTH_COOKIES = ['next-auth.session-token', 'next-auth.csrf-token', 'next-auth.callback-url'];

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

  const setPlaceholderCookies = () => {
    console.log('🍪 Setting placeholder cookies...');
    AUTH_COOKIES.forEach((cookie) => {
      // Set cookie with placeholder value, same security attributes as NextAuth
      document.cookie = `${cookie}=placeholder; path=/; SameSite=Lax; Secure`;
      console.log(`  ✅ Set ${cookie}`);
    });
    setShowButton(false);
    console.log('✅ All placeholder cookies set');
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 right-4">
      <Button onClick={setPlaceholderCookies}>Initialize Cookies</Button>
    </div>
  );
};
