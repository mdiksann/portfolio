import type { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'featured', 'order'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'tech',
          type: 'text',
        },
      ],
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'View Source destination: use a repository URL or an internal blog path such as /blog/1.',
      },
    },
    {
      name: 'liveUrl',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'metrics',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Metric Value (e.g., 45M+)',
        },
        {
          name: 'label',
          type: 'text',
          label: 'Metric Label (e.g., Daily Transactions)',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
    },
  ],
};
