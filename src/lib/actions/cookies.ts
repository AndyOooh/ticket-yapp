'use server';

import { cookies } from 'next/headers';

export async function setPlaceholderCookies() {
  const cookieStore = await cookies();

  const cookieNames = [
    process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
    process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.csrf-token'
      : 'next-auth.csrf-token',
    process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.callback-url'
      : 'next-auth.callback-url',
  ];

  cookieNames.forEach((name) => {
    const value = name.includes('callback-url')
      ? process.env.NEXT_PUBLIC_YAPP_URL || 'http://localhost:3001'
      : 'placeholder';

    const sameSite = Math.random() > 0.5 ? 'lax' : 'none';

    try {
      cookieStore.set(name, value, {
        path: '/',
        sameSite,
        secure: true,
      });
    } catch (error) {
      console.error('❌ Failed to set cookie:', name, sameSite, value, error);
    }
  });
}
