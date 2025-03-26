import { NextRequest, NextResponse } from 'next/server';
import * as VoteService from '@/lib/services/vote';

type RouteParams = { params: Promise<{ postId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { postId } = await params;
    const postIdInt = parseInt(postId);

    if (isNaN(postIdInt)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const { voterEns, voteType } = await request.json();

    if (!voterEns || !voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote data' }, { status: 400 });
    }

    const result = await VoteService.upsertVote(postIdInt, voterEns, voteType as 'up' | 'down');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 });
  }
}
