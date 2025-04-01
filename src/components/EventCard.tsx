'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Flex, Text, Heading, Badge, Box, Avatar, Card, Separator, Button } from '@radix-ui/themes';
import { TAGS } from '@/constants';
import { truncateAddress } from '@/lib/utils';
import { PersonIcon, AccessibilityIcon, DrawingPinIcon } from '@radix-ui/react-icons';
import { PiMoneyLight } from 'react-icons/pi';
import { EventWithCount } from '@/types';
import { FiatCurrencyString } from '@yodlpay/yapp-sdk';
import { useBuyTicket } from '@/hooks/useBuyTicket';
import { useUserContext } from '@/providers/UserContextProvider';
import { useToast } from '@/providers/ToastProvider';
import { Address } from 'viem';

type EventCardProps = {
  event: EventWithCount;
};

export const EventCard = ({ event }: EventCardProps) => {
  const router = useRouter();
  const { success } = useToast();
  const {
    creatorEns,
    creatorAddress,
    title,
    description,
    tags,
    capacity,
    eventTime,
    id,
    location,
    priceAmount,
    priceCurrency,
    _count,
  } = event;

  const { data: userContext } = useUserContext();

  const { mutateAsync: buyTicket } = useBuyTicket();

  const handleBuyTicket = async () => {
    try {
      const res = await buyTicket({
        eventId: id,
        ownerAddress: userContext?.address as Address,
        ownerEns: userContext?.primaryEnsName,
        priceAmount,
        priceCurrency: priceCurrency as FiatCurrencyString,
        eventTitle: title,
      });

      success(
        `Successfully purchased ticket for "${res.event.title}"! Transaction: ${truncateAddress(
          res.txHash
        )}`
      );
      router.push('/tickets', { scroll: false });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to buy ticket:', error);
    }
  };

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
          <Flex align="center" gap="2">
            <Text size="1" color="gray" align="right">
              {formatDistanceToNow(new Date(eventTime), { addSuffix: true })}
            </Text>
            <Button size="1" variant="outline" onClick={handleBuyTicket}>
              Buy Ticket
            </Button>
          </Flex>
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

        <Flex justify="between" gap="4" wrap="wrap">
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
            {/* <LockOpen1Icon /> */}
            <PiMoneyLight />

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
