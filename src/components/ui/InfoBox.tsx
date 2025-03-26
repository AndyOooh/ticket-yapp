'use client';

import { ACCENT_COLOR } from '@/constants';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout, Flex } from '@radix-ui/themes';
import { ReactNode } from 'react';

type InfoBoxProps = {
  children: ReactNode;
  icon?: ReactNode;
  size?: '1' | '2' | '3';
  color?: 'teal' | 'gray' | 'red' | 'iris';
};

export function InfoBox({
  children,
  icon = <InfoCircledIcon />,
  size = '1',
  color = ACCENT_COLOR,
}: InfoBoxProps) {
  return (
    <Callout.Root size={size} color={color}>
      <Flex align="center" gap="2">
        <Callout.Icon>{icon}</Callout.Icon>
        <Callout.Text size={size}>{children}</Callout.Text>
      </Flex>
    </Callout.Root>
  );
}
