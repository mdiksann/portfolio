import type { GlobalConfig } from 'payload';

export const Profile: GlobalConfig = {
  slug: 'profile',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'titles',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      name: 'about',
      type: 'textarea',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'status',
      type: 'text',
    },
    {
      name: 'education',
      type: 'array',
      fields: [
        {
          name: 'school',
          type: 'text',
        },
        {
          name: 'major',
          type: 'text',
        },
        {
          name: 'gpa',
          type: 'text',
        },
        {
          name: 'achievements',
          type: 'array',
          fields: [
            {
              name: 'achievement',
              type: 'text',
            }
          ]
        },
      ],
    },
    {
      name: 'experience',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'company',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'achievements',
          type: 'array',
          fields: [
            {
              name: 'achievement',
              type: 'text',
            }
          ]
        },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        {
          name: 'github',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
      ],
    },
  ],
};