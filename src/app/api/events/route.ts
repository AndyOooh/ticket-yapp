import { NextRequest, NextResponse } from 'next/server';
import * as EventService from '@/lib/services/event';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const events = await EventService.getEvents({
      limit,
      offset,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      creatorEns,
      creatorAddress,
      title,
      description,
      tags,
      priceAmount,
      priceCurrency,
      capacity,
      eventTime,
      location,
    } = await request.json();

    // TODO: Use zod
    // Validate required fields
    if (!creatorAddress || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await EventService.createEvent({
      creatorEns,
      creatorAddress,
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      eventTime,
      location,
      capacity,
      priceAmount,
      priceCurrency,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);

    // Handle unique constraint violation (duplicate txHash)
    if ((error as Error & { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'An event with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
