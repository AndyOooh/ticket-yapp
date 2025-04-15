import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

console.log('🔵 NextAuth route hit');

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
