'use client';

import { Button } from '@radix-ui/themes';
import { useState } from 'react';
import { useUserContext } from '@/providers/UserContextProvider';
import { sdk } from '@/lib/sdk';
import { signIn, useSession, signOut } from 'next-auth/react';
import { generateNonce } from '@/lib/actions/nonce';

export const SiweSignInButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: userContext } = useUserContext();
  const { data: session, status } = useSession();

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

      // 1. Generate a nonce from the server
      const nonce = await generateNonce();

      // 2. Request signature from parent app with the nonce
      const response = await sdk.signSiweMessage({
        address: userContext.address,
        domain: process.env.NEXT_PUBLIC_PARENT_DOMAIN!,
        uri: process.env.NEXT_PUBLIC_PARENT_URL!,
        nonce, // Include the server-generated nonce
      });

      if (!response.signature || !response.message) {
        throw new Error('Missing signature or message from SIWE response');
      }

      // 3. Send credentials to NextAuth
      const result = await signIn('credentials', {
        message: response.message,
        signature: response.signature,
        address: response.address,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(`Authentication failed: ${result.error}`);
      }
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
