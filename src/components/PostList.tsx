'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { useInView } from 'react-intersection-observer';
import PostCard from '@/components/PostCard';
import { PostExtended } from '@/types';

type PostListProps = {
  initialPosts: PostExtended[];
};

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<PostExtended[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    const loadMorePosts = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        try {
          const nextPage = page + 1;
          const response = await fetch(`/api/posts?page=${nextPage}&limit=10`);

          if (!response.ok) {
            throw new Error('Failed to fetch more posts');
          }

          const newPosts = await response.json();

          if (newPosts.length === 0) {
            setHasMore(false);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setPage(nextPage);
          }
        } catch (error) {
          console.error('Error loading more posts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMorePosts();
  }, [inView, hasMore, loading, page]);

  if (posts.length === 0) {
    return (
      <Box py="6">
        <Text size="3" align="center">
          No posts found.
        </Text>
      </Box>
    );
  }

  return (
    <Flex direction="column" gap="4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <Box ref={ref} py="4">
          {loading ? (
            <Text size="2">Loading more posts...</Text>
          ) : (
            <Text size="2">Scroll for more</Text>
          )}
        </Box>
      )}
    </Flex>
  );
}
