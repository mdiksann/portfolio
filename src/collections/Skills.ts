import type { CollectionConfig } from 'payload';

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'category',
  },
  fields: [
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'logoUrl',
          type: 'text',
          admin: {
            description: 'Optional SVG/PNG logo URL. Leave empty to use the default logo by name.',
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
    }
  ],
};
