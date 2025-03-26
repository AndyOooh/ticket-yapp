import './globals.css';
import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppLayout } from '../components/layout/AppLayout';
import { Theme } from '@radix-ui/themes';
import { ACCENT_COLOR } from '@/constants';
import { ToastProvider } from '@/providers/ToastProvider';
import { TanStackProvider } from '@/providers/TanStackProvider';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { BackgroundWrapper } from '@/components/layout/BackgroundProvider';
import { UserContextProvider } from '@/providers/UserContextProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Message Board Yapp',
  description: 'Message Board Yapp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TanStackProvider>
          <UserContextProvider>
            <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Theme
                accentColor={ACCENT_COLOR}
                hasBackground={false}
                panelBackground="translucent"
                radius="large"
              >
                <BackgroundWrapper>
                  <ToastProvider>
                    <AppLayout>{children}</AppLayout>
                  </ToastProvider>
                </BackgroundWrapper>
              </Theme>
            </NextThemeProvider>
          </UserContextProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
