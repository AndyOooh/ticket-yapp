'use client';

import { sdk } from '@/lib/sdk';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext as UserContextType } from '@yodlpay/yapp-sdk';

type UserContextWithLoading = {
  userContext: UserContextType | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextWithLoading | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userContext, setUserContext] = useState<UserContextType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserContext = async () => {
      try {
        setIsLoading(true);
        const context = await sdk.getUserContext();
        setUserContext(context);
      } catch (error) {
        console.error('Failed to fetch user context:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserContext();
  }, []);

  return <UserContext.Provider value={{ userContext, isLoading }}>{children}</UserContext.Provider>;
}
