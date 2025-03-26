import { NextRequest, NextResponse } from 'next/server';
import * as PostService from '@/lib/services/post';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const posts = await PostService.getAll({
      limit,
      offset,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Add POST method to create a new post
export async function POST(request: NextRequest) {
  try {
    const { creatorEns, creatorAddress, header, content, tags } = await request.json();

    // Validate required fields
    if (!creatorAddress || !header || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the post
    const post = await PostService.create({
      creatorEns,
      creatorAddress,
      header,
      content,
      tags: Array.isArray(tags) ? tags : [],
      txHash: null,
      paid: false,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);

    // Handle unique constraint violation (duplicate txHash)
    if ((error as Error & { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this transaction hash already exists' },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
