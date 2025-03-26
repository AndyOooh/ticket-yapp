'use client';

import { useState } from 'react';
import { Flex, Text, Heading, Badge, Box, Button, Avatar } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import CommentList from '@/components/CommentList';
import { PostExtended } from '@/types';
import { useVote } from '@/hooks/useVotes';
import Link from 'next/link';
import { ACCENT_COLOR, TAGS } from '@/constants';
import { MdChatBubbleOutline, MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md';
import { truncateAddress } from '@/lib/utils';
import { PersonIcon } from '@radix-ui/react-icons';

type PostCardProps = {
  post: PostExtended;
};

export default function PostCard({ post: initialPost }: PostCardProps) {
  const [post, setPost] = useState(initialPost);
  const { mutate: vote, isPending } = useVote();
  const [showComments, setShowComments] = useState(false);
  const [currentUserEns] = useState('demo.eth'); // Replace with actual user ENS

  const userVote = post.votes?.find((v) => v.voterEns === currentUserEns);

  const handleVote = (voteType: 'up' | 'down') => {
    if (isPending) return;

    vote(
      {
        postId: post.id,
        voterEns: currentUserEns,
        voteType,
      },
      {
        onSuccess: (updatedPost) => {
          setPost(updatedPost);
        },
      }
    );
  };

  return (
    <Box p="4" className="bg-[var(--accent-3)] rounded-2xl">
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Avatar fallback={post.creatorEns?.substring(0, 2) ?? <PersonIcon />} size="2" />
            <Text size="2" color="gray">
              {post.creatorEns ?? truncateAddress(post.creatorAddress)}
            </Text>
          </Flex>
          <Text size="1" color="gray" align="right">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </Text>
        </Flex>

        <Link href={`/post/${post.id}`}>
          <Box>
            <Heading size="4">{post.header}</Heading>
            <Text color="gray" size="2">
              {post.content}
            </Text>
          </Box>
        </Link>

        <Flex gap="2" wrap="wrap">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="soft" color={TAGS.find((t) => t.name === tag)?.color}>
              {tag}
            </Badge>
          ))}
        </Flex>

        <Flex justify="between" align="center">
          <Flex gap="3">
            <Button
              variant="ghost"
              onClick={() => handleVote('up')}
              color={userVote?.voteType === 'up' ? 'green' : 'gray'}
              disabled={isPending}
            >
              <MdOutlineThumbUp />
              {post.upvotes}
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleVote('down')}
              color={userVote?.voteType === 'down' ? 'red' : 'gray'}
              disabled={isPending}
            >
              <MdOutlineThumbDown />
              {post.downvotes}
            </Button>
          </Flex>

          <Button variant="ghost" onClick={() => setShowComments(!showComments)}>
            <MdChatBubbleOutline color={showComments ? '' : ACCENT_COLOR} />
            {post._count?.comments || 0}
          </Button>
        </Flex>

        {showComments && (
          <Box pt="2">
            <CommentList comments={post.comments || []} />
          </Box>
        )}
      </Flex>
    </Box>
  );
}
