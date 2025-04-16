import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';

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

          const fields = await siweMessage.verify({
            signature: credentials.signature,
            domain: siweMessage.domain,
          });

          if (
            !fields.success ||
            fields.data.address.toLowerCase() !== credentials.address.toLowerCase()
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
