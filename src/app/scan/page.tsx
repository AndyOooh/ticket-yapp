'use client';

import { AspectRatio, Button, Callout, Flex, Skeleton, Spinner, Text } from '@radix-ui/themes';
import { Scanner } from '@yudiel/react-qr-scanner';
// import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { InfoCircledIcon } from '@radix-ui/react-icons';
// import { safeWindow } from '@frontend/utils/safeWindow';

type ValidateTicketParams = {
  ticketId: string;
  token: string;
};

export default function ScanPage() {
  const [isQrAccessLoading, setIsQrAccessLoading] = useState(false);
  const [qrCodeError, setQrCodeError] = useState<string | null>(null);
  const [isAllowedToScan, setIsAllowedToScan] = useState(false);

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: async ({ ticketId, token }: ValidateTicketParams) => {
      const response = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, token }),
      });
      if (!response.ok) throw new Error('Validation request failed');
      return response.json();
    },
  });
  console.log('🚀 data:', data);

  const requestCameraAccess = useCallback(async () => {
    setIsQrAccessLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          //   facingMode: { exact: 'environment' },
          facingMode: 'environment',
        },
      });

      // Stop the stream immediately as we just need to check access
      stream.getTracks().forEach((track) => track.stop());

      setIsAllowedToScan(true);
    } catch (error) {
      console.error('Camera access error:', error);
      setIsAllowedToScan(false);
    }
    setIsQrAccessLoading(false);
  }, []);

  useEffect(() => {
    requestCameraAccess();
    return () => {
      setIsAllowedToScan(false);
    };
  }, [requestCameraAccess]);

  // Reset the mutation when needed
  const resetScan = () => {
    reset();
    setQrCodeError(null);
  };

  return isPending ? (
    <Flex mt="9" direction="column" gap="4" align="center">
      <Spinner />
      <Text>Validating ticket...</Text>
    </Flex>
  ) : isError ? (
    <Flex mt="9" direction="column" gap="4" align="center">
      <Text color="red">Error validating ticket: {error.message || 'Unknown error'}</Text>
      <Button onClick={resetScan}>Scan Another</Button>
    </Flex>
  ) : qrCodeError ? (
    <Flex mt="9" direction="column" gap="4" align="center">
      <Text color="red">{qrCodeError}</Text>
      <Button onClick={resetScan}>Scan Another</Button>
    </Flex>
  ) : data ? (
    <Flex mt="9" direction="column" gap="4" align="center">
      <Callout.Root color={data.valid ? 'green' : 'red'}>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          {data.message}
        </Callout.Text>
      </Callout.Root>

      <Button onClick={resetScan}>Scan Another</Button>
    </Flex>
  ) : (
    <Flex mt="9" direction="column" gap="4" align="center">
      <AspectRatio ratio={1} className="rounded-3xl overflow-hidden">
        {isAllowedToScan && !isPending && !data ? (
          <Scanner
            onScan={(result) => {
              if (Array.isArray(result) && result.length > 0) {
                const url = result[0].rawValue;
                setQrCodeError(null);

                try {
                  // Parse the URL
                  const urlObj = new URL(url);

                  // Extract ticketId and token
                  const ticketId = urlObj.searchParams.get('ticketId');
                  const token = urlObj.searchParams.get('token');

                  if (!ticketId || !token) {
                    setQrCodeError('Invalid QR code: Missing ticket information');
                    return;
                  }

                  // Trigger the mutation
                  mutate({ ticketId, token });
                } catch (error) {
                  console.log('🚀 error:', error);
                  console.error('URL parsing error:', error);
                  setQrCodeError('Invalid URL format');
                }
              }
            }}
            onError={(error) => {
              if (error instanceof Error) {
                setQrCodeError(error.message);
              } else {
                setQrCodeError('An unknown error occurred');
              }
              setIsQrAccessLoading(false);
              setIsAllowedToScan(false);
            }}
            constraints={{ facingMode: 'environment' }}
            components={{ audio: false }}
          />
        ) : (
          <Flex justify="center" align="center" className="w-full h-full">
            <Skeleton className="w-3/4 h-3/4" />
          </Flex>
        )}
      </AspectRatio>

      {!isAllowedToScan ? (
        <Button radius="full" loading={isQrAccessLoading} onClick={requestCameraAccess}>
          Request Camera Access
        </Button>
      ) : (
        <Text>Scan ticket QR</Text>
      )}
    </Flex>
  );
}
