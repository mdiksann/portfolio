import type { CollectionConfig } from 'payload';
import { FixedToolbarFeature, lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical';

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Blog',
    plural: 'Blog',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'status', 'publishedAt'],
  },
  access: {
    read: ({ req: { user } }) => user ? true : { status: { equals: 'published' } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: { description: 'Ringkasan arsitektur untuk daftar blog.' },
    },
    {
      name: 'content',
      label: 'Isi artikel',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures.filter(({ key }) => key !== 'relationship' && key !== 'link'),
          LinkFeature({ enabledCollections: ['posts', 'projects', 'media'] }),
          FixedToolbarFeature(),
        ],
      }),
      admin: { description: 'Tulis dan edit seluruh isi artikel di sini. Gunakan toolbar untuk heading, daftar, tautan, dan gambar; simpan perubahan dengan tombol Save.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: { description: 'Proyek terkait; thumbnail dan tech stack dapat digunakan pada halaman blog.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
  ],
};
