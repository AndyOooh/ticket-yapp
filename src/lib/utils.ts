import crypto from 'crypto';

export const truncateAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-4);
};

export const generateValidationToken = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
