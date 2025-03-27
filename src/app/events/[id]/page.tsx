import { getEvents, getEventById } from '@/lib/services/event';
import { notFound } from 'next/navigation';

export const revalidate = 300;
export const dynamicParams = true;

export const generateStaticParams = async () => {
  const events = await getEvents();
  if (!events) return [];
  return events.map((event) => ({
    id: event.id.toString(),
  }));
};

type Params = { params: Promise<{ id: string }> };

export default async function EventPage({ params }: Params) {
  const { id } = await params;
  const eventId = Number(id);

  const event = await getEventById(eventId); // should use hook instead if client comp.
  if (!event) return notFound();

  return <div>{event.title}</div>;
}
