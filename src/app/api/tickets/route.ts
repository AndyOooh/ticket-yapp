// src/app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTickets } from '@/lib/services/ticket';
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
      where: { ownerAddress },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}
