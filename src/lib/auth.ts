import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';
import { createPublicClient, http, type Address, type Hex, type Chain } from 'viem';
import { base, mainnet, optimism, arbitrum, polygon } from 'viem/chains';

// Map of supported chains for verification
const supportedChains: Record<number, Chain> = {
  1: mainnet,
  8453: base,
  10: optimism,
  42161: arbitrum,
  137: polygon,
};

// Create a public client for the specific chain
const getPublicClient = (chainId: number) => {
  const chain = supportedChains[chainId] || base; // Default to base if chain not found
  return createPublicClient({
    chain,
    transport: http(),
  });
};

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debug for more verbose logging
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
          if (!credentials?.message || !credentials?.signature || !credentials?.address) {
            return null;
          }

          const siweMessage = new SiweMessage(credentials.message);
          const chainId = siweMessage.chainId;

          console.log(`🔵 Verifying SIWE message for chain ID: ${chainId}`);

          // Try standard EOA verification first
          let verificationResult;
          try {
            verificationResult = await siweMessage.verify({
              signature: credentials.signature,
              domain: siweMessage.domain,
            });
          } catch (error) {
            console.error('🔴 Standard SIWE verification failed, trying ERC-1271:', error);
            // Standard verification failed, try ERC-1271 for Smart Contract Accounts
            try {
              // Get the appropriate client for this chain
              const publicClient = getPublicClient(chainId);

              // Use viem's verifyMessage for ERC-1271 verification
              const isValidSCA = await publicClient.verifyMessage({
                address: credentials.address as Address,
                message: siweMessage.prepareMessage(),
                signature: credentials.signature as Hex,
              });

              if (!isValidSCA) {
                console.error('🔴 ERC-1271 verification failed');
                return null;
              }

              verificationResult = { success: true, data: { address: credentials.address } };
              console.log('🟢 ERC-1271 verification successful for SCA wallet');
            } catch (scaError) {
              console.error('🔴 ERC-1271 verification error:', scaError);
              return null;
            }
          }

          // Ensure we have a successful verification and the addresses match
          if (
            !verificationResult.success ||
            verificationResult.data.address.toLowerCase() !== credentials.address.toLowerCase()
          ) {
            return null;
          }

          console.log('🟢 Verification successful, creating user');
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
    async jwt({ token, user }) {
      console.log('🔵 JWT callback:', {
        hasUser: !!user,
        user: user ? { id: user.id, address: user.address } : undefined,
        token,
      });

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
    async session({ session, token }) {
      console.log('🔵 Session callback:', {
        tokenAddress: token.address,
        sessionBefore: session,
      });

      const updatedSession = {
        ...session,
        address: token.address as string,
        isVerified: token.isVerified as boolean,
      };

      console.log('🔵 Updated session:', updatedSession);
      return updatedSession;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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

export const getServerAuthSession = async () => {
  const session = await getServerSession(authOptions);
  console.log('🔵 Server session:', {
    hasSession: !!session,
    address: session?.address,
  });
  return session;
};
