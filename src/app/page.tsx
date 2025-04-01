export const dynamic = 'force-dynamic';

import { Heading, Container, Text, Flex, IconButton } from '@radix-ui/themes';
import { getEvents } from '@/lib/services/event';
import { EventList } from '@/components/EventList';
import { BOARD_SUB_TITLE, BOARD_TITLE } from '@/constants';
import { PlusIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';

export default async function Home() {
  const initialEvents = await getEvents({ limit: 10 });

  return (
    <main>
      <Container size="3" mt="4">
        <Flex justify="between" align="center">
          <Heading size="6">{BOARD_TITLE}</Heading>
          <NextLink href="/events/create" passHref className="bg-gray-400 rounded-full">
            <IconButton size="2" radius="full">
              <PlusIcon />
            </IconButton>
          </NextLink>
        </Flex>
        <Text as="p" mb="3" color="gray">
          {BOARD_SUB_TITLE}
        </Text>
        <EventList initialEvents={initialEvents || []} />
      </Container>
    </main>
  );
}
