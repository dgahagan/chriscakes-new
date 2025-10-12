import { defineType } from 'sanity';

export default defineType({
  name: 'ctaSection',
  title: 'Call-to-Action Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main call-to-action heading',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Supporting text for the call-to-action',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the button',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'URL or path (e.g., /contact or https://example.com)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Crimson)', value: 'primary' },
          { title: 'Secondary (Outlined)', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      description: 'Visual style of the button',
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      buttonText: 'buttonText',
      style: 'style',
    },
    prepare({ heading, buttonText, style }) {
      return {
        title: heading || 'Call-to-Action',
        subtitle: `Button: "${buttonText}" (${style || 'primary'})`,
      };
    },
  },
});
