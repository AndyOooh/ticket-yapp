import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Post } from '@prisma/client';
import { PostExtended } from '@/types';
import { Address } from 'viem';

type PostCreateInput = {
  creatorEns?: string;
  creatorAddress: Address;
  header: string;
  content: string;
  tags?: string[];
};

type PostUpdateInput = {
  txHash: string;
};

type PostDeleteInput = {
  id: number;
  creatorAddress: Address;
};

// API client functions
const apiClient = {
  getAllPosts: async (options?: {
    limit?: number;
    offset?: number;
    orderBy?: Record<string, string>;
  }) => {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await fetch(`/api/posts?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json() as Promise<PostExtended[]>;
  },

  getPostById: async (id: number) => {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json() as Promise<PostExtended>;
  },

  createPost: async (data: PostCreateInput) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json() as Promise<Post>;
  },

  updatePost: async ({ id, data }: { id: number; data: PostUpdateInput }) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json() as Promise<Post>;
  },

  deletePost: async ({ id, creatorAddress }: PostDeleteInput) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorAddress }),
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return response.json() as Promise<{ success: boolean }>;
  },
};

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  detail: (id: number) => [...postKeys.all, 'detail', id] as const,
};

// Individual hooks for queries
export function useGetAllPosts(options?: Parameters<typeof apiClient.getAllPosts>[0]) {
  return useQuery({
    queryKey: [...postKeys.lists(), options],
    queryFn: () => apiClient.getAllPosts(options),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useGetPostById(id: number | undefined) {
  return useQuery({
    queryKey: postKeys.detail(id || 0),
    queryFn: () => apiClient.getPostById(id!),
    enabled: !!id,
  });
}

// Hook for mutations
export function usePostMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: apiClient.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PostUpdateInput }) =>
      apiClient.updatePost({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  const remove = useMutation({
    mutationFn: ({ id, creatorAddress }: PostDeleteInput) =>
      apiClient.deletePost({ id, creatorAddress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });

  return {
    create,
    update,
    remove,
  };
}
