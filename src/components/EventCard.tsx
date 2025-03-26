'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Flex, Text, Heading, Badge, Box, Avatar, Card, Separator } from '@radix-ui/themes';
import { TAGS } from '@/constants';
import { truncateAddress } from '@/lib/utils';
import {
  PersonIcon,
  LockOpen1Icon,
  AccessibilityIcon,
  DrawingPinIcon,
} from '@radix-ui/react-icons';
import { EventWithCount } from '@/types';

type EventCardProps = {
  event: EventWithCount;
};

export const EventCard = ({ event }: EventCardProps) => {
  const {
    creatorEns,
    creatorAddress,
    title,
    description,
    createdAt,
    tags,
    capacity,
    eventTime,
    id,
    location,
    priceAmount,
    priceCurrency,
    _count,
  } = event;

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Avatar fallback={creatorEns?.substring(0, 2) ?? <PersonIcon />} size="2" />
            <Text size="2" color="gray">
              {creatorEns ?? truncateAddress(creatorAddress)}
            </Text>
          </Flex>
          <Text size="1" color="gray" align="right">
            {formatDistanceToNow(new Date(eventTime), { addSuffix: true })}
          </Text>
        </Flex>

        <Link href={`/events/${id}`}>
          <Box>
            <Heading size="4">{title}</Heading>
            <Text color="gray" size="2" mb="2" className="line-clamp-2">
              {description}
            </Text>
          </Box>
        </Link>

        <Separator size="4" />

        <Flex justify="between" gap="2">
          {location && (
            <Flex align="center" gap="1">
              <DrawingPinIcon />
              <Text size="2" truncate>
                {location}
              </Text>
            </Flex>
          )}

          <Flex align="center" gap="1">
            <AccessibilityIcon />
            <Text size="2">{capacity ? `${_count.tickets} / ${capacity}` : 'Unlimited'}</Text>
          </Flex>

          <Flex align="center" gap="1">
            <LockOpen1Icon />
            <Text size="2">
              {priceAmount?.toString()} {priceCurrency}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="2" wrap="wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="soft" color={TAGS.find((t) => t.name === tag)?.color}>
              {tag}
            </Badge>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
};
