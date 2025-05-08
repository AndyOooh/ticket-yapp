'use server';

import { cookies } from 'next/headers';
import { generateNonce } from '@/lib/actions/nonce';

export async function setPlaceholderCookies() {
  console.log('🔹 Setting placeholder cookies...');
  const cookieStore = await cookies();

  const nonce = await generateNonce();

  const cookieNames = [
    // process.env.NODE_ENV === 'production'
    //   ? '__Secure-next-auth.session-token'
    //   : 'next-auth.session-token',
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
      sameSite: 'none',
      secure: true,
    });

    const cookie = cookieStore.get(name);
    console.log('🔹 Cookie:', name, cookie);

    const allCookies = cookieStore.getAll();
    console.log('🔹 All cookies:', allCookies);
  });
}
