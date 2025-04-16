import { EventList } from '@/components/EventList';
import { getEvents } from '@/lib/services/event';
import { Flex, Heading, Section } from '@radix-ui/themes';
import { getServerAuthSession } from '@/lib/auth';
import { InfoBox } from '@/components/ui/InfoBox';

export default async function EventsPage() {
  const session = await getServerAuthSession();

  const initialEvents = session?.address
    ? await getEvents({ limit: 10, creatorAddress: session.address })
    : [];

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">My Events</Heading>

      {session?.address ? (
        <EventList initialEvents={initialEvents} />
      ) : (
        <Section>
          <InfoBox>Please sign in to view your events</InfoBox>
        </Section>
      )}
    </Flex>
  );
}
