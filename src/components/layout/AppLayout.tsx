import { Container, Flex } from '@radix-ui/themes';
import { Header } from './Header';
import { NoTokenCallOut } from './NoUserCallOut';

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Container size="1">
        <Header />
        <Flex direction="column" minHeight="100vh">
          <main className="mb-16 px-4">
            <NoTokenCallOut />
            {children}
          </main>
        </Flex>
      </Container>
    </>
  );
}
