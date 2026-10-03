import { cache } from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { getPayloadClient } from '@/lib/payload'

type BlogMedia = {
  id: number | string
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

type BlogProject = {
  id: number | string
  name: string
  slug: string
  description?: string | null
  thumbnail?: BlogMedia | null
  techStack?: { tech?: string | null }[] | null
}

export type BlogPost = {
  id: number | string
  title: string
  excerpt: string
  content: DefaultTypedEditorState
  coverImage?: BlogMedia | null
  project?: BlogProject | null
  status: 'draft' | 'published'
  publishedAt?: string | null
}

type PostDocument = Omit<BlogPost, 'coverImage' | 'project'> & {
  coverImage?: BlogMedia | number | string | null
  project?: (Omit<BlogProject, 'thumbnail'> & {
    thumbnail?: BlogMedia | number | string | null
  }) | number | string | null
}

function populatedPost(post: PostDocument): BlogPost {
  const project = typeof post.project === 'object' ? post.project : null

  return {
    ...post,
    coverImage: typeof post.coverImage === 'object' ? post.coverImage : null,
    project: project ? {
      ...project,
      thumbnail: typeof project.thumbnail === 'object' ? project.thumbnail : null,
    } : null,
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: ['-publishedAt', '-id'],
    pagination: false,
    depth: 2,
    overrideAccess: false,
  })

  return (result.docs as PostDocument[]).map(populatedPost)
}

export const getPost = cache(async (id: string): Promise<BlogPost | null> => {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return null

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { id: { equals: Number(id) } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    pagination: false,
    depth: 2,
    overrideAccess: false,
  })
  const post = result.docs[0] as PostDocument | undefined

  return post ? populatedPost(post) : null
})
