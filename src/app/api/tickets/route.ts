// src/app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createTicket, getTickets } from '@/lib/services/ticket';
import { Address } from 'viem';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ownerAddress = searchParams.get('ownerAddress') as Address;

  if (!ownerAddress) {
    return NextResponse.json({ error: 'Owner address is required' }, { status: 400 });
  }

  try {
    // Pass through limit and offset if provided, otherwise let service defaults handle it
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const tickets = await getTickets({
      limit,
      offset,
      where: { ownerAddress, paid: true },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { eventId, ownerAddress, ownerEns } = await request.json();

  const ticket = await createTicket({
    event: {
      connect: { id: eventId },
    },
    ownerEns,
    ownerAddress,
    paid: false,
    redeemed: false,
  });

  return NextResponse.json(ticket);
}
