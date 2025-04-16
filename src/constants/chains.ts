import { Chain } from 'viem';

import { arbitrum, mainnet, optimism, polygon } from 'viem/chains';

import { base } from 'viem/chains';

// Map of supported chains for verification
export const supportedChains: Record<number, Chain> = {
  1: mainnet,
  8453: base,
  10: optimism,
  42161: arbitrum,
  137: polygon,
};
