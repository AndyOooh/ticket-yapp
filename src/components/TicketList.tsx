'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useInView } from 'react-intersection-observer';
import { TicketCard } from './TicketCard';
import { useUserContext } from '@/providers/UserContextProvider';
import { useUserTickets } from '@/hooks/useUserTickets';

export const TicketList = () => {
  const { data: userContext, isLoading: isUserLoading } = useUserContext();
  const ownerAddress = userContext?.address;
  // const ownerAddress = '0x3BEC0A9CeCAd6315860067325c603861adf740b5';

  const [page, setPage] = useState(1);
  const offset = (page - 1) * 10; // Using default limit of 10

  // Use the hook with just the necessary parameters
  const {
    data: tickets = [],
    isLoading: isTicketsLoading,
    isFetching,
    error,
  } = useUserTickets({
    ownerAddress,
    offset,
  });

  // Mock data
  // const tickets: any[] = [];
  // const isFetching = false;
  // const isTicketsLoading = false;
  // const error = null;

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Assuming we get 10 tickets when there are more (default limit)
  const hasMore = tickets.length === 10;

  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore, isFetching]);

  // User loading state
  if (isUserLoading) {
    return (
      <Box py="6">
        <Text size="3" align="center">
          Loading user information...
        </Text>
      </Box>
    );
  }

  // Not connected state
  if (!ownerAddress) {
    return (
      <Box py="6">
        <Text size="3" align="center">
          Please connect your wallet to view your tickets.
        </Text>
      </Box>
    );
  }

  // Tickets loading state
  if (isTicketsLoading) {
    return (
      <Box py="6">
        <Text size="3" align="center">
          Loading your tickets...
        </Text>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box py="6">
        <Text size="3" align="center" color="red">
          Error loading tickets
        </Text>
      </Box>
    );
  }

  // Empty state
  if (tickets.length === 0) {
    return (
      <Box py="6">
        <Text size="3" align="center">
          You don&apos;t have any tickets yet.
        </Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}

      {hasMore && (
        <Box ref={ref} py="4">
          {isFetching ? (
            <Text size="2" align="center">
              Loading more tickets...
            </Text>
          ) : (
            <Text size="2" align="center">
              Scroll for more
            </Text>
          )}
        </Box>
      )}
    </Flex>
  );
};
