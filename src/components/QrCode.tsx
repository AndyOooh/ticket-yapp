import { TicketWithEvent } from '@/types';
import { Cuer } from 'cuer';
import Image from 'next/image';

type QrCodeProps = {
  ticket: TicketWithEvent;
};

export const QrCode = ({ ticket }: QrCodeProps) => {
  const url = `${process.env.NEXT_PUBLIC_YAPP_URL}/api/tickets/validate?ticketId=${ticket.id}&token=${ticket.validationToken}`;

  return (
    <Cuer.Root value={url} className="rounded-lg">
      <Cuer.Finder fill="var(--accent-8)" radius={0} />
      <Cuer.Cells fill="var(--accent-5)" radius={1} />
      <Cuer.Arena>
        <Image
          src="https://cdn.justaname.id/avatar/alecity.eth-20250319133905.png"
          alt="logo"
          width={100}
          height={100}
        />
      </Cuer.Arena>
    </Cuer.Root>
  );
};
