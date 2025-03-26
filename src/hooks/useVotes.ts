import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from './usePosts';

type VoteData = {
  postId: number;
  voterEns: string;
  voteType: 'up' | 'down';
};

async function vote({ postId, voterEns, voteType }: VoteData) {
  const response = await fetch(`/api/posts/${postId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voterEns, voteType }),
  });

  if (!response.ok) {
    throw new Error('Failed to vote');
  }

  return response.json();
}

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vote,
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.refetchQueries({ queryKey: postKeys.lists() });
    },
  });
}
