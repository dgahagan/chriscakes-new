import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
});

// Menu data from the old site
const breakfastCategoryData = {
  _type: 'menuCategory',
  title: 'Breakfast Menus',
  slug: { _type: 'slug', current: 'breakfast-menus' },
  description: 'Premier Breakfast Caterers',
  order: 1,
};

const menuItemsData = [
  {
    _type: 'menuItem',
    name: 'Easy Breezy',
    slug: { _type: 'slug', current: 'easy-breezy' },
    description:
      'Scrambled eggs served with bagels and cream cheese complete with a fresh fruit yogurt and granola parfait and Tang. Includes paper goods and cutlery.',
    price: null, // Call for pricing
    available: true,
    featured: false,
    order: 1,
  },
  {
    _type: 'menuItem',
    name: 'Cakes & Eggs',
    slug: { _type: 'slug', current: 'cakes-and-eggs' },
    description:
      'Unlimited Pancakes served with sausage links, scrambled eggs, margarine, syrup, sugar free syrup and Tang. Includes paper goods and cutlery.',
    price: null,
    available: true,
    featured: true,
    order: 2,
  },
  {
    _type: 'menuItem',
    name: 'Top Cake',
    slug: { _type: 'slug', current: 'top-cake' },
    description:
      'Unlimited Pancakes served with sausage links. Topping bar includes your choice of 2 fruits, chocolate chips, sprinkles, whipped cream and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery.',
    price: null,
    available: true,
    featured: false,
    order: 3,
  },
  {
    _type: 'menuItem',
    name: 'Chris Cakes Deluxe',
    slug: { _type: 'slug', current: 'chris-cakes-deluxe' },
    description:
      'Unlimited Pancakes served with scrambled eggs, sausage links, hash browns and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery.',
    price: null,
    available: true,
    featured: true,
    order: 4,
  },
  {
    _type: 'menuItem',
    name: 'Big Chris',
    slug: { _type: 'slug', current: 'big-chris' },
    description:
      'Unlimited Pancakes served with two meat choices, scrambled eggs, hash browns, and Tang. Includes margarine, syrup, sugar free syrup, paper products and cutlery.',
    price: null,
    available: true,
    featured: false,
    order: 5,
  },
  {
    _type: 'menuItem',
    name: 'French Toast Lite',
    slug: { _type: 'slug', current: 'french-toast-lite' },
    description:
      'French Toast served with sausage links, margarine, syrup and sugar free syrup and Tang. Includes paper goods and cutlery.',
    price: null,
    available: true,
    featured: false,
    order: 6,
  },
  {
    _type: 'menuItem',
    name: 'French Toast N Eggs',
    slug: { _type: 'slug', current: 'french-toast-n-eggs' },
    description:
      'Handmade golden French toast served with scrambled eggs, sausage links and Tang. Includes syrup, margarine and sugar free syrup, paper goods and cutlery.',
    price: null,
    available: true,
    featured: false,
    order: 7,
  },
  {
    _type: 'menuItem',
    name: "Biscuits 'N Gravy",
    slug: { _type: 'slug', current: 'biscuits-n-gravy' },
    description:
      'Tasty hot biscuits with sausage gravy served with scrambled eggs and Tang. Includes paper goods and cutlery.',
    price: null,
    available: true,
    featured: false,
    order: 8,
  },
];

const siteSettingsData = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'ChrisCakes of Michigan',
  description:
    "Premier breakfast caterer and large event specialist serving Michigan since 1969. Chris Cakes is more than great food at an affordable price... it's an experience!",
  phone: '989-802-0755',
  email: 'chriscakesmi@sbcglobal.net',
  address: 'P.O. Box 431\nClare MI, 48617',
  hours: [
    { day: 'Monday', hours: 'Call for availability' },
    { day: 'Tuesday', hours: 'Call for availability' },
    { day: 'Wednesday', hours: 'Call for availability' },
    { day: 'Thursday', hours: 'Call for availability' },
    { day: 'Friday', hours: 'Call for availability' },
    { day: 'Saturday', hours: 'Call for availability' },
    { day: 'Sunday', hours: 'Call for availability' },
  ],
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    yelp: '',
  },
};

async function importContent() {
  try {
    console.log('Starting content import...\n');

    // Step 1: Create breakfast category
    console.log('Creating Breakfast Menus category...');
    const category = await client.create(breakfastCategoryData);
    console.log(`✓ Created category: ${category.title} (ID: ${category._id})\n`);

    // Step 2: Create menu items with reference to category
    console.log('Creating menu items...');
    for (const item of menuItemsData) {
      const menuItem = await client.create({
        ...item,
        category: {
          _type: 'reference',
          _ref: category._id,
        },
      });
      console.log(`✓ Created: ${menuItem.name}`);
    }

    console.log(`\n✓ Imported ${menuItemsData.length} menu items\n`);

    // Step 3: Create or update site settings
    console.log('Creating site settings...');
    const settings = await client.createOrReplace(siteSettingsData);
    console.log(`✓ Created site settings\n`);

    console.log('🎉 Import complete!');
    console.log('\nSummary:');
    console.log(`- 1 menu category created`);
    console.log(`- ${menuItemsData.length} menu items created`);
    console.log(`- Site settings configured`);
    console.log(
      '\nYou can now view these in Sanity Studio at http://localhost:3000/studio'
    );
  } catch (error) {
    console.error('Error importing content:', error);
    process.exit(1);
  }
}

// Run the import
importContent();
