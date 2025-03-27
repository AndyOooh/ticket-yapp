'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Flex, Text, Heading, Badge, Box, Avatar, Card, Separator } from '@radix-ui/themes';
import { TAGS } from '@/constants';
import { truncateAddress } from '@/lib/utils';
import { PersonIcon, LockOpen1Icon, DrawingPinIcon } from '@radix-ui/react-icons';
import { TicketWithEvent } from '@/types';
import { QrCode } from './QrCode';

type TicketCardProps = {
  ticket: TicketWithEvent;
};

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const { createdAt, eventId, id, ownerAddress, ownerEns, paid, txHash, updatedAt, event } = ticket;

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Avatar fallback={event.creatorEns?.substring(0, 2) ?? <PersonIcon />} size="2" />
            <Text size="2" color="gray">
              {event.creatorEns ?? truncateAddress(event.creatorAddress)}
            </Text>
          </Flex>
          <Text size="1" color="gray" align="right">
            {formatDistanceToNow(new Date(event.eventTime), { addSuffix: true })}
          </Text>
        </Flex>

        <Link href={`/tickets/${id}`}>
          <Box>
            <Heading size="4">{event.title}</Heading>
            <Text color="gray" size="2" mb="2" className="line-clamp-2">
              {event.description}
            </Text>
          </Box>
        </Link>

        <Separator size="4" />

        <Flex justify="between" gap="2">
          {location && (
            <Flex align="center" gap="1">
              <DrawingPinIcon />
              <Text size="2" truncate>
                {event.location}
              </Text>
            </Flex>
          )}

          {/* <Flex align="center" gap="1">
            <AccessibilityIcon />
            <Text size="2">
              {event.capacity ? `${event._count.tickets} / ${event.capacity}` : 'Unlimited'}
            </Text>
          </Flex> */}

          <Flex align="center" gap="1">
            <LockOpen1Icon />
            <Text size="2">
              {event.priceAmount?.toString()} {event.priceCurrency}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="2" wrap="wrap">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="soft" color={TAGS.find((t) => t.name === tag)?.color}>
              {tag}
            </Badge>
          ))}
        </Flex>

        <Separator size="4" />

        <Flex width="90%" height="90%" p="4" justify="center" align="center" mx="auto">
          <QrCode ticket={ticket} />
        </Flex>
      </Flex>
    </Card>
  );
};
