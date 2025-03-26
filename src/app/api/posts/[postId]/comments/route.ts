import { NextRequest, NextResponse } from 'next/server';
import * as CommentService from '@/lib/services/comment';

type RouteParams = { params: Promise<{ postId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { postId } = await params;
    const postIdInt = parseInt(postId);

    if (isNaN(postIdInt)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const comments = await CommentService.getByPostId(postIdInt);

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { postId } = await params;
    const postIdInt = parseInt(postId);

    if (isNaN(postIdInt)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const { content, creatorEns, creatorAddress } = await request.json();

    if (!content || !creatorAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await CommentService.create({
      content,
      creatorAddress,
      creatorEns,
      post: {
        connect: { id: postIdInt },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
