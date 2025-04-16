'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUserContext } from '@/providers/UserContextProvider';
import { isInIframe } from '@yodlpay/yapp-sdk';

/**
 * SessionGuard component that ensures the authenticated wallet address
 * matches the address from the parent app context.
 *
 * This will automatically sign out users if they switch wallets in the parent app.
 */
export function SessionGuard() {
  const { data: session, status: sessionStatus } = useSession();
  const { data: userContext, isLoading: isUserContextLoading } = useUserContext();

  useEffect(() => {
    // Only check once session is loaded (we might not have userContext in standalone mode)
    if (sessionStatus === 'loading') {
      return;
    }

    const isStandalone = !isInIframe();
    const hasSession = sessionStatus === 'authenticated' && !!session?.address;
    const hasUserContext = !!userContext?.address;

    // Scenario 1: User is in standalone mode and has a session
    if (isStandalone && hasSession) {
      if (process.env.NODE_ENV === 'development') {
        // In development, we use mock data so we don't need to sign out
        console.log('🟡 Standalone dev mode with session - keeping session active');
      } else {
        // In production standalone mode, sign out user if they have a session
        // This prevents session data persisting incorrectly outside the parent app
        console.log('🟠 Standalone mode with session - signing out for security');
        signOut({ redirect: false });
      }
      return;
    }

    // Scenario 2: User is in iframe (inside parent app)
    if (!isStandalone) {
      // Only proceed if we have both session and user context
      if (hasSession && hasUserContext) {
        const sessionAddress = session.address.toLowerCase();
        const contextAddress = userContext.address.toLowerCase();

        // If addresses don't match, sign out
        if (sessionAddress !== contextAddress) {
          console.log('🔴 Address mismatch detected:', {
            sessionAddress,
            contextAddress,
          });

          // Sign out the user since the addresses don't match
          signOut({ redirect: false }).then(() => {
            console.log('🟢 Successfully signed out due to address mismatch');
          });
        } else {
          console.log('🟢 Session address matches user context:', sessionAddress);
        }
      } else if (hasSession && !hasUserContext && !isUserContextLoading) {
        // We have a session but no user context - this could be an error state
        console.log('🟠 Has session but no user context - possible error state');
      }
    }
  }, [session, sessionStatus, userContext, isUserContextLoading]);

  // This component doesn't render anything
  return null;
}
