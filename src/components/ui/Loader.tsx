import { Flex, Spinner } from '@radix-ui/themes';

export function FullScreenLoader() {
  return (
    <Flex justify="center" align="center" minHeight="90vh" width="100%">
      <Spinner />
    </Flex>
  );
}
