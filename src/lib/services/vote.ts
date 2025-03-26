import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export async function getVoteByUserAndPost(postId: number, voterEns: string) {
  return prisma.vote.findFirst({
    where: {
      postId,
      voterEns,
    },
  });
}

export async function upsertVote(postId: number, voterEns: string, voteType: 'up' | 'down') {
  // Use transaction to ensure vote and post updates are atomic
  return prisma.$transaction(async (tx) => {
    const existingVote = await tx.vote.findFirst({
      where: { postId, voterEns },
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if clicking same button
        await tx.vote.delete({
          where: { id: existingVote.id },
        });

        // Update post counts
        await tx.post.update({
          where: { id: postId },
          data: {
            [voteType === 'up' ? 'upvotes' : 'downvotes']: {
              decrement: 1,
            },
          },
        });
      } else {
        // Change vote direction
        await tx.vote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });

        // Update post counts
        await tx.post.update({
          where: { id: postId },
          data: {
            [voteType === 'up' ? 'upvotes' : 'downvotes']: { increment: 1 },
            [voteType === 'up' ? 'downvotes' : 'upvotes']: { decrement: 1 },
          },
        });
      }
    } else {
      // Create new vote
      await tx.vote.create({
        data: {
          postId,
          voterEns,
          voteType,
        },
      });

      // Update post count
      await tx.post.update({
        where: { id: postId },
        data: {
          [voteType === 'up' ? 'upvotes' : 'downvotes']: {
            increment: 1,
          },
        },
      });
    }

    // Return updated post
    return tx.post.findUnique({
      where: { id: postId },
      include: {
        votes: true,
        _count: {
          select: { comments: true },
        },
      },
    });
  });
}
