import { NextRequest, NextResponse } from 'next/server';
import * as TicketService from '@/lib/services/ticket';

export async function POST(request: NextRequest) {
  try {
    const { ticketId, token } = await request.json();

    if (!ticketId || !token) {
      return NextResponse.json(
        { error: 'Missing required fields: ticketId and token' },
        { status: 400 }
      );
    }

    // Convert ticketId to number if it's a string
    const ticketIdNum = typeof ticketId === 'string' ? parseInt(ticketId, 10) : ticketId;

    if (isNaN(ticketIdNum)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
    }

    const result = await TicketService.validateTicket(ticketIdNum, token);

    if (!result.valid || !result.ticket) {
      return NextResponse.json(
        {
          valid: false,
          message: result.message,
          ticketDetails: result.ticket
            ? {
                eventTitle: result.ticket.event.title,
                ownerAddress: result.ticket.ownerAddress,
                ownerEns: result.ticket.ownerEns,
              }
            : null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: result.message,
      ticketDetails: {
        eventTitle: result.ticket.event.title,
        eventTime: result.ticket.event.eventTime,
        ownerAddress: result.ticket.ownerAddress,
        ownerEns: result.ticket.ownerEns,
      },
    });
  } catch (error) {
    console.error('Error during ticket validation:', error);
    return NextResponse.json({ error: 'Server error during validation' }, { status: 500 });
  }
}

// To handle direct browser navigation to this URL (from QR scan)
export async function GET(request: NextRequest) {
  // Extract ticketId and token from query parameters
  const searchParams = request.nextUrl.searchParams;
  const ticketId = searchParams.get('ticketId');
  const token = searchParams.get('token');

  if (!ticketId || !token) {
    return NextResponse.json(
      { error: 'Missing required parameters: ticketId and token' },
      { status: 400 }
    );
  }

  return NextResponse.redirect(new URL(`/tickets/${ticketId}`, request.url));
}
