import { Box, Flex, Separator } from '@radix-ui/themes';
import { CommentCard } from './CommentCard';
import { Comment } from '@prisma/client';

type CommentListProps = {
  comments: Comment[];
};

export default function CommentList({ comments }: CommentListProps) {
  return (
    <Box>
      <Separator size="4" my="3" />
      <Flex direction="column" gap="3">
        {comments.map((comment: Comment) => (
          <CommentCard key={comment.id} {...comment} />
        ))}
      </Flex>
    </Box>
  );
}
