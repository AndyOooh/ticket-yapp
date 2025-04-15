'use client';

import { Button } from '@radix-ui/themes';
import { useState } from 'react';
import { useUserContext } from '@/providers/UserContextProvider';
import { sdk } from '@/lib/sdk';
import { signIn, useSession, signOut } from 'next-auth/react';

export const SiweSignInButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: userContext } = useUserContext();
  const { data: session, status } = useSession();

  async function requestSIWE(): Promise<void> {
    if (userContext?.address) {
      try {
        setIsLoading(true);

        const response = await sdk.signSiweMessage({
          address: userContext.address,
          domain: process.env.NEXT_PUBLIC_PARENT_DOMAIN!,
          uri: process.env.NEXT_PUBLIC_PARENT_URL!,
        });

        const result = await signIn('credentials', {
          message: response.message,
          signature: response.signature,
          address: response.address,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('🔴 SIWE error:', error);
      } finally {
        setIsLoading(false);
      }
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
        <Button onClick={() => requestSIWE()} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      )}
    </>
  );
};
