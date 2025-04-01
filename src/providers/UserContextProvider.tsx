'use client';

import { sdk } from '@/lib/sdk';
import { isInIframe, type UserContext } from '@yodlpay/yapp-sdk';
import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

const mockUserContext: UserContext = {
  address: '0x3BEC0A9CeCAd6315860067325c603861adf740b5' as Hex,
  primaryEnsName: 'andyoee.yodl.eth',
  community: {
    address: '0x5A3598303ab723E557F577d40739062abD79d166' as Hex,
    ensName: 'community.yodl.eth',
    userEnsName: 'andyoee.community.yodl.eth',
  },
};

const useUserContextQuery = () => {
  return useQuery({
    queryKey: ['userContext'],
    queryFn: async () => {
      // Skip API call if running in an iframe
      if (!isInIframe()) {
        if (process.env.NODE_ENV === 'development') {
          return mockUserContext;
        }
        console.log('Not in iframe, skipping user context fetch');
        return null;
      }

      try {
        return await sdk.getUserContext();
      } catch (error) {
        console.error('Failed to fetch user context:', error);
        return null;
      }
    },
  });
};

const UserContext1 = createContext<ReturnType<typeof useUserContextQuery> | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext1);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const queryResult = useUserContextQuery();
  return <UserContext1.Provider value={queryResult}>{children}</UserContext1.Provider>;
}
