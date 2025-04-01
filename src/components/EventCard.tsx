'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Flex, Text, Heading, Badge, Box, Avatar, Card, Separator, Button } from '@radix-ui/themes';
import { TAGS } from '@/constants';
import { truncateAddress } from '@/lib/utils';
import {
  PersonIcon,
  LockOpen1Icon,
  AccessibilityIcon,
  DrawingPinIcon,
} from '@radix-ui/react-icons';
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

  const { data: userContext } = useUserContext();

  const { mutateAsync: buyTicket } = useBuyTicket();

  const handleBuyTicket = async () => {
    console.log('🚀 handleBuyTicket:');

    try {
      // const res = await buyTicket({
      //   eventId: id,
      //   ownerAddress: userContext?.address as Address,
      //   ownerEns: userContext?.primaryEnsName,
      //   priceAmount,
      //   priceCurrency: priceCurrency as FiatCurrencyString,
      //   eventTitle: title,
      // });

      const res = {
        id: 12,
        eventId: 2,
        ownerEns: 'andy.yodl.eth',
        ownerAddress: '0x250189C0Af7c0f4CD7871c9a20826eAee4c0a50c',
        txHash: '0x83ae20b3760d8ddfa5180923ec5efbeba257684a7c79eedf0400681524ae1a7e',
        chainId: 8453,
        paid: true,
        validationToken: 'c4bd7acc5ac9206c74879441220d35be',
        redeemed: false,
        createdAt: '2025-04-01T10:37:20.396Z',
        updatedAt: '2025-04-01T10:37:52.818Z',
        event: {
          id: 2,
          creatorEns: 'andy.yodl.eth',
          creatorAddress: '0x250189C0Af7c0f4CD7871c9a20826eAee4c0a50c',
          title: 'NFT Art Exhibition',
          description:
            'Explore digital art in the metaverse. This virtual exhibition showcases works from top NFT artists and offers interactive experiences.',
          eventTime: '2025-04-15T08:36:29.640Z',
          location: 'Virtual - Metaverse Gallery',
          capacity: 100,
          priceAmount: 0.02,
          priceCurrency: 'USD',
          tags: ['nft', 'art', 'metaverse', 'digital'],
          createdAt: '2025-03-22T08:36:29.640Z',
          updatedAt: '2025-03-22T08:36:29.640Z',
        },
      };

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
