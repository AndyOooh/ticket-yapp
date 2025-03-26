import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient | undefined;
}
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma = globalThis.__db__ ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__db__ = prisma;
}
