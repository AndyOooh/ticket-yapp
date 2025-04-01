import { getPayment } from '@/lib/services/indexerApi';
import * as TicketService from '@/lib/services/ticket';
import { verifyPayment } from '@/lib/utils';
import { FiatCurrencyString } from '@yodlpay/yapp-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { Address } from 'viem';

type RouteParams = { params: Promise<{ ticketId: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { ticketId } = await params;
    const ticketIdInt = parseInt(ticketId);
    const { txHash, chainId } = await request.json();

    if (isNaN(ticketIdInt))
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    if (!txHash || !chainId)
      return NextResponse.json({ error: 'No txHash provided or chainId' }, { status: 400 });

    const payment = await getPayment(txHash);

    const ticket = await TicketService.getTicketById(ticketIdInt);

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    const isValidPayment = verifyPayment(
      payment,
      ticket.event.creatorAddress as Address,
      ticket.event.priceAmount,
      ticket.event.priceCurrency as FiatCurrencyString,
      ticket.id
    );

    if (!isValidPayment) {
      return NextResponse.json({ error: 'Invalid payment' }, { status: 400 });
    }

    const updatedTicket = await TicketService.updateTicket(ticketIdInt, {
      txHash,
      chainId,
      paid: true,
    });
    console.log('🚀 updatedTicket:', updatedTicket);

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
