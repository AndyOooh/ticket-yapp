'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import {
  Flex,
  Text,
  Heading,
  Card,
  Separator,
  Button,
  Link as RadixLink,
  Dialog,
} from '@radix-ui/themes';
import { truncateAddress } from '@/lib/utils';
import {  CrossCircledIcon } from '@radix-ui/react-icons';
import { TicketWithEvent } from '@/types';
import { QrCode } from './QrCode';
import { getChain } from '@yodlpay/tokenlists';

type TicketCardProps = {
  ticket: TicketWithEvent;
};

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const { createdAt, id, ownerAddress, ownerEns, txHash, chainId, event } = ticket;

  const explorerUrl = `${getChain(chainId!).explorerUrl}/tx/${txHash}`;

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex direction="column" align="center" py="2">
          <Text size="1" color="gray" weight="medium">
            {event.title}
          </Text>
          <Heading size="6" mt="1">
            TICKET #{id}
          </Heading>
        </Flex>

        <Separator size="4" />

        <Flex direction="column" gap="2">
          <Text size="2">
            <Text weight="bold">Issued to:</Text> {ownerEns ?? truncateAddress(ownerAddress)}
          </Text>

          <Flex align="center" gap="2">
            <Text size="2">
              <Text weight="bold">Issued on:</Text> {format(new Date(createdAt), 'PP')}
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <Text size="2">
              <Text weight="bold">Paid:</Text> {event.priceAmount?.toString()} {event.priceCurrency}
            </Text>
            {explorerUrl && (
              <>
                <RadixLink size="2" href={explorerUrl} target="_blank">
                  Explorer
                </RadixLink>
                <Separator orientation="vertical" />
                <RadixLink size="2" href={`https://yodl.me/tx/${txHash}`} target="_blank">
                  Yodl
                </RadixLink>
              </>
            )}
          </Flex>
        </Flex>

        <Separator size="4" />

        <Flex align="center" gap="2">
          <Text size="2">
            <Text weight="bold">Location:</Text> {event.location}
          </Text>
        </Flex>
        <Flex align="center" gap="2">
          <Text size="2">
            <Text weight="bold">Time:</Text> {format(new Date(event.eventTime), "PPP 'at' p")}
          </Text>
        </Flex>

        <Link href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
          <Button size="1" variant="soft" style={{ width: '100%' }}>
            Go to event
          </Button>
        </Link>

        <Separator size="4" />

        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="solid" size="3">
              Show QR Code
            </Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <Flex justify="between" align="start">
              <Dialog.Title>Ticket QR Code</Dialog.Title>
              <Dialog.Close>
                <CrossCircledIcon width="24" height="24" />
              </Dialog.Close>
            </Flex>
            <QrCode ticket={ticket} />
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Card>
  );
};
