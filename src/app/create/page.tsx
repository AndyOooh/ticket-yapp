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
  Callout,
  Spinner,
} from '@radix-ui/themes';
import { useToast } from '@/providers/ToastProvider';
import { POST_FEE, TAGS } from '@/constants';
import { sdk } from '@/lib/sdk';
import { usePostMutations } from '@/hooks/usePosts';
import { useUserContext } from '@/providers/UserContextProvider';
import { Address } from 'viem';

export default function CreatePostPage() {
  const router = useRouter();
  const toast = useToast();
  const { userContext, isLoading } = useUserContext();
  const { create, update } = usePostMutations();
  const [paymentStatus, setPaymentStatus] = useState<'submitting' | 'verifying' | null>(null);
  const [formData, setFormData] = useState({
    header: '',
    content: '',
    tags: [] as string[],
  });

  if (!userContext) return;

  const isFormValid = () => {
    return formData.header.trim() && formData.content.trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    try {
      setPaymentStatus('submitting');

      // Step 1: Create the initial post (without txHash, paid=false)
      const postData = {
        creatorEns: userContext.primaryEnsName,
        creatorAddress: userContext.address as Address,
        header: formData.header,
        content: formData.content,
        tags: formData.tags,
      };
      const newPost = await create.mutateAsync(postData);

      // Step 2: Request payment with the post ID
      const { txHash } = await sdk.requestPayment(POST_FEE.address, {
        amount: POST_FEE.amount,
        currency: POST_FEE.currency,
        memo: newPost.id.toString(),
      });
      setPaymentStatus('verifying');

      await update.mutateAsync({
        id: newPost.id,
        data: {
          txHash,
        },
      });

      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create post. Please try again.';
      toast.error(errorMessage);
    } finally {
      setPaymentStatus(null);
      router.push('/');
    }
  };

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Heading size="6" mb="4">
        Create a Post
      </Heading>

      {paymentStatus === 'verifying' ? (
        <Flex justify="center" align="center" height="50vh">
          <Callout.Root size="2">
            <Callout.Icon>
              <Spinner />
            </Callout.Icon>
            <Callout.Text>Verifying payment</Callout.Text>
          </Callout.Root>
        </Flex>
      ) : (
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                Title*
              </Text>
              <TextField.Root
                name="header"
                value={formData.header}
                onChange={handleChange}
                placeholder="Title"
                size="3"
                maxLength={100}
                required
              />
              <Text size="1" color="gray">
                {formData.header.length}/100
              </Text>
            </Box>

            <Box>
              <Text as="label" size="2" mb="1" weight="bold">
                Content*
              </Text>
              <TextArea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Text"
                size="3"
                maxLength={280}
                required
              />
              <Text size="1" color="gray">
                {formData.content.length}/280
              </Text>
            </Box>

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

            <Flex direction="column" gap="2" mt="4">
              <Flex gap="3" justify="end">
                <Button
                  type="button"
                  variant="soft"
                  onClick={() => router.push('/')}
                  disabled={paymentStatus !== null}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!userContext || paymentStatus !== null || !isFormValid()}
                >
                  {paymentStatus === 'submitting'
                    ? 'Subimitting...'
                    : paymentStatus === 'verifying'
                    ? 'Verifying...'
                    : 'Create Post'}
                </Button>
              </Flex>
              <Text size="1" color="gray" align="right">
                {`Posting fee: ${POST_FEE.amount} ${POST_FEE.currency}`}
              </Text>
            </Flex>
          </Flex>
        </form>
      )}
    </Box>
  );
}
