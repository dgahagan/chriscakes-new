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
      title: 'Social Media Settings',
      type: 'object',
      description:
        'Configure your social media presence and how it displays on the website',
      fields: [
        // PLATFORM CONFIGURATIONS
        {
          name: 'platforms',
          title: 'Social Media Platforms',
          type: 'array',
          description: 'Add and configure social media platforms. Drag to reorder.',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'Twitter/X', value: 'twitter' },
                      { title: 'Yelp', value: 'yelp' },
                      { title: 'Pinterest', value: 'pinterest' },
                      { title: 'TikTok', value: 'tiktok' },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'Profile URL',
                  type: 'url',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'enabled',
                  title: 'Show on Website',
                  type: 'boolean',
                  description: 'Toggle to show/hide this platform on your website',
                  initialValue: true,
                },
                {
                  name: 'handle',
                  title: 'Handle (optional)',
                  type: 'string',
                  description: 'Your username/handle (e.g., @chriscakesmi)',
                },
              ],
              preview: {
                select: {
                  platform: 'platform',
                  url: 'url',
                  enabled: 'enabled',
                },
                prepare({ platform, url, enabled }) {
                  return {
                    title: platform.charAt(0).toUpperCase() + platform.slice(1),
                    subtitle: enabled ? url : '❌ Hidden',
                  };
                },
              },
            },
          ],
        },

        // DISPLAY SETTINGS
        {
          name: 'displaySettings',
          title: 'Display Settings',
          type: 'object',
          description: 'Control where social icons appear on your website',
          fields: [
            {
              name: 'showInHeader',
              title: 'Show in Header',
              type: 'boolean',
              description: 'Display social icons in the header navigation',
              initialValue: false,
            },
            {
              name: 'showInFooter',
              title: 'Show in Footer',
              type: 'boolean',
              description: 'Display social icons in the footer',
              initialValue: true,
            },
          ],
        },

        // CALL-TO-ACTION
        {
          name: 'socialCTA',
          title: 'Social Call-to-Action',
          type: 'object',
          description: 'Customize messaging to encourage social engagement',
          fields: [
            {
              name: 'enabled',
              title: 'Show CTA',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'heading',
              title: 'CTA Heading',
              type: 'string',
              description: 'e.g., "Follow Us for Daily Specials"',
              initialValue: 'Follow Us',
            },
            {
              name: 'message',
              title: 'CTA Message',
              type: 'text',
              rows: 2,
              description: 'Brief message encouraging follows/engagement',
            },
            {
              name: 'hashtag',
              title: 'Hashtag to Promote',
              type: 'string',
              description: 'e.g., chriscakes (without the #)',
            },
          ],
        },

        // INSTAGRAM WIDGET
        {
          name: 'instagramWidget',
          title: 'Instagram Feed Widget',
          type: 'object',
          description: 'Configure Instagram feed display on your website',
          fields: [
            {
              name: 'enabled',
              title: 'Show Instagram Feed',
              type: 'boolean',
              description: 'Display Instagram feed widget on selected pages',
              initialValue: false,
            },
            {
              name: 'embedCode',
              title: 'Widget Embed Code',
              type: 'text',
              rows: 5,
              description: 'Paste the embed code from EmbedSocial or Elfsight',
            },
            {
              name: 'displayPages',
              title: 'Display On Pages',
              type: 'array',
              description: 'Choose which pages show the Instagram feed',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'Homepage', value: 'homepage' },
                  { title: 'About Page', value: 'about' },
                  { title: 'Menu Page', value: 'menu' },
                  { title: 'Services Page', value: 'services' },
                  { title: 'Contact Page', value: 'contact' },
                ],
              },
            },
            {
              name: 'heading',
              title: 'Widget Heading',
              type: 'string',
              description: 'Heading above Instagram feed',
              initialValue: 'Follow Us on Instagram',
            },
            {
              name: 'ctaButtonText',
              title: 'CTA Button Text',
              type: 'string',
              description: 'Text for "Follow" button below feed',
              initialValue: 'Follow @chriscakesmi',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'shareButtons',
      title: 'Social Share Buttons',
      type: 'object',
      description:
        'Control where share buttons appear and which platforms to include',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Share Buttons',
          type: 'boolean',
          description: 'Show social share buttons on your website',
          initialValue: true,
        },
        {
          name: 'platforms',
          title: 'Platforms to Include',
          type: 'array',
          description: 'Select which platforms to show share buttons for',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Facebook', value: 'facebook' },
              { title: 'Twitter/X', value: 'twitter' },
              { title: 'Pinterest', value: 'pinterest' },
              { title: 'WhatsApp', value: 'whatsapp' },
              { title: 'LinkedIn', value: 'linkedin' },
              { title: 'Native Share (Mobile)', value: 'native' },
            ],
          },
          initialValue: ['facebook', 'twitter', 'pinterest', 'whatsapp', 'native'],
        },
        {
          name: 'displayPages',
          title: 'Show Share Buttons On',
          type: 'array',
          description: 'Choose which page types display share buttons',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Menu Page', value: 'menu' },
              { title: 'Services Page', value: 'services' },
              { title: 'Fundraising Page', value: 'fundraising' },
              { title: 'Dynamic Pages', value: 'dynamicPages' },
              { title: 'All Pages', value: 'all' },
            ],
          },
          initialValue: ['menu', 'services', 'dynamicPages'],
        },
        {
          name: 'pinterestEnabled',
          title: 'Enable Pinterest Pin Buttons',
          type: 'boolean',
          description: 'Show "Pin It" button on food/cake images',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'ugcGallery',
      title: 'User-Generated Content Gallery',
      type: 'object',
      description:
        'Display customer photos from Instagram tagged with your hashtag',
      fields: [
        {
          name: 'enabled',
          title: 'Enable UGC Gallery',
          type: 'boolean',
          description: 'Show user-generated content gallery on your website',
          initialValue: false,
        },
        {
          name: 'embedCode',
          title: 'UGC Widget Embed Code',
          type: 'text',
          rows: 5,
          description:
            'Paste the embed code from EmbedSocial, Taggbox, or Walls.io',
        },
        {
          name: 'heading',
          title: 'Gallery Heading',
          type: 'string',
          description: 'Heading above the gallery',
          initialValue: 'See What Our Customers Are Saying',
        },
        {
          name: 'message',
          title: 'Encouragement Message',
          type: 'text',
          rows: 2,
          description: 'Message encouraging customers to share and tag',
        },
        {
          name: 'displayPages',
          title: 'Display On Pages',
          type: 'array',
          description: 'Choose which pages show the UGC gallery',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Homepage', value: 'homepage' },
              { title: 'About Page', value: 'about' },
              { title: 'Menu Page', value: 'menu' },
              { title: 'Services Page', value: 'services' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'reviewWidgets',
      title: 'Review Widgets',
      type: 'object',
      description: 'Display Facebook reviews and Yelp rating on your website',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Review Widgets',
          type: 'boolean',
          description: 'Show review widgets section',
          initialValue: false,
        },
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'What Our Customers Say',
        },
        {
          name: 'showFacebook',
          title: 'Show Facebook Reviews',
          type: 'boolean',
          description: 'Display Facebook page reviews widget',
          initialValue: true,
        },
        {
          name: 'showYelp',
          title: 'Show Yelp Badge',
          type: 'boolean',
          description: 'Display Yelp rating badge',
          initialValue: true,
        },
        {
          name: 'displayPages',
          title: 'Display On Pages',
          type: 'array',
          description: 'Choose which pages show review widgets',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Homepage', value: 'homepage' },
              { title: 'About Page', value: 'about' },
              { title: 'Services Page', value: 'services' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'clickToTweet',
      title: 'Click-to-Tweet Quotes',
      type: 'object',
      description: 'Enable shareable testimonial quotes on Twitter',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Click-to-Tweet',
          type: 'boolean',
          description: 'Show click-to-tweet testimonials',
          initialValue: false,
        },
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Share What Our Customers Are Saying',
        },
        {
          name: 'maxDisplay',
          title: 'Maximum Testimonials to Display',
          type: 'number',
          description: 'How many tweetable testimonials to show',
          initialValue: 3,
          validation: (Rule) => Rule.min(1).max(10),
        },
        {
          name: 'hashtags',
          title: 'Default Hashtags',
          type: 'array',
          description: 'Hashtags to include in tweets (without #)',
          of: [{ type: 'string' }],
          initialValue: ['ChrisCakes', 'Catering', 'MichiganFood'],
        },
        {
          name: 'displayPages',
          title: 'Display On Pages',
          type: 'array',
          description: 'Choose which pages show click-to-tweet quotes',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Homepage', value: 'homepage' },
              { title: 'About Page', value: 'about' },
              { title: 'Services Page', value: 'services' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'pinterestBoards',
      title: 'Pinterest Boards Showcase',
      type: 'object',
      description: 'Display curated Pinterest boards on your website',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Pinterest Boards',
          type: 'boolean',
          description: 'Show Pinterest boards showcase',
          initialValue: false,
        },
        {
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          initialValue: 'Find Inspiration on Pinterest',
        },
        {
          name: 'boards',
          title: 'Pinterest Boards',
          type: 'array',
          description: 'Add Pinterest boards to showcase',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Board Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'Board URL',
                  type: 'url',
                  description: 'Full Pinterest board URL',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 2,
                  description: 'Brief description of the board content',
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  url: 'url',
                },
                prepare({ title, url }) {
                  return {
                    title,
                    subtitle: url,
                  };
                },
              },
            },
          ],
        },
        {
          name: 'displayPages',
          title: 'Display On Pages',
          type: 'array',
          description: 'Choose which pages show Pinterest boards',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Homepage', value: 'homepage' },
              { title: 'Menu Page', value: 'menu' },
              { title: 'Services Page', value: 'services' },
            ],
          },
        },
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
