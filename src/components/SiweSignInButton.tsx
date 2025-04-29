'use client';

import { Button } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { useUserContext } from '@/providers/UserContextProvider';
import { sdk } from '@/lib/sdk';
import { signIn, useSession, signOut } from 'next-auth/react';
import { generateNonce } from '@/lib/actions/nonce';
import { debugCookieEnvironment } from '@/lib/utils';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const hasStorageAccessAPI = 'hasStorageAccess' in document && 'requestStorageAccess' in document;

export const SiweSignInButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: userContext } = useUserContext();
  const { data: session, status } = useSession();

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
    if (!isSafari || !hasStorageAccessAPI) return true;

    try {
      const hasAccess = await document.hasStorageAccess();
      if (hasAccess) return true;

      console.log('🔹 Requesting storage access...');
      await document.requestStorageAccess();
      console.log('🟢 Storage access granted');
      return true;
    } catch (error) {
      console.error('🔴 Storage access request failed:', error);
      return false;
    }
  }

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

      // Request storage access before proceeding
      const hasAccess = await requestStorageAccess();
      if (!hasAccess) {
        throw new Error('Storage access is required for authentication');
      }

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
