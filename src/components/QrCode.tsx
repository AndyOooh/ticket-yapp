import { ACCENT_COLOR } from '@/constants';
import { Cuer } from 'cuer';
import Image from 'next/image';

export const QrCode = () => {
  return (
    <Cuer.Root value="https://wevm.dev" className="rounded-lg">
      <Cuer.Finder fill="var(--accent-8)" radius={0} />
      <Cuer.Cells fill="var(--accent-5)" radius={0} />
      <Cuer.Arena>
        <Image
          src="https://example.com/logo.png"
          alt="logo"
          width={100}
          height={100}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Cuer.Arena>
    </Cuer.Root>
  );
};
