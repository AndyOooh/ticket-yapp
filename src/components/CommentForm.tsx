'use client';

import { useState } from 'react';
import { Button, TextArea, Flex } from '@radix-ui/themes';
import { useCommentMutations } from '@/hooks/useComments';
import { useUserContext } from '@/providers/UserContextProvider';
import { Address } from 'viem';

type CommentFormProps = {
  postId: number;
  hasComments?: boolean;
};

export default function CommentForm({ postId, hasComments = false }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { create } = useCommentMutations();
  const { userContext } = useUserContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !userContext) return; // TDOD: Improve UX.

    setIsSubmitting(true);

    try {
      await create.mutateAsync({
        content,
        creatorEns: userContext?.primaryEnsName,
        creatorAddress: userContext.address as Address,
        postId,
      });

      setContent('');
      setIsFormVisible(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isFormVisible) {
    return (
      <Flex justify="center" mb="4">
        <Button onClick={() => setIsFormVisible(true)}>
          {hasComments ? 'Join the conversation' : 'Be the first to comment'}
        </Button>
      </Flex>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextArea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        mb="2"
        size="3"
      />
      <Flex justify="end" gap="2">
        <Button variant="soft" onClick={() => setIsFormVisible(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={!userContext || !content.trim() || isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </Flex>
    </form>
  );
}
