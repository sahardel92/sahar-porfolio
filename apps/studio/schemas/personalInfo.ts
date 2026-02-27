import { defineField, defineType } from 'sanity';

export const personalInfo = defineType({
  name: 'personalInfo',
  title: 'Personal Info',
  type: 'document',
  // Singleton — only one document, no create/delete in Studio
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Shown as the large hero heading, e.g. "Creative Developer."',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
      description: 'Shown below the hero heading.',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter / X URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email' },
  },
});
