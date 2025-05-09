'use client';

import {
  Button,
  Code,
  DropdownMenu,
  Flex,
  IconButton,
  Link,
  Skeleton,
  Text,
} from '@radix-ui/themes';
import Image from 'next/image';
import { MdOutlinePersonOff, MdOutlinePersonOutline } from 'react-icons/md';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import { useUserContext } from '@/providers/UserContextProvider';
import { truncateAddress } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';

const socials = [
  {
    label: 'AndyOooh/ticket-yapp',
    href: 'https://github.com/AndyOooh/ticket-yapp',
    icon: FaGithub,
  },
  {
    label: '@yodlpay',
    href: 'https://x.com/yodlpay',
    icon: FaTwitter,
  },
];

export const UserButton = () => {
  const { data: userContext, isLoading } = useUserContext();
  const ensAvatar = null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {isLoading ? (
          <Skeleton>
            <IconButton size="3" radius="full" />
          </Skeleton>
        ) : (
          <IconButton size="3" variant="soft" radius="full">
            {userContext ? (
              ensAvatar ? (
                <Image src={ensAvatar} alt="Account avatar" width={24} height={24} />
              ) : (
                <MdOutlinePersonOutline />
              )
            ) : (
              <MdOutlinePersonOff />
            )}
          </IconButton>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {userContext ? (
          <>
            <DropdownMenu.Label>User</DropdownMenu.Label>
            <DropdownMenu.Item>
              Address:
              <Code>{truncateAddress(userContext.address)}</Code>
            </DropdownMenu.Item>

            {userContext.primaryEnsName && (
              <DropdownMenu.Item>
                ENS:
                <Code>{userContext.primaryEnsName}</Code>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item>
              <Button size="1" variant="solid" onClick={() => signOut()}>
                Sign Out
              </Button>
            </DropdownMenu.Item>
            <DropdownMenu.Label>Pages</DropdownMenu.Label>
            <DropdownMenu.Item>
              <Link href="/events">My Events</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Link href="/tickets">My Tickets</Link>
            </DropdownMenu.Item>

            {userContext.community && (
              <>
                <DropdownMenu.Label>Community</DropdownMenu.Label>
                <DropdownMenu.Item>
                  Address:
                  <Code>{truncateAddress(userContext.community.address)}</Code>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  Name:
                  <Code>{userContext.community.ensName}</Code>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  User ENS:
                  <Code>{userContext.community.userEnsName}</Code>
                </DropdownMenu.Item>
              </>
            )}

            <DropdownMenu.Separator />
            <DropdownMenu.Label>Connect</DropdownMenu.Label>
            {socials.map((social) => (
              <DropdownMenu.Item key={social.label}>
                <Link href={social.href} target="_blank">
                  <Flex align="center" gap="2">
                    <social.icon size={16} />
                    <Text>{social.label}</Text>
                  </Flex>
                </Link>
              </DropdownMenu.Item>
            ))}
          </>
        ) : (
          <DropdownMenu.Item>Please open the YAPP through the Yodl super app.</DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
