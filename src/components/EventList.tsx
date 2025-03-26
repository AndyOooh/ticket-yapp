'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useInView } from 'react-intersection-observer';
import { EventCard } from '@/components/EventCard';
import { EventWithCount } from '@/types';

type EventListProps = {
  initialEvents: EventWithCount[];
};

export const EventList = ({ initialEvents }: EventListProps) => {
  const [events, setEvents] = useState<EventWithCount[]>(initialEvents);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    const loadMoreEvents = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        try {
          const nextPage = page + 1;
          const response = await fetch(`/api/events?page=${nextPage}&limit=10`);

          if (!response.ok) {
            throw new Error('Failed to fetch more events');
          }

          const newEvents = await response.json();

          if (newEvents.length === 0) {
            setHasMore(false);
          } else {
            setEvents((prevEvents) => [...prevEvents, ...newEvents]);
            setPage(nextPage);
          }
        } catch (error) {
          console.error('Error loading more events:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMoreEvents();
  }, [inView, hasMore, loading, page]);

  if (events.length === 0) {
    return (
      <Box py="6">
        <Text size="3" align="center">
          No events found.
        </Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {hasMore && (
        <Box ref={ref} py="4">
          {loading ? (
            <Text size="2">Loading more events...</Text>
          ) : (
            <Text size="2">Scroll for more</Text>
          )}
        </Box>
      )}
    </Flex>
  );
};
