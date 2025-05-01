'use client';

import { Button } from '@radix-ui/themes';
import { useState } from 'react';

export const StorageAccessButton = () => {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    setError(null);
    if ('requestStorageAccess' in document) {
      try {
        await (document as any).requestStorageAccess();
        setGranted(true);
      } catch (err) {
        setGranted(false);
        setError((err as Error).message);
      }
    } else {
      setError('Storage Access API not supported in this browser.');
    }
  };

  return (
    <>
      <Button onClick={handleRequest}>Request Storage Access</Button>
      {granted === true && <span style={{ color: 'green', marginLeft: 12 }}>Access granted!</span>}
      {granted === false && <span style={{ color: 'red', marginLeft: 12 }}>Access denied.</span>}
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </>
  );
};
