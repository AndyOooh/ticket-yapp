import { Flex, IconButton, Link } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import Image from 'next/image';
import { YodlButton } from './YodlButton';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
  return (
    <Flex py="4" px="4" justify="between" align="center" gap="1">
      <Flex align="center" gap="2" className="flex-1">
        <ThemeToggle />
      </Flex>
      <Link href="/">
        <Image src="/yodl-logo.png" alt="logo" width={52} height={52} className="rounded-full" />
      </Link>
      <Flex gap="2" align="center" justify="end" className="flex-1">
        <NextLink href="/create" passHref className="bg-gray-400 rounded-full">
          <IconButton size="3" radius="full">
            <PlusIcon />
          </IconButton>
        </NextLink>
        <YodlButton />
      </Flex>
    </Flex>
  );
}
