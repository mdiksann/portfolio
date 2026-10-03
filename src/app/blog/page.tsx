import type { Metadata } from 'next'
import { BlogListView } from './BlogListView'
import { getPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog - Muhammad Iksan',
  description: 'Project architecture, system diagrams, and the technical decisions behind Muhammad Iksan’s portfolio.',
}

export default async function BlogPage() {
  const posts = await getPosts()

  return <BlogListView posts={posts} />
}
