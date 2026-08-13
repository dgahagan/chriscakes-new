/**
 * One-time content migration: seeds the Fundraising Menus category, its
 * menu items, 6 general FAQs, and 3 testimonials into Sanity.
 *
 * SAFE BY DESIGN AGAINST A POPULATED DATASET: this script's writes
 * (menuCategory, menuItem, faq, testimonial) only ever run against a
 * dataset that has ZERO existing documents of ALL FOUR of those types. If
 * the dataset already has any menu category, menu item, FAQ, or
 * testimonial — from a prior run of this script, another import script, or
 * manual edits in Studio — the script writes NOTHING. It only prints a
 * divergence report (entries in this file's hardcoded data that have no
 * matching document in the dataset) so an operator can see what differs.
 * This is intentional: once real content exists, this script must never
 * resurrect or duplicate items an editor may have deleted or already
 * created on purpose, so it is permanently inert against live data.
 *
 * Existence matching uses slug.current OR title/name for menu categories
 * and menu items (slugs can drift — e.g. Sanity auto-deduplicating a slug
 * to `-2` on an earlier import). FAQs and testimonials have no slug field,
 * so they are matched on `question` and `author` respectively.
 *
 * When the dataset IS empty for all four types, the full import runs and
 * creates every document with a deterministic id (`menuCategory-<slug>`,
 * `menuItem-<slug>`, `faq-<order>`, `testimonial-<order>`) via
 * `createIfNotExists`.
 *
 * Refuses to run without `--yes` and prints the target project and dataset
 * before touching anything.
 *
 *   npx tsx scripts/import-additional-content.ts --yes
 */
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

