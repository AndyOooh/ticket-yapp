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

    cookieStore.set(name, value, {
      path: '/',
      sameSite: 'lax',
      secure: true,
    });
  });
}
