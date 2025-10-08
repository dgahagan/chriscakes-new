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

// Fundraising Category
const fundraisingCategoryData = {
  _type: 'menuCategory',
  title: 'Fundraising Menus',
  slug: { _type: 'slug', current: 'fundraising-menus' },
  description:
    'SCHOOLS - CHURCHES - BENEFITS - CLUBS/ORGANIZATIONS - FESTIVALS - AIRPORT FLY-INS',
  order: 6,
};

// Fundraising Menu Items
const fundraisingMenuItems = [
  {
    name: 'Original Chris Cakes',
    slug: 'original-chris-cakes-fundraising',
    description:
      'All-you-can-eat pancakes served with three sausage links, margarine, syrup, sugar free syrup and Tang. Includes paper goods and cutlery.',
    order: 1,
  },
  {
    name: 'Hot Dog Bash',
    slug: 'hot-dog-bash',
    description:
      'All-you-can-eat hot dogs, buns, baked beans, chips and pink lemonade. Includes ketchup, mustard, relish, onions, paper goods, and cutlery. Coney Sauce add $1.00 pp',
    order: 2,
  },
  {
    name: 'Coney Night',
    slug: 'coney-night',
    description:
      'Our vintage Coney Sauce recipe served over grilled hot dogs, buns, Mac n cheese, pink lemonade. Includes ketchup, mustard, relish, onion, paper goods, and cutlery.',
    order: 3,
  },
  {
    name: 'Spaghetti Dinners',
    slug: 'spaghetti-dinners-fundraising',
    description:
      'All-you-can-eat spaghetti with meat sauce, side salad, rolls, and butter served with pink lemonade or iced tea. Includes paper goods, and cutlery.',
    order: 4,
  },
];

// FAQs
const faqsData = [
  {
    _type: 'faq',
    question: 'Do you travel to Detroit?',
    answer:
      'Yes! Chris Cakes of Michigan serves the whole state of Michigan. Since we are centrally located in Clare, we can travel to anywhere in the mitten in just a couple of hours.',
    category: 'general',
    order: 1,
  },
  {
    _type: 'faq',
    question: 'Does your pancake mix have peanuts in it?',
    answer:
      'Our specially blended mix does not contain nuts. In the past we have never had a problem, however our pancake mix is blended and prepared in a mill and we cannot guarantee there will be no cross contamination. Check out our NUTRITION & ALLERGY page for additional information.',
    category: 'food',
    order: 2,
  },
  {
    _type: 'faq',
    question: 'How many pancakes has Chris Cakes "flipped"?',
    answer:
      'More than 34,000,000. Laid end-to-end, they would stretch from Los Angeles, CA to Springfield, IL!',
    category: 'general',
    order: 3,
  },
  {
    _type: 'faq',
    question: 'Do you cater more than just pancakes?',
    answer:
      'Yes! We have several different menus to choose from, check out our MENUS & MORE section!',
    category: 'general',
    order: 4,
  },
  {
    _type: 'faq',
    question: 'Who provides the tables and chairs?',
    answer:
      'Your group will provides tables, chairs, and trash receptacles. We will also need 2-4 tables for serving.',
    category: 'event-day',
    order: 5,
  },
  {
    _type: 'faq',
    question: "What happens if I don't have enough volunteers?",
    answer:
      'If you do not have volunteers to help, we can bring additional staff to work for a nominal fee.',
    category: 'event-day',
    order: 6,
  },
];

// Testimonials
const testimonialsData = [
  {
    _type: 'testimonial',
    quote:
      'Melanie and Trevor - Our event was a success. Trevor is a real pro! Everyone loved the flying pancakes. Organized, in all the right places. I am glad to hear you already have another event lined up in Lapeer. You have a great thing going! I love it. We will stop in and see you this summer!',
    author: 'Matt English',
    authorTitle: 'Cubmaster, Pack 126',
    featured: true,
    order: 1,
  },
  {
    _type: 'testimonial',
    quote:
      'You guys did an awesome job at the Skrumpy Skedaddle! Organized clean Fast good food with a FLAIR! Thank you!',
    author: 'Dave Gillie',
    authorTitle: '',
    featured: false,
    order: 2,
  },
  {
    _type: 'testimonial',
    quote:
      'Melanie, Trevor and the gang at Chris Cakes - Thank you so much for the amazing event! Our team was thrilled with everything you did for us! Our families were really excited for our pancake fundraiser, and they really showed their support by showing up in such large numbers. We are so happy with the results that we hope to work with you again in the future! Please let us know if there is anything we can ever do to help you.',
    author: 'Scott Kefgen and the staff at UPA',
    authorTitle: '',
    featured: false,
    order: 3,
  },
];

async function importAdditionalContent() {
  try {
    console.log('Starting import of FAQs, Testimonials, and Fundraising menu...\n');

    // Step 1: Create fundraising category
    console.log('Creating Fundraising category...');
    const fundraisingCategory = await client.create(fundraisingCategoryData);
    console.log(
      `✓ Created: ${fundraisingCategory.title} (ID: ${fundraisingCategory._id})\n`
    );

    // Step 2: Create fundraising menu items
    console.log('Creating fundraising menu items...');
    for (const item of fundraisingMenuItems) {
      const menuItem = await client.create({
        _type: 'menuItem',
        name: item.name,
        slug: { _type: 'slug', current: item.slug },
        description: item.description,
        price: null,
        available: true,
        featured: false,
        order: item.order,
        category: {
          _type: 'reference',
          _ref: fundraisingCategory._id,
        },
      });
      console.log(`✓ Created: ${menuItem.name}`);
    }
    console.log(`\n✓ Imported ${fundraisingMenuItems.length} fundraising menu items\n`);

    // Step 3: Create FAQs
    console.log('Creating FAQs...');
    for (const faq of faqsData) {
      await client.create(faq);
      console.log(`✓ Created FAQ: ${faq.question.substring(0, 50)}...`);
    }
    console.log(`\n✓ Imported ${faqsData.length} FAQs\n`);

    // Step 4: Create testimonials
    console.log('Creating testimonials...');
    for (const testimonial of testimonialsData) {
      await client.create(testimonial);
      console.log(`✓ Created testimonial from: ${testimonial.author}`);
    }
    console.log(`\n✓ Imported ${testimonialsData.length} testimonials\n`);

    console.log('🎉 Import complete!\n');
    console.log('Summary:');
    console.log(`- 1 fundraising category created`);
    console.log(`- ${fundraisingMenuItems.length} fundraising menu items created`);
    console.log(`- ${faqsData.length} FAQs created`);
    console.log(`- ${testimonialsData.length} testimonials created`);
    console.log(
      '\nYou can now view these in Sanity Studio at http://localhost:3000/studio'
    );
  } catch (error) {
    console.error('Error importing content:', error);
    process.exit(1);
  }
}

// Run the import
importAdditionalContent();
