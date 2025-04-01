import { BadgeProps } from '@radix-ui/themes';

type TagType =
  | 'payments'
  | 'workshop'
  | 'web3'
  | 'metaverse'
  | 'ethereum'
  | 'solana'
  | 'nft'
  | 'art'
  | 'defi'
  | 'networking';

type Tag = {
  name: TagType;
  color: BadgeProps['color'];
};

// Available tags for posts
// You can add, remove, or modify these tags to suit your community
export const TAGS: Tag[] = [
  {
    name: 'payments',
    color: 'iris',
  },
  {
    name: 'workshop',
    color: 'amber',
  },
  {
    name: 'web3',
    color: 'orange',
  },
  {
    name: 'metaverse',
    color: 'pink',
  },
  {
    name: 'ethereum',
    color: 'green',
  },
  {
    name: 'solana',
    color: 'blue',
  },
  {
    name: 'nft',
    color: 'purple',
  },
  {
    name: 'art',
    color: 'red',
  },
  {
    name: 'networking',
    color: 'jade',
  },
];
