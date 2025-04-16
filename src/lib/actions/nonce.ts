'use server';

import { cookies } from 'next/headers';
import { generateSiweNonce } from 'viem/siwe';

/**
 * Generates a new SIWE nonce and stores it in a cookie
 *
 * This server action simply returns a nonce for SIWE authentication
 * The client will store and handle the nonce
 *
 * @returns The generated nonce
 */
export async function generateNonce(): Promise<string> {
  const nonce = generateSiweNonce();
  console.log('🟢 Generated nonce:', nonce);

  // Store nonce in cookie with settings that work in development
  const cookieStore = await cookies();
  cookieStore.set('siwe-nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  });

  return nonce;
}

/**
 * Verifies the nonce from a SIWE message against the stored nonce
 *
 * @param messageNonce The nonce from the SIWE message
 * @returns True if the nonce is valid, false otherwise
 */
export async function verifyNonce(messageNonce: string): Promise<boolean> {
  try {
    console.log('🚀 Verifying nonce:', messageNonce);
    const cookieStore = await cookies();

    // Debug all cookies to see what's available
    const allCookies = cookieStore.getAll();
    console.log(
      '🚀 All cookies:',
      allCookies.map((c) => c.name)
    );

    const storedNonce = cookieStore.get('siwe-nonce')?.value;
    console.log('🚀 Stored nonce:', storedNonce);

    // No nonce stored or doesn't match
    if (!storedNonce || storedNonce !== messageNonce) {
      console.log('🔴 Nonce verification failed. Expected:', storedNonce, 'Got:', messageNonce);
      return false;
    }

    // Clear the nonce cookie
    cookieStore.delete('siwe-nonce');
    console.log('🟢 Nonce verified successfully');
    return true;
  } catch (error) {
    console.error('🔴 Error verifying nonce:', error);
    return false;
  }
}
