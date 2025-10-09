import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Item Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Item Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'menuCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Is this item currently available?',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'boolean',
      description: 'Show this item in featured/special sections',
      initialValue: false,
    }),
    defineField({
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Dairy', value: 'dairy' },
          { title: 'Eggs', value: 'eggs' },
          { title: 'Nuts', value: 'nuts' },
          { title: 'Gluten', value: 'gluten' },
          { title: 'Soy', value: 'soy' },
          { title: 'Shellfish', value: 'shellfish' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order within category (lower numbers appear first)',
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.title',
      media: 'image',
      price: 'price',
      available: 'available',
    },
    prepare(selection) {
      const { title, subtitle, price, available } = selection;
      return {
        ...selection,
        title: title,
        subtitle: `${subtitle || 'No category'} - $${price?.toFixed(2) || '0.00'}${!available ? ' (Unavailable)' : ''}`,
      };
    },
  },
});
