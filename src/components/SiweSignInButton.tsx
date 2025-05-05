'use client';

import { Button } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { useUserContext } from '@/providers/UserContextProvider';
import { sdk } from '@/lib/sdk';
import { signIn, useSession, signOut } from 'next-auth/react';
import { generateNonce } from '@/lib/actions/nonce';
import { debugCookieEnvironment } from '@/lib/utils';
import { setPlaceholderCookies } from '@/lib/actions/cookies';

export const SiweSignInButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: userContext } = useUserContext();
  const { data: session, status } = useSession();

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const hasStorageAccessAPI = 'hasStorageAccess' in document && 'requestStorageAccess' in document;
  // Check cookie environment on mount to help with debugging
  useEffect(() => {
    if (userContext?.address && !session?.address) {
      const cookieEnv = debugCookieEnvironment();
      console.log('🍪 Cookie environment check:', cookieEnv);

      // Alert about potential issues
      if (cookieEnv.thirdPartyCookiesBlocked) {
        console.warn('⚠️ Third-party cookies may be blocked in this browser');
      }

      if (!cookieEnv.isSecureContext) {
        console.warn('⚠️ Not in a secure context. Authentication requires HTTPS');
      }
    }
  }, [userContext, session]);

  async function requestStorageAccess(): Promise<boolean> {
    if (!isSafari || !hasStorageAccessAPI) {
      console.log('🟡 Storage access not needed - not Safari or API not available');
      return true;
    }

    try {
      // Check basic security requirements
      console.log('🔹 Security checks:', {
        origin: window.location.origin,
        isSecureContext: window.isSecureContext,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
      });

      // Check if we already have access
      console.log('🔹 Checking current storage access...');
      const hasAccess = await document.hasStorageAccess();
      console.log('🔹 Current storage access:', hasAccess);

      if (hasAccess) {
        console.log('🟢 Already have storage access');
        return true;
      }

      // Request access
      console.log('🔹 Requesting storage access...');
      await document.requestStorageAccess();
      console.log('🟢 Storage access granted');
      return true;
    } catch (error) {
      console.error('🔴 Storage access request failed:', error);
      if (error instanceof Error) {
        console.error('🔴 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      return false;
    }
  }

  // function setClientPlaceholderCookies() {
  //   const isProd = process.env.NODE_ENV === 'production';
  //   const cookieNames = [
  //     isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
  //     isProd ? '__Secure-next-auth.csrf-token' : 'next-auth.csrf-token',
  //     isProd ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
  //   ];

  //   let allSet = true;

  //   cookieNames.forEach((name) => {
  //     const value = name.includes('callback-url')
  //       ? process.env.NEXT_PUBLIC_YAPP_URL || 'http://localhost:3001'
  //       : 'placeholder';

  //     // Set cookie for cross-site/iframe support
  //     document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=None; Secure`;

  //     // Check if cookie was set
  //     const exists = document.cookie.split('; ').some((c) => c.startsWith(name + '='));
  //     console.log(`${exists ? '✅' : '❌'} Set cookie:`, name, value);
  //     if (!exists) allSet = false;
  //   });

  //   if (allSet) {
  //     console.log('✅ All client-side placeholder cookies set');
  //   } else {
  //     console.warn('❌ Some client-side cookies may not have been set');
  //   }
  // }

  async function requestSIWE(): Promise<void> {
    console.log('🚀🟣 requestSIWE');
    if (!userContext?.address) {
      setError('No wallet address available');
      console.error('🔴 No user address available for SIWE');
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await setPlaceholderCookies();

      // Request storage access before proceeding
      const hasAccess = await requestStorageAccess();
      if (!hasAccess) {
        throw new Error(
          'Storage access is required for authentication. Please ensure you have interacted with this site in a first-party context before.'
        );
      }

      // Set placeholder cookies
      // setClientPlaceholderCookies();

      // 1. Generate a nonce from the server
      console.log('🔹 Generating nonce from server...');
      const nonce = await generateNonce();
      console.log('🔹 Received nonce:', nonce);

      // 2. Request signature from parent app with the nonce
      console.log('🔹 Requesting SIWE signature from parent app...');
      const response = await sdk.signSiweMessage({
        address: userContext.address,
        domain: process.env.NEXT_PUBLIC_PARENT_DOMAIN!,
        uri: process.env.NEXT_PUBLIC_PARENT_URL!,
        nonce, // Include the server-generated nonce
      });

      console.log('🔹 Received SIWE response:', {
        address: response.address,
        hasSignature: !!response.signature,
        hasMessage: !!response.message,
      });

      if (!response.signature || !response.message) {
        throw new Error('Missing signature or message from SIWE response');
      }

      // 3. Send credentials to NextAuth
      console.log('🔹 Sending credentials to NextAuth...');
      const result = await signIn('credentials', {
        message: response.message,
        signature: response.signature,
        address: response.address,
        redirect: false,
      });

      console.log('🔹 NextAuth sign-in result:', result);

      if (result?.error) {
        console.error('🔴 NextAuth error:', result.error);
        throw new Error(`Authentication failed: ${result.error}`);
      }

      if (!result?.ok) {
        console.error('🔴 NextAuth response not OK:', result);
        throw new Error('Authentication failed: server returned an error');
      }

      console.log('🟢 SIWE authentication successful!');
    } catch (error) {
      console.error('🔴 SIWE error:', error);
      setError((error as Error).message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  return (
    <>
      {status === 'loading' ? (
        <Button disabled>Loading...</Button>
      ) : session?.address ? (
        <Button onClick={handleSignOut}>Verified: {session.address.slice(0, 6)}...</Button>
      ) : (
        <>
          <Button onClick={() => requestSIWE()} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
        </>
      )}
    </>
  );
};
