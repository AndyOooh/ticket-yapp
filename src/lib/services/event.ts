import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function getAll(options?: {
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

export async function getById(id: number) {
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

export async function create(data: Prisma.EventCreateInput) {
  const event = await prisma.event.create({
    data,
  });

  return event;
}

// export async function update(id: number, data: Prisma.EventUpdateInput) {
//   // Check if we're trying to set paid to true
//   const isMarkingAsPaid = data.paid === true;

//   // Update the database
//   const event = await prisma.event.update({
//     where: { id },
//     data,
//   });

//   // Trigger revalidation if we're marking as paid
//   if (isMarkingAsPaid) {
//     try {
//       console.log('Triggering revalidation for newly paid post:', id);
//       const revalidateUrl = `${YAPP_URL}/api/revalidate`;
//       const response = await fetch(`${revalidateUrl}?token=${process.env.REVALIDATION_TOKEN}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ path: '/' }),
//         cache: 'no-store',
//       });

//       const result = await response.json();
//       console.log('Revalidation response:', result);

//       if (!response.ok) {
//         console.error('Revalidation failed with status:', response.status);
//       }
//     } catch (error) {
//       console.error('Failed to revalidate:', error);
//     }
//   }

//   return event;
// }

export async function remove(id: number) {
  return prisma.event.delete({
    where: { id },
  });
}
