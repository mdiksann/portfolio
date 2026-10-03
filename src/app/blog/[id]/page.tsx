import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPostDetailView } from './BlogPostDetailView'
import { getPost } from '@/lib/blog'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).id)
  if (!post) notFound()

  return {
    title: `${post.title} - Blog - Muhammad Iksan`,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost((await params).id)
  if (!post) notFound()
  return <BlogPostDetailView post={post} />
}
