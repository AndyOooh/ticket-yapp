'use server';

import { SiweMessage } from 'siwe';
import { type Address, type Hex } from 'viem';
import { getPublicClient } from '../viem';

/**
 * Common verification result type that works for both EOA and SCA verification methods
 */
type VerificationResult = {
  success: boolean;
  data: {
    address: string;
    [key: string]: any; // Allow additional fields to support SiweMessage properties
  };
} | null;

/**
 * Verify a SIWE message using standard EOA verification
 *
 * This is the primary verification method for regular Externally Owned Accounts
 * It uses standard ECDSA cryptographic verification
 */
export const verifyWithEOA = async (
  message: SiweMessage,
  signature: string
): Promise<VerificationResult> => {
  try {
    return await message.verify({
      signature,
      domain: message.domain,
    });
  } catch (error) {
    console.error('🔴 Standard SIWE verification failed:', error);
    return null;
  }
};

/**
 * Verify a SIWE message using ERC-1271 verification for Smart Contract Accounts
 *
 * This is used for Smart Contract Accounts (SCAs) that implement ERC-1271
 * It calls the isValidSignature method on the smart contract
 */
export const verifyWithSCA = async (
  message: SiweMessage,
  signature: string,
  address: string,
  chainId: number
): Promise<VerificationResult> => {
  try {
    // Get client for appropriate chain
    const publicClient = getPublicClient(chainId);

    // Call isValidSignature via verifyMessage
    const isValidSCA = await publicClient.verifyMessage({
      address: address as Address,
      message: message.prepareMessage(),
      signature: signature as Hex,
    });

    if (!isValidSCA) {
      console.error('🔴 ERC-1271 verification failed');
      return null;
    }

    console.log('🟢 ERC-1271 verification successful for SCA wallet');
    // Return a compatible verification result with SIWE required fields
    return {
      success: true,
      data: {
        address,
        chainId: message.chainId,
        domain: message.domain,
        uri: message.uri,
        version: message.version,
      },
    };
  } catch (error) {
    console.error('🔴 ERC-1271 verification error:', error);
    return null;
  }
};
