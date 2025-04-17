import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';
import { verifyWithEOA, verifyWithSCA } from './verify';
import { verifyNonce } from '@/lib/actions/nonce';

/**
 * NextAuth configuration with SIWE authentication
 * Supports both EOA and SCA wallets
 */
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'SIWE',
      credentials: {
        message: { type: 'text' },
        signature: { type: 'text' },
        address: { type: 'text' },
      },
      async authorize(credentials) {
        try {
          // Validate required fields
          if (!credentials?.message || !credentials?.signature || !credentials?.address) {
            console.error('🔴 Missing required SIWE credentials');
            return null;
          }

          // Parse the SIWE message
          const siweMessage = new SiweMessage(credentials.message);
          const chainId = siweMessage.chainId;

          // Verify the nonce from the cookie
          const isValidNonce = await verifyNonce(siweMessage.nonce);
          if (!isValidNonce) {
            console.error('🔴 Invalid nonce in SIWE message');
            return null;
          }

          // Two-phase verification strategy:
          // 1. Try EOA verification first (most common case)
          let verificationResult = await verifyWithEOA(siweMessage, credentials.signature);

          // 2. If EOA verification fails, try SCA verification
          if (!verificationResult) {
            verificationResult = await verifyWithSCA(
              siweMessage,
              credentials.signature,
              credentials.address,
              chainId
            );
          }

          // Final verification: ensure success and address matches
          if (
            !verificationResult?.success ||
            verificationResult.data.address.toLowerCase() !== credentials.address.toLowerCase()
          ) {
            console.error(
              '🔴 SIWE verification failed: address mismatch or unsuccessful verification'
            );
            return null;
          }

          return {
            id: credentials.address,
            address: credentials.address,
            // We need to keep email for NextAuth typings, but set it to null
            email: null,
          };
        } catch (error) {
          console.error('🔴 SIWE verification error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    /**
     * JWT callback - called when creating and updating the JSON Web Token
     *
     * Initial sign-in: Copy user data from credentials to the token
     * Subsequent calls: Return the token unchanged
     */
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          address: user.address,
          isVerified: true,
          name: user.address,
          // Keep email for consistency with token structure
          email: null,
        };
      }
      // Subsequent calls
      return token;
    },

    /**
     * Session callback - called whenever a session is checked
     *
     * This function creates the session object that's available
     * on the client via useSession() and on the server via getServerSession()
     */
    async session({ session, token }) {
      const updatedSession = {
        ...session,
        address: token.address as string,
        isVerified: token.isVerified as boolean,
      };
      return updatedSession;
    },
  },

  /**
   * Session configuration
   * Using JWT strategy for stateless sessions
   */
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  /**
   * Cookie configuration for secure embedding in iframe environments
   *
   * These settings are crucial for session persistence and security,
   * especially when running in embedded contexts like mini-apps
   */
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.callback-url`
          : `next-auth.callback-url`,
      options: {
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Host-next-auth.csrf-token`
          : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
};

/**
 * Helper function to get the server-side session
 * Used in server components and API routes
 */
export const getServerAuthSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
