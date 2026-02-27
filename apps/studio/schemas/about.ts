import { defineField, defineType } from 'sanity';

export const about = defineType({
    name: 'about',
    title: 'About Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 5,
        }),
        defineField({
            name: 'image',
            title: 'Profile Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'resume',
            title: 'Resume/CV',
            type: 'file',
        }),
    ],
    preview: {
        select: { title: 'title' },
        prepare(selection) {
            return {
                title: selection.title || 'About Page',
            }
        }
    },
});
