import { DotFilledIcon } from '@radix-ui/react-icons';
import { Card, Flex, Text } from '@radix-ui/themes';

type CardListProps = {
  list: { title: string; text: string }[];
};

export const CardList = ({ list }: CardListProps) => {
  return (
    <Card size="1" className="mx-auto">
      {list.map(({ title, text }) => (
        <Flex align="center" gap="2" key={title}>
          <DotFilledIcon />
          <Text size="2" className="flex-1">
            {text}
          </Text>
        </Flex>
      ))}
    </Card>
  );
};
