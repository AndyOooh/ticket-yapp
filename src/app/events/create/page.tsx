'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  TextArea,
  Badge,
  Select,
  Callout,
  Section,
} from '@radix-ui/themes';
import { useToast } from '@/providers/ToastProvider';
import { TAGS } from '@/constants';
import { useUserContext } from '@/providers/UserContextProvider';
import { useMutation } from '@tanstack/react-query';
import { CalendarIcon, TimerIcon, HomeIcon } from '@radix-ui/react-icons';
import { useSession } from 'next-auth/react';
import { InfoBox } from '@/components/ui/InfoBox';

export default function CreateEventPage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const toast = useToast();
  const { data: userContext } = useUserContext();

  const currencies = ['USD', 'EUR', 'ETH', 'USDC'];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventTime: '',
    location: '',
    capacity: '',
    priceAmount: '',
    priceCurrency: 'USD',
    tags: [] as string[],
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success('Event created successfully!');
      router.push(`/events/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tagName: string) => {
    setFormData((prev) => {
      if (prev.tags.includes(tagName)) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tagName) };
      } else {
        return { ...prev, tags: [...prev.tags, tagName] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userContext?.address) {
      toast.error('Please connect your wallet to create an event');
      return;
    }

    const eventTime = new Date(formData.eventTime).toISOString();

    const eventData = {
      creatorEns: userContext.primaryEnsName,
      creatorAddress: userContext.address,
      title: formData.title,
      description: formData.description,
      eventTime,
      location: formData.location || null,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      priceAmount: parseFloat(formData.priceAmount) || 0,
      priceCurrency: formData.priceCurrency,
      tags: formData.tags,
    };

    createEventMutation.mutate(eventData);
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.description.trim() &&
      formData.eventTime &&
      formData.priceAmount &&
      formData.priceCurrency
    );
  };

  // if (sessionStatus !== 'authenticated') {
  //   return (
  //     <Section>
  //       <InfoBox>You must be signed in to create events</InfoBox>
  //     </Section>
  //   );
  // }

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Heading size="6" mb="4">
        Create an Event
      </Heading>

      {sessionStatus !== 'authenticated' ? (
        <Section>
          <InfoBox>Please sign in to create events</InfoBox>
        </Section>
      ) : (
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            {/* Title */}
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                Event Title*
              </Text>
              <TextField.Root
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                size="3"
                maxLength={100}
                required
              />
              <Text size="1" color="gray">
                {formData.title.length}/100
              </Text>
            </Box>

            {/* Description */}
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                Description*
              </Text>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event description and details"
                size="3"
                required
              />
            </Box>

            {/* Date and Time */}
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                <Flex align="center" gap="1">
                  <CalendarIcon />
                  Date and Time*
                </Flex>
              </Text>
              <TextField.Root
                type="datetime-local"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                size="3"
                required
              />
            </Box>

            {/* Location */}
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                <Flex align="center" gap="1">
                  <TimerIcon />
                  Location
                </Flex>
              </Text>
              <TextField.Root
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Physical or virtual location"
                size="3"
              />
            </Box>

            {/* Capacity */}
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                <Flex align="center" gap="1">
                  <HomeIcon />
                  Capacity
                </Flex>
              </Text>
              <TextField.Root
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Maximum number of tickets (optional)"
                size="3"
              />
            </Box>

            {/* Price */}
            <Flex gap="3">
              <Box style={{ flex: 2 }}>
                <Text as="label" size="2" mb="1" weight="bold">
                  Price Amount*
                </Text>
                <TextField.Root
                  type="number"
                  name="priceAmount"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  size="3"
                  required
                />
              </Box>
              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" mb="1" weight="bold">
                  Currency*
                </Text>
                <Select.Root
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priceCurrency: value }))
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    {currencies.map((currency) => (
                      <Select.Item key={currency} value={currency}>
                        {currency}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>

            {/* Tags */}
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                Tags
              </Text>
              <Flex wrap="wrap" gap="2" mb="2">
                {TAGS.map((tag) => (
                  <Badge
                    key={tag.name}
                    color={tag.color}
                    size="2"
                    onClick={() => handleTagChange(tag.name)}
                    className={
                      formData.tags.includes(tag.name)
                        ? 'border'
                        : 'border border-transparent opacity-60'
                    }
                  >
                    {tag.name}
                  </Badge>
                ))}
              </Flex>
            </Box>

            {/* Submission */}
            <Flex gap="3" justify="end" mt="4">
              <Button
                type="button"
                variant="soft"
                onClick={() => router.push('/events')}
                disabled={createEventMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid() || createEventMutation.isPending}>
                {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </Flex>
          </Flex>
        </form>
      )}

      {/* Error display */}
      {createEventMutation.isError && (
        <Callout.Root color="red" mt="4">
          <Callout.Text>{createEventMutation.error.message}</Callout.Text>
        </Callout.Root>
      )}
    </Box>
  );
}
