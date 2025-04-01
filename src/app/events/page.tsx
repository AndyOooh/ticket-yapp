import { EventList } from '@/components/EventList';
import { getEvents } from '@/lib/services/event';
import { Flex, Heading } from '@radix-ui/themes';

export default async function EventsPage() {
  const initialEvents = await getEvents({ limit: 10 });

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">My Events</Heading>
      <EventList initialEvents={initialEvents || []} />
    </Flex>
  );
}
