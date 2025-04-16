'use client';

import { Button } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { useUserContext } from '@/providers/UserContextProvider';
import { sdk } from '@/lib/sdk';
import { signIn, useSession, signOut } from 'next-auth/react';

export const SiweSignInButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: userContext } = useUserContext();
  const { data: session, status } = useSession();

  // Log session state changes
  useEffect(() => {
    console.log('🟢 Session status:', status);
    console.log('🟢 Session data:', session);
  }, [session, status]);

  async function requestSIWE(): Promise<void> {
    console.log('🟣 Starting SIWE flow');
    if (userContext?.address) {
      try {
        setIsLoading(true);
        console.log('🟣 User context:', userContext);

        const response = await sdk.signSiweMessage({
          address: userContext.address,
          domain: process.env.NEXT_PUBLIC_PARENT_DOMAIN!,
          uri: process.env.NEXT_PUBLIC_PARENT_URL!,
        });
        console.log('🚀 response:', response);

        console.log('🟣 SIWE response:', {
          messageLength: response.message?.length,
          hasSignature: !!response.signature,
          address: response.address,
        });

        const result = await signIn('credentials', {
          message: response.message,
          signature: response.signature,
          address: response.address,
          redirect: false,
        });

        console.log('🟣 Sign in result:', result);

        if (result?.error) {
          throw new Error(result.error);
        }

        // Wait a moment and check session again
        setTimeout(() => {
          console.log('🟣 Session after auth:', {
            status,
            session,
            hasCookie: document.cookie.includes('next-auth.session-token'),
          });
        }, 1000);
      } catch (error) {
        console.error('🔴 SIWE error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleSignOut = async () => {
    console.log('🟣 Signing out');
    await signOut({ redirect: false });
    console.log('🟣 Signed out, new session status:', status);
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
