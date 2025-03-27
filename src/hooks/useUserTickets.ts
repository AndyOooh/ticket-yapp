import { useQuery } from '@tanstack/react-query';
import { TicketWithEvent } from '@/types';
import { Address } from 'viem';

type UseUserTicketsOptions = {
  ownerAddress?: Address;
  limit?: number;
  offset?: number;
  enabled?: boolean;
};

const fetchUserTickets = async ({
  ownerAddress,
  limit = 10,
  offset = 0,
}: Omit<UseUserTicketsOptions, 'enabled'>): Promise<TicketWithEvent[]> => {
  if (!ownerAddress) return [];

  const params = new URLSearchParams({
    ownerAddress: ownerAddress.toString(),
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await fetch(`/api/tickets?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }

  return response.json();
};

export function useUserTickets({
  ownerAddress,
  limit,
  offset,
  enabled = !!ownerAddress,
}: UseUserTicketsOptions = {}) {
  return useQuery({
    queryKey: ['userTickets', ownerAddress, limit, offset],
    queryFn: () => fetchUserTickets({ ownerAddress, limit, offset }),
    enabled,
  });
}
