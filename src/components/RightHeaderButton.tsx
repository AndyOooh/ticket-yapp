'use client';

import { useSession } from 'next-auth/react';
import { SiweSignInButton } from './SiweSignInButton';
import { UserButton } from './UserButton';

export const RightHeaderButton = () => {
  const { data: session } = useSession();

  if (!session || !session?.isVerified) {
    return <SiweSignInButton />;
  }

  return <UserButton />;
};
