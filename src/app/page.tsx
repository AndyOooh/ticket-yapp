export const dynamic = 'force-dynamic';

import { Heading, Container, Text } from '@radix-ui/themes';
import { getEvents } from '@/lib/services/event';
import { EventList } from '@/components/EventList';
import { BOARD_SUB_TITLE, BOARD_TITLE } from '@/constants';

export default async function Home() {
  const initialEvents = await getEvents({ limit: 10 });

  return (
    <main>
      <Container size="3" mt="4">
        <Heading size="6">{BOARD_TITLE}</Heading>
        <Text as="p" mb="3" color="gray">
          {BOARD_SUB_TITLE}
        </Text>
        <EventList initialEvents={initialEvents || []} />
      </Container>
    </main>
  );
}
