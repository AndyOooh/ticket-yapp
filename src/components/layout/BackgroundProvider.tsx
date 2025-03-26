import { Box, Container } from '@radix-ui/themes';

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Container size="2" py="4" px="4" className="bg-[var(--accent-2)]">
      <Box className="bg-[var(--accent-4)] rounded-3xl">{children}</Box>
    </Container>
  );
}
