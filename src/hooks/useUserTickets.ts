import { useQuery } from '@tanstack/react-query';
import { TicketWithEvent } from '@/types';
import { useSession } from 'next-auth/react';

type UseUserTicketsOptions = {
  limit?: number;
  offset?: number;
};

const fetchUserTickets = async ({
  limit = 10,
  offset = 0,
}: UseUserTicketsOptions): Promise<TicketWithEvent[]> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`/api/tickets?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    // If unauthorized, return empty array (user not logged in)
    if (response.status === 401) {
      return [];
    }

    throw new Error(errorData?.error || 'Failed to fetch tickets');
  }

  return response.json();
};

export function useUserTickets({ limit, offset }: UseUserTicketsOptions = {}) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return useQuery({
    queryKey: ['userTickets', limit, offset],
    queryFn: () => fetchUserTickets({ limit, offset }),
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 minute
  });
}
