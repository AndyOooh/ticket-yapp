import { Button, Flex, TextField, Text } from '@radix-ui/themes';

import { Dialog } from '@radix-ui/themes';

export const RequestStorageAccessModal = () => {
  async function requestStorageAccess(): Promise<boolean> {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const hasStorageAccessAPI =
      'hasStorageAccess' in document && 'requestStorageAccess' in document;

    if (!isSafari || !hasStorageAccessAPI) {
      console.log('🟡 Storage access not needed - not Safari or API not available');
      return true;
    }

    try {
      // Check basic security requirements
      console.log('🔹 Security checks:', {
        origin: window.location.origin,
        isSecureContext: window.isSecureContext,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
      });

      // Check if we already have access
      console.log('🔹 Checking current storage access...');
      const hasAccess = await document.hasStorageAccess();
      console.log('🔹 Current storage access:', hasAccess);

      if (hasAccess) {
        console.log('🟢 Already have storage access');
        return true;
      }

      // Request access
      console.log('🔹 Requesting storage access...');
      await document.requestStorageAccess();
      console.log('🟢 Storage access granted');
      return true;
    } catch (error) {
      console.error('🔴 Storage access request failed:', error);
      if (error instanceof Error) {
        console.error('🔴 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      return false;
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Edit profile</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root defaultValue="Freja Johnsen" placeholder="Enter your full name" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root defaultValue="freja@example.com" placeholder="Enter your email" />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
