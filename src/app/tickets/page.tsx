import { MyTicketList } from '@/components/TicketList';
import { Flex, Heading } from '@radix-ui/themes';

export default function TicketsPage() {
  return (
    <Flex direction="column" gap="4">
      <Heading size="6">My Tickets</Heading>
      <MyTicketList />
    </Flex>
  );
}
