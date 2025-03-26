'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { Box, Flex, Text } from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type ToastContextType = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: 'success' | 'error' | 'info';
      open: boolean;
    }>
  >([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, open: true }]);
    return id;
  }, []);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);

  const handleOpenChange = useCallback((open: boolean, id: string) => {
    if (!open) {
      setToasts((prev) =>
        prev.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)),
      );

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 300);
    }
  }, []);

  const getAccentColor = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      case 'info':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        {toasts.map(({ id, message, type, open }) => (
          <ToastPrimitive.Root
            key={id}
            open={open}
            onOpenChange={(open) => handleOpenChange(open, id)}
            duration={5000}
            className={`
              z-50 
              data-[state=open]:animate-slideIn
              data-[state=closed]:animate-slideOut
              data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
              data-[swipe=cancel]:translate-x-0
              data-[swipe=cancel]:transition-[transform_200ms_ease-out]
              data-[swipe=end]:animate-swipeOut
            `}
          >
            <Box
              className="rounded-md shadow-lg p-4"
              style={{
                backgroundColor: `var(--${getAccentColor(type)}-9)`,
                color: `var(--${getAccentColor(type)}-1)`,
                border: `1px solid var(--${getAccentColor(type)}-7)`,
              }}
            >
              <Flex gap="3" align="center" justify="between">
                <Text size="2" weight="medium">
                  {message}
                </Text>
                <ToastPrimitive.Close asChild>
                  <Box
                    className="rounded-full p-1 cursor-pointer hover:bg-black/10"
                    style={{ color: `var(--${getAccentColor(type)}-1)` }}
                  >
                    <Cross1Icon width={16} height={16} />
                  </Box>
                </ToastPrimitive.Close>
              </Flex>
            </Box>
          </ToastPrimitive.Root>
        ))}

        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full md:max-w-[420px] z-50" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
