import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function getEvents(options?: {
  limit?: number;
  offset?: number;
  orderBy?: Prisma.EventOrderByWithRelationInput;
}) {
  const { limit = 10, offset = 0, orderBy = { createdAt: 'desc' } } = options || {};

  try {
    const events = await prisma.event.findMany({
      take: limit,
      skip: offset,
      orderBy,
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

export async function getEventById(id: number) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: true,
      _count: {
        select: { tickets: true },
      },
    },
  });

  return event;
}

export async function createEvent(data: Prisma.EventCreateInput) {
  const event = await prisma.event.create({
    data,
  });

  return event;
}

export async function deleteEvent(id: number) {
  return prisma.event.delete({
    where: { id },
  });
}