// Fundraising Category
const fundraisingCategoryData = {
  _id: 'menuCategory-fundraising-menus',
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
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set');
  }
  if (!dataset) {
    throw new Error('NEXT_PUBLIC_SANITY_DATASET is not set');
  }
  if (!token) {
    throw new Error('SANITY_API_TOKEN is not set (required to write)');
  }

  console.log(`Target project : ${projectId}`);
  console.log(`Target dataset : ${dataset}`);

  if (!process.argv.includes('--yes')) {
    console.error(
      '\nRefusing to run without --yes. This is a one-time migration script ' +
        'that writes to the dataset above. Re-run with --yes to proceed.'
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    useCdn: false,
    token,
    apiVersion: '2024-01-01',
  });

  const failures: Array<{ name: string; error: unknown }> = [];

  try {
    console.log(
      '\nStarting import of FAQs, Testimonials, and Fundraising menu...\n'
    );

    // Populated-dataset guard: if the dataset already has ANY menuCategory,
    // menuItem, faq, or testimonial document, this script must not write to
    // it — see the header comment for why. It only reports what diverges.
    const [categoryCount, itemCount, faqCount, testimonialCount] =
      await Promise.all([
        client.fetch<number>(`count(*[_type == "menuCategory"])`),
        client.fetch<number>(`count(*[_type == "menuItem"])`),
        client.fetch<number>(`count(*[_type == "faq"])`),
        client.fetch<number>(`count(*[_type == "testimonial"])`),
      ]);
    const isPopulated =
      categoryCount > 0 ||
      itemCount > 0 ||
      faqCount > 0 ||
      testimonialCount > 0;

    if (isPopulated) {
      console.log(
        `Dataset already has content: ${categoryCount} menu categories, ${itemCount} menu items, ${faqCount} FAQs, ${testimonialCount} testimonials.`
      );
      console.log(
        'Refusing to create or modify any menu category / menu item / FAQ / testimonial — ' +
          'this script only performs the initial import into an empty dataset. See header comment.\n'
      );

      const [
        existingCategories,
        existingItems,
        existingFaqs,
        existingTestimonials,
      ] = await Promise.all([
        client.fetch<
          Array<{ _id: string; title: string; slug: string | null }>
        >(`*[_type == "menuCategory"]{ _id, title, "slug": slug.current }`),
        client.fetch<Array<{ _id: string; name: string; slug: string | null }>>(
          `*[_type == "menuItem"]{ _id, name, "slug": slug.current }`
        ),
        client.fetch<Array<{ _id: string; question: string }>>(
          `*[_type == "faq"]{ _id, question }`
        ),
        client.fetch<Array<{ _id: string; author: string }>>(
          `*[_type == "testimonial"]{ _id, author }`
        ),
      ]);

      const categorySlugs = new Set(
        existingCategories
          .map((c) => c.slug)
          .filter((s): s is string => Boolean(s))
      );
      const categoryTitles = new Set(existingCategories.map((c) => c.title));
      const itemSlugs = new Set(
        existingItems.map((i) => i.slug).filter((s): s is string => Boolean(s))
      );
      const itemNames = new Set(existingItems.map((i) => i.name));
      const faqQuestions = new Set(existingFaqs.map((f) => f.question));
      const testimonialAuthors = new Set(
        existingTestimonials.map((t) => t.author)
      );

      const categoryMissing =
        !categorySlugs.has(fundraisingCategoryData.slug.current) &&
        !categoryTitles.has(fundraisingCategoryData.title);
      const missingItems = fundraisingMenuItems.filter(
        (item) => !itemSlugs.has(item.slug) && !itemNames.has(item.name)
      );
      const missingFaqs = faqsData.filter(
        (faq) => !faqQuestions.has(faq.question)
      );
      const missingTestimonials = testimonialsData.filter(
        (testimonial) => !testimonialAuthors.has(testimonial.author)
      );

      console.log('Divergence report (no writes performed):');
      if (
        !categoryMissing &&
        missingItems.length === 0 &&
        missingFaqs.length === 0 &&
        missingTestimonials.length === 0
      ) {
        console.log(
          '  None — every category, menu item, FAQ, and testimonial in this file has a match in the dataset.'
        );
      } else {
        if (categoryMissing) {
          console.log(
            `  Present in script data but not in dataset (menu categories): ${fundraisingCategoryData.title}`
          );
        }
        if (missingItems.length > 0) {
          console.log(
            `  Present in script data but not in dataset (menu items): ${missingItems
              .map((i) => i.name)
              .join(', ')}`
          );
        }
        if (missingFaqs.length > 0) {
          console.log(
            `  Present in script data but not in dataset (FAQs): ${missingFaqs
              .map((f) => f.question)
              .join(', ')}`
          );
        }
        if (missingTestimonials.length > 0) {
          console.log(
            `  Present in script data but not in dataset (testimonials): ${missingTestimonials
              .map((t) => t.author)
              .join(', ')}`
          );
        }
      }
      console.log(
        '\nNo menu categories, menu items, FAQs, or testimonials were created or modified.\n'
      );
    } else {
      console.log(
        'Dataset has no existing content of these types — importing.\n'
      );

      // Step 1: Create fundraising category with a deterministic id.
      console.log('Creating Fundraising category...');
      try {
        const fundraisingCategory = await client.createIfNotExists(
          fundraisingCategoryData
        );
        console.log(
          `✓ Created: ${fundraisingCategory.title} (ID: ${fundraisingCategory._id})\n`
        );
      } catch (error) {
        failures.push({ name: 'Fundraising category', error });
        console.error('✗ Error creating Fundraising category:', error);
      }

      // Step 2: Create fundraising menu items with deterministic ids,
      // referencing the category above.
      console.log('Creating fundraising menu items...');
      let itemsCreated = 0;
      for (const item of fundraisingMenuItems) {
        try {
          const menuItem = await client.createIfNotExists({
            _id: `menuItem-${item.slug}`,
            _type: 'menuItem',
            name: item.name,
            slug: { _type: 'slug', current: item.slug },
            description: item.description,
            available: true,
            featured: false,
            order: item.order,
            category: {
              _type: 'reference',
              _ref: fundraisingCategoryData._id,
            },
          });
          console.log(`✓ Created: ${menuItem.name}`);
          itemsCreated++;
        } catch (error) {
          failures.push({ name: `Menu item: ${item.name}`, error });
          console.error(`✗ Error creating menu item ${item.name}:`, error);
        }
      }
      console.log(`\n✓ Imported ${itemsCreated} fundraising menu items\n`);

      // Step 3: Create FAQs with deterministic ids.
      console.log('Creating FAQs...');
      let faqsCreated = 0;
      for (const faq of faqsData) {
        try {
          await client.createIfNotExists({
            _id: `faq-${faq.order}`,
            ...faq,
          });
          console.log(`✓ Created FAQ: ${faq.question.substring(0, 50)}...`);
          faqsCreated++;
        } catch (error) {
          failures.push({ name: `FAQ: ${faq.question}`, error });
          console.error(`✗ Error creating FAQ "${faq.question}":`, error);
        }
      }
      console.log(`\n✓ Imported ${faqsCreated} FAQs\n`);

      // Step 4: Create testimonials with deterministic ids.
      console.log('Creating testimonials...');
      let testimonialsCreated = 0;
      for (const testimonial of testimonialsData) {
        try {
          await client.createIfNotExists({
            _id: `testimonial-${testimonial.order}`,
            ...testimonial,
          });
          console.log(`✓ Created testimonial from: ${testimonial.author}`);
          testimonialsCreated++;
        } catch (error) {
          failures.push({ name: `Testimonial: ${testimonial.author}`, error });
          console.error(
            `✗ Error creating testimonial from ${testimonial.author}:`,
            error
          );
        }
      }
      console.log(`\n✓ Imported ${testimonialsCreated} testimonials\n`);

      console.log('Summary:');
      console.log(`- Fundraising category: attempted 1`);
      console.log(
        `- ${itemsCreated}/${fundraisingMenuItems.length} fundraising menu items created`
      );
      console.log(`- ${faqsCreated}/${faqsData.length} FAQs created`);
      console.log(
        `- ${testimonialsCreated}/${testimonialsData.length} testimonials created`
      );
      console.log(
        '\nYou can now view these in Sanity Studio at http://localhost:3000/studio'
      );
    }

    if (failures.length > 0) {
      console.log(`\n✗ ${failures.length} item(s) FAILED to import:`);
      for (const failure of failures) {
        console.log(`  - ${failure.name}: ${String(failure.error)}`);
      }
      process.exit(1);
    } else {
      console.log('\n🎉 Import complete!\n');
    }
  } catch (error) {
    console.error('Error importing content:', error);
    process.exit(1);
  }
}

// Run the import
importAdditionalContent();
