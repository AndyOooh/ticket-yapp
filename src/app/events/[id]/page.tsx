import { getAll, getById } from '@/lib/services/event';
import { notFound } from 'next/navigation';

export const revalidate = 300;
export const dynamicParams = true;

export const generateStaticParams = async () => {
  const events = await getAll();
  console.log('🚀 events:', events);
  if (!events) return [];
  return events.map((event) => ({
    id: event.id.toString(),
  }));
};

type Params = { params: Promise<{ id: string }> };

export default async function EventPage({ params }: Params) {
  console.log('🚀 params:', params);
  const { id } = await params;
  const eventId = Number(id);
  console.log('🚀 eventId:', eventId);

  const event = await getById(eventId); // should use hook instead if client comp.
  if (!event) return notFound();

  return <div>{event.title}</div>;
}
