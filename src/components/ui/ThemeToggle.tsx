'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { IconButton, Skeleton } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { useState } from 'react';

export function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return (
      <Skeleton>
        <IconButton size="3" radius="full" />
      </Skeleton>
    );

  return (
    <IconButton
      size="3"
      radius="full"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
}
