import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function getByPostId(postId: number, options?: { limit?: number; offset?: number }) {
  const { limit = 10, offset = 0 } = options || {};

  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function getById(id: number) {
  return prisma.comment.findUnique({
    where: { id },
  });
}

export async function create(data: Prisma.CommentCreateInput) {
  return prisma.comment.create({
    data,
  });
}

export async function update(id: number, data: Prisma.CommentUpdateInput) {
  return prisma.comment.update({
    where: { id },
    data,
  });
}

export async function remove(id: number) {
  return prisma.comment.delete({
    where: { id },
  });
}

export async function getByCreator(creatorEns: string) {
  return prisma.comment.findMany({
    where: { creatorEns },
    orderBy: { createdAt: 'desc' },
  });
}
