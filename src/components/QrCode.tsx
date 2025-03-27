import { YAPP_URL } from '@/constants';
import { TicketWithEvent } from '@/types';
import { Cuer } from 'cuer';
import Image from 'next/image';

type QrCodeProps = {
  ticket: TicketWithEvent;
};

export const QrCode = ({ ticket }: QrCodeProps) => {
  const url = `${YAPP_URL}/api/tickets/validate?ticketId=${ticket.id}&token=${ticket.validationToken}`;

  return (
    <Cuer.Root value={url} className="rounded-lg">
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
