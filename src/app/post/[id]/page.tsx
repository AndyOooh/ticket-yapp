import { Container, Box, Heading } from '@radix-ui/themes';
import PostCard from '@/components/PostCard';
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';
import { getAll, getById } from '@/lib/services/post';
import { notFound } from 'next/navigation';

// Set revalidation time (e.g., every 5 minutes)
// Enable dynamic params for posts not pre-rendered
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAll();
  if (!posts) return [];
  return posts?.map((post) => ({
    id: post.id.toString(),
  }));
}

type Params = { params: Promise<{ id: string }> };

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const postId = Number(id);

  const post = await getById(postId);
  if (!post) return notFound();

  const hasComments = post.comments && post.comments.length > 0;

  return (
    <Container size="2" py="6">
      <Box mb="6">
        <PostCard post={post} />
      </Box>
      <Box>
        <Heading size="4" mb="4">
          {post.comments?.length ? 'Comments' : 'No comments yet'}
        </Heading>
        <Box mb="4">
          <CommentForm postId={postId} hasComments={hasComments} />
        </Box>
        <CommentList comments={post.comments || []} />
      </Box>
    </Container>
  );
}
