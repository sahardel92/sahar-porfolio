import { defineField, defineType } from 'sanity';

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'row',
      title: 'Marquee Row',
      type: 'number',
      description: '1 = top row (moves left), 2 = bottom row (moves right)',
      validation: (Rule) =>
        Rule.required().integer().min(1).max(2).error('Must be 1 or 2'),
      options: {
        list: [
          { title: 'Row 1 (top)', value: 1 },
          { title: 'Row 2 (bottom)', value: 2 },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'row' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `Row ${subtitle}` };
    },
  },
});
