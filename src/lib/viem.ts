import { supportedChains } from '@/constants';
import { http } from 'viem';
import { createPublicClient } from 'viem';

// Create a public client for the specific chain
export const getPublicClient = (chainId: number) => {
  const chain = supportedChains[chainId];
  return createPublicClient({
    chain,
    transport: http(),
  });
};
