'use client';

import { sdk } from '@/lib/sdk';
import { isInIframe } from '@yodlpay/yapp-sdk';
import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

// Use TanStack Query to fetch user context
const useUserContextQuery = () => {
  return useQuery({
    queryKey: ['userContext'],
    queryFn: async () => {
      // Skip API call if running in an iframe
      if (!isInIframe()) {
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

// Create a context to provide the query result
const UserContext = createContext<ReturnType<typeof useUserContextQuery> | undefined>(undefined);

// Hook to use the context
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}

// Provider component
export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const queryResult = useUserContextQuery();
  return <UserContext.Provider value={queryResult}>{children}</UserContext.Provider>;
}
