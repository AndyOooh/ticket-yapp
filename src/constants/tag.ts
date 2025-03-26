import { BadgeProps } from '@radix-ui/themes';

type TagType = 'announcement' | 'vote' | 'meme' | 'news' | 'first-post';

type Tag = {
  name: TagType;
  color: BadgeProps['color'];
};

// Available tags for posts
// You can add, remove, or modify these tags to suit your community
export const TAGS: Tag[] = [
  {
    name: 'announcement',
    color: 'iris',
  },
  {
    name: 'vote',
    color: 'amber',
  },
  {
    name: 'meme',
    color: 'orange',
  },
  {
    name: 'news',
    color: 'pink',
  },
  {
    name: 'first-post',
    color: 'green',
  },
];
