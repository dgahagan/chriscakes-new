import { defineType } from 'sanity';

export default defineType({
  name: 'highlightBox',
  title: 'Highlight Box',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Heading for this highlighted section',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Content for this section (or use items below for lists)',
    },
    {
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Simple list items (alternative to rich text content)',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Gray', value: 'gray' },
          { title: 'Crimson (Light)', value: 'crimson' },
          { title: 'White', value: 'white' },
        ],
        layout: 'radio',
      },
      initialValue: 'gray',
      description: 'Background color for the box',
    },
    {
      name: 'style',
      title: 'List Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Checklist', value: 'checklist' },
          { title: 'Numbered', value: 'numbered' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      description: 'How to display list items (if using items)',
    },
  ],
  preview: {
    select: {
      title: 'title',
      backgroundColor: 'backgroundColor',
      style: 'style',
    },
    prepare({ title, backgroundColor, style }) {
      return {
        title: title || 'Highlight Box',
        subtitle: `${backgroundColor || 'gray'} background, ${style || 'default'} style`,
      };
    },
  },
});
