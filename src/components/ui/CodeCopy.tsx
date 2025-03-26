import { CopyIcon } from '@radix-ui/react-icons';
import { Code, Flex, IconButton } from '@radix-ui/themes';

type CodeCopyProps = {
  text: string;
  truncate?: boolean;
  position?: 'front' | 'back';
  justify?: 'start' | 'end' | 'between';
};

export const CodeCopy = ({
  text,
  truncate,
  position = 'front',
  justify = 'between',
}: CodeCopyProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Failed to copy text:', err);
    });
  };

  const code = (
    <Code className="mr-2 whitespace-nowrap" truncate={truncate} variant="ghost">
      {text}
    </Code>
  );

  const copyButton = (
    <IconButton size="1" aria-label="Copy value" variant="ghost" onClick={handleCopy}>
      <CopyIcon />
    </IconButton>
  );

  return (
    <Flex align="center" width="100%" gap="2" justify={justify}>
      {position === 'front' && code}
      {copyButton}
      {position === 'back' && code}
    </Flex>
  );
};
