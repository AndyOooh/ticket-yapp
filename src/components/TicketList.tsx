'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Section, Text } from '@radix-ui/themes';
import { useInView } from 'react-intersection-observer';
import { TicketCard } from './TicketCard';
import { useSession } from 'next-auth/react';
import { useUserTickets } from '@/hooks/useUserTickets';
import { InfoBox } from './ui/InfoBox';

export const MyTicketList = () => {
  const { status: sessionStatus } = useSession();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * 10; // Using default limit of 10

  // Use the simplified hook
  const {
    data: tickets = [],
    isLoading: isTicketsLoading,
    isFetching,
    error,
  } = useUserTickets({
    offset,
  });

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

  // Authentication loading state
  if (sessionStatus === 'loading') {
    return (
      <Section>
        <InfoBox>Loading user information...</InfoBox>
      </Section>
    );
  }

  // Not authenticated state
  if (sessionStatus === 'unauthenticated') {
    return (
      <Section>
        <InfoBox>Please sign in to view your tickets</InfoBox>
      </Section>
    );
  }

  // Tickets loading state
  if (isTicketsLoading) {
    return (
      <Section>
        <InfoBox>Loading your tickets...</InfoBox>
      </Section>
    );
  }

  // Error state
  if (error) {
    return (
      <Section>
        <InfoBox>Error loading tickets</InfoBox>
      </Section>
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
          {isFetching && (
            <Text size="2" align="center">
              Loading more tickets...
            </Text>
          )}
        </Box>
      )}
    </Flex>
  );
};
