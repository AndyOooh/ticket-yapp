import { prisma } from '@/lib/db';
import { TicketWithEvent } from '@/types';
import type { Prisma } from '@prisma/client';
import { generateValidationToken } from '@/lib/utils';

export async function getTickets(options?: {
  limit?: number;
  offset?: number;
  orderBy?: Prisma.TicketOrderByWithRelationInput;
  where?: Prisma.TicketWhereInput;
}): Promise<TicketWithEvent[]> {
  const { limit = 10, offset = 0, orderBy = { createdAt: 'desc' }, where = {} } = options || {};

  try {
    const tickets = await prisma.ticket.findMany({
      take: limit,
      skip: offset,
      orderBy,
      where,
      include: {
        event: true,
      },
    });

    return tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

export async function getTicketById(id: number): Promise<TicketWithEvent | null> {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      event: true,
    },
  });

  return ticket;
}

export async function createTicket(data: Prisma.TicketCreateInput) {
  const validationToken = generateValidationToken();

  const ticket = await prisma.ticket.create({
    data: {
      ...data,
      validationToken,
    },
  });

  return ticket;
}

export async function deleteTicket(id: number) {
  return prisma.ticket.delete({
    where: { id },
  });
}
