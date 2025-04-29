'use client';

import { useEffect, useState } from 'react';

export const StorageAccessTest = () => {
  const [apiStatus, setApiStatus] = useState<{
    hasStorageAccess: boolean;
    hasRequestStorageAccess: boolean;
    isSafari: boolean;
    currentAccess: boolean | null;
  }>({
    hasStorageAccess: false,
    hasRequestStorageAccess: false,
    isSafari: false,
    currentAccess: null,
  });

  useEffect(() => {
    const checkStorageAccess = async () => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      try {
        const hasAccess = await document.hasStorageAccess?.();
        console.log('🟢 Storage Access API Test:', {
          isSafari,
          hasStorageAccess: 'hasStorageAccess' in document,
          hasRequestStorageAccess: 'requestStorageAccess' in document,
          currentAccess: hasAccess,
        });

        setApiStatus({
          hasStorageAccess: 'hasStorageAccess' in document,
          hasRequestStorageAccess: 'requestStorageAccess' in document,
          isSafari,
          currentAccess: hasAccess,
        });
      } catch (error) {
        console.error('🔴 Storage Access API Test Error:', error);
      }
    };

    checkStorageAccess();
  }, []);

  return (
    <div style={{ padding: '1rem', background: '#f5f5f5', margin: '1rem 0' }}>
      <h3>Storage Access API Test</h3>
      <pre>{JSON.stringify(apiStatus, null, 2)}</pre>
    </div>
  );
};
