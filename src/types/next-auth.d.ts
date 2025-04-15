import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Session interface for SIWE authentication
   */
  interface Session {
    address: string;
    isVerified: boolean;
  }

  /**
   * User interface for SIWE authentication
   */
  interface User {
    id: string;
    address: string;
    email: string | null;
  }
}
