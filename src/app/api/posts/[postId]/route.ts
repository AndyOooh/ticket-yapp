import { NextRequest, NextResponse } from 'next/server';
import * as PostService from '@/lib/services/post';
import { getPayment } from '@/lib/services/indexerApi';
import { verifyPayment } from './verifyPayment';
import { POST_FEE } from '@/constants';

type RouteParams = { params: Promise<{ postId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { postId } = await params;
    const postIdInt = parseInt(postId);

    if (isNaN(postIdInt)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await PostService.getById(postIdInt);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { postId } = await params;
    const postIdInt = parseInt(postId);
    const { txHash } = await request.json();

    if (isNaN(postIdInt)) return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    if (!txHash) return NextResponse.json({ error: 'No txHash provided' }, { status: 400 });

    const payment = await getPayment(txHash);
    console.log('🚀 payment:', payment);
    const post = await PostService.getById(postIdInt);

    const isValidPayment = verifyPayment(payment, POST_FEE.address, post);

    if (!isValidPayment) {
      return NextResponse.json({ error: 'Invalid payment' }, { status: 400 });
    }

    const updatedPost = await PostService.update(postIdInt, {
      txHash,
      paid: true,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: this should be a paid action. Use payor address to verify.
    const { postId } = await params;
    const postIdInt = parseInt(postId);
    const { creatorAddress } = await request.json();

    if (isNaN(postIdInt)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await PostService.getById(postIdInt);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // TODO use address instead of ens in Post
    if (post.creatorAddress !== creatorAddress) {
      return NextResponse.json({ error: 'You are not the creator of this post' }, { status: 403 });
    }

    await PostService.remove(postIdInt);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
