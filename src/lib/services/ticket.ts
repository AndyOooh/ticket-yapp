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

export async function createTicket(data: Omit<Prisma.TicketCreateInput, 'validationToken'>) {
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

export const updateTicket = async (id: number, data: Prisma.TicketUpdateInput) => {
  return prisma.ticket.update({
    where: { id },
    data,
    include: {
      event: true,
    },
  });
};

export async function validateTicket(
  id: number,
  token: string
): Promise<{
  valid: boolean;
  ticket: TicketWithEvent | null;
  message: string;
}> {
  try {
    // Get the ticket with its event
    const ticket = await getTicketById(id);

    // Check if ticket exists
    if (!ticket) {
      return { valid: false, ticket: null, message: 'Ticket not found' };
    }

    // Check if token matches
    if (ticket.validationToken !== token) {
      return { valid: false, ticket, message: 'Invalid validation token' };
    }

    // Check if already redeemed
    if (ticket.redeemed) {
      return { valid: false, ticket, message: 'Ticket already used' };
    }

    // Check if paid (if payment is required)
    if (!ticket.paid) {
      return { valid: false, ticket, message: 'Ticket not paid' };
    }

    const data = {
      redeemed: true,
      updatedAt: new Date(),
    };

    // Mark ticket as redeemed
    const updatedTicket = await updateTicket(id, data);

    // const updatedTicket = await prisma.ticket.update({
    //   where: { id },
    //   data: {
    //     redeemed: true,
    //     updatedAt: new Date(),
    //   },
    //   include: {
    //     event: true,
    //   },
    // });

    return {
      valid: true,
      ticket: updatedTicket,
      message: 'Ticket validated successfully',
    };
  } catch (error) {
    console.error('Error validating ticket:', error);
    return { valid: false, ticket: null, message: 'Server error during validation' };
  }
}
