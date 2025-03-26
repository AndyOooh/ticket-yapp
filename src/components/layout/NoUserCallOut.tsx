'use client';

import { useUserContext } from '@/providers/UserContextProvider';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout, Flex } from '@radix-ui/themes';

export const NoTokenCallOut = () => {
  const { userContext, isLoading } = useUserContext();

  if (userContext || isLoading) return null;

  return (
    <Callout.Root size="1" color="red">
      <Flex gap="2" align="center">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Token not found or not valid. Please connect through the Yodl app to create posts and
          comments.
        </Callout.Text>{' '}
      </Flex>
    </Callout.Root>
  );
};
