import { Avatar } from '@radix-ui/themes';
import { Flex, Text } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import { truncateAddress } from '@/lib/utils';
import { Comment } from '@prisma/client';
import { PersonIcon } from '@radix-ui/react-icons';

export const CommentCard = (comment: Comment) => {
  const { creatorEns, creatorAddress, content, createdAt } = comment;
  const fallback = creatorEns?.substring(0, 2) ?? <PersonIcon />;

  return (
    <Flex gap="3">
      <Avatar fallback={fallback} size="1" radius="full" className="h-4 w-4" />
      <Flex direction="column" gap="1">
        <Flex justify="between" align="center" gap="2">
          <Flex align="center" gap="2">
            <Text size="1" weight="bold">
              {creatorEns ?? truncateAddress(creatorAddress)}
            </Text>
          </Flex>
          <Text size="1" color="gray">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </Text>
        </Flex>
        <Text size="2">{content}</Text>
      </Flex>
    </Flex>
  );
};
