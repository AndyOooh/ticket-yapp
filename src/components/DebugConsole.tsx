'use client';

import { useEffect } from 'react';

/**
 * DebugConsole component that loads vConsole for mobile debugging
 * Only loads in development or when explicitly enabled
 */
export function DebugConsole() {
  useEffect(() => {
    // Only load in development or when explicitly enabled
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_DEBUG_CONSOLE === 'true'
    ) {
      // Dynamically import vConsole
      import('vconsole').then(({ default: VConsole }) => {
        new VConsole();
        console.log('🔍 Debug console enabled');
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
