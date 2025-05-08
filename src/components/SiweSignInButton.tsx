'use client';

import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { useUserContext } from '@/providers/UserContextProvider';
import { sdk } from '@/lib/sdk';
import { signIn, useSession, signOut } from 'next-auth/react';
import { generateNonce } from '@/lib/actions/nonce';
import { debugCookieEnvironment } from '@/lib/utils';
import { setPlaceholderCookies } from '@/lib/actions/cookies';
import { RequestStorageAccessModal } from './RequestStorageAccessModal';

export const SiweSignInButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const [isStorageAccessModalOpen, setIsStorageAccessModalOpen] = useState<boolean>(true);
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
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const hasStorageAccessAPI =
      'hasStorageAccess' in document && 'requestStorageAccess' in document;

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

      // // Check if we already have access
      // console.log('🔹 Checking current storage access...');
      // const hasAccess = await document.hasStorageAccess();
      // console.log('🔹 Current storage access:', hasAccess);

      // if (hasAccess) {
      //   console.log('🟢 Already have storage access');
      //   return true;
      // }

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

  async function requestSIWE(): Promise<void> {
    console.log('🚀🟣 requestSIWE');
    if (!userContext?.address) {
      setError('No wallet address available');
      console.error('🔴 No user address available for SIWE');
      return;
    }

    setError(null);
    setIsLoading(true);

    // First get storage access
    const storageAccessResult = await requestStorageAccess();
    console.log('🚀 storageAccessResult:', storageAccessResult);

    if (!storageAccessResult) {
      throw new Error('Storage access is required for authentication');
    }

    // Then set placeholder cookies
    console.log('🍪 Setting placeholder cookies...');
    try {
      await setPlaceholderCookies();
      console.log('✅ All placeholder cookies set');
    } catch (error) {
      console.error('❌ Failed to set cookies:', error);
      throw error;
    }

    try {
      // 1. Generate a nonce from the server
      const nonce = await generateNonce();

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
          {/* <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button onClick={() => requestSIWE()} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Grant cookie access</AlertDialog.Title>
              <AlertDialog.Description size="2">
                On iOS, Safari requires you to grant access to cookies. Please grant access to
                cookies to continue.
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button onClick={() => requestStorageAccess()} variant="solid" color="red">
                    Grant access
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root> */}

          <Button onClick={() => requestSIWE()} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          {/* TODO: move this for better ui. COnsider using a Toast instead */}
          {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
        </>
      )}
    </>
  );
};
