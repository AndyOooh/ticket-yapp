// src/app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createTicket, getTickets } from '@/lib/services/ticket';
import { getServerAuthSession } from '@/lib/auth';
import { Address } from 'viem';

export async function GET(request: NextRequest) {
  // Get address from session instead of query params
  const session = await getServerAuthSession();

  if (!session?.address) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const ownerAddress = session.address as Address;
  const searchParams = request.nextUrl.searchParams;

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
  // Get address from session for creating tickets as well
  const session = await getServerAuthSession();

  if (!session?.address) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { eventId } = await request.json();
  const ownerAddress = session.address as Address;
  // Optional: Get ENS name from session if available
  const ownerEns = null; // Could be populated from session if you store it

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
