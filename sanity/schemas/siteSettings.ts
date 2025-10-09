import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Used for SEO and social media',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'contactFormRecipients',
      title: 'Contact Form Recipients',
      type: 'array',
      description:
        'Email addresses that will receive contact form submissions. Add multiple addresses for redundancy.',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.custom((emails: string[] | undefined) => {
          if (!emails || emails.length === 0) {
            return 'At least one email address is required';
          }
          // Validate each email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const invalidEmails = emails.filter(
            (email) => !emailRegex.test(email),
          );
          if (invalidEmails.length > 0) {
            return `Invalid email address(es): ${invalidEmails.join(', ')}`;
          }
          return true;
        }),
    }),
    defineField({
      name: 'address',
      title: 'Physical Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hours',
      title: 'Business Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
              },
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'string',
              description: 'e.g., "9:00 AM - 5:00 PM" or "Closed"',
            },
          ],
          preview: {
            select: {
              day: 'day',
              hours: 'hours',
            },
            prepare(selection) {
              const { day, hours } = selection;
              return {
                title: day,
                subtitle: hours,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      type: 'object',
      fields: [
        { name: 'facebook', title: 'Facebook URL', type: 'url' },
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'twitter', title: 'Twitter/X URL', type: 'url' },
        { name: 'yelp', title: 'Yelp URL', type: 'url' },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});
