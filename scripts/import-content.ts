/**
 * One-time content migration: seeds the Breakfast Menus category, its menu
 * items, and (if absent) site settings into Sanity.
 *
 * SAFE BY DESIGN AGAINST A POPULATED DATASET: this script's catalogue
 * writes (the menu category, its menu items) only ever run against an
 * EMPTY dataset (zero `menuCategory` and zero `menuItem` documents). If the
 * dataset already has any catalogue content — from a prior run of this
 * script, an earlier non-idempotent version of it, or manual edits in
 * Studio — the script writes NOTHING to the catalogue. It only prints a
 * divergence report (entries in this file's hardcoded data that have no
 * matching document in the dataset, by slug or by title/name) so an
 * operator can see what differs. This is intentional: once real content
 * exists, this script must never resurrect items an editor may have
 * deleted on purpose, so it is permanently inert against live data.
 *
 * Existence matching uses slug.current OR title/name — slugs can drift
 * (e.g. Sanity auto-deduplicating a slug to `-2` on an earlier import), so
 * slug alone is not a reliable identity key.
 *
 * When the catalogue IS empty, the full import runs and creates the
 * category/items with a deterministic `menuCategory-<slug>` /
 * `menuItem-<slug>` id (via `createIfNotExists`).
 *
 * The `siteSettings` singleton is handled independently of the catalogue
 * guard above: it is always created via `createIfNotExists`, so an
 * existing settings document is never overwritten, but a missing one is
 * still created even when the catalogue is already populated.
 *
 * Refuses to run without `--yes` and prints the target project and dataset
 * before touching anything.
 *
 *   npx tsx scripts/import-content.ts --yes
 */
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

// Menu data from the old site
const breakfastCategoryData = {
  _id: 'menuCategory-breakfast-menus',
  _type: 'menuCategory',
  title: 'Breakfast Menus',
  slug: { _type: 'slug', current: 'breakfast-menus' },
  description: 'Premier Breakfast Caterers',
  order: 1,
};

const menuItemsData = [
  {
    _id: 'menuItem-easy-breezy',
    _type: 'menuItem',
    name: 'Easy Breezy',
    slug: { _type: 'slug', current: 'easy-breezy' },
    description:
      'Scrambled eggs served with bagels and cream cheese complete with a fresh fruit yogurt and granola parfait and Tang. Includes paper goods and cutlery.',
    // Call for pricing
    available: true,
    featured: false,
    order: 1,
  },
  {
    _id: 'menuItem-cakes-and-eggs',
    _type: 'menuItem',
    name: 'Cakes & Eggs',
    slug: { _type: 'slug', current: 'cakes-and-eggs' },
    description:
      'Unlimited Pancakes served with sausage links, scrambled eggs, margarine, syrup, sugar free syrup and Tang. Includes paper goods and cutlery.',
    available: true,
    featured: true,
    order: 2,
  },
  {
    _id: 'menuItem-top-cake',
    _type: 'menuItem',
    name: 'Top Cake',
    slug: { _type: 'slug', current: 'top-cake' },
    description:
      'Unlimited Pancakes served with sausage links. Topping bar includes your choice of 2 fruits, chocolate chips, sprinkles, whipped cream and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery.',
    available: true,
    featured: false,
    order: 3,
  },
  {
    _id: 'menuItem-chris-cakes-deluxe',
    _type: 'menuItem',
    name: 'Chris Cakes Deluxe',
    slug: { _type: 'slug', current: 'chris-cakes-deluxe' },
    description:
      'Unlimited Pancakes served with scrambled eggs, sausage links, hash browns and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery.',
    available: true,
    featured: true,
    order: 4,
  },
  {
    _id: 'menuItem-big-chris',
    _type: 'menuItem',
    name: 'Big Chris',
    slug: { _type: 'slug', current: 'big-chris' },
    description:
      'Unlimited Pancakes served with two meat choices, scrambled eggs, hash browns, and Tang. Includes margarine, syrup, sugar free syrup, paper products and cutlery.',
    available: true,
    featured: false,
    order: 5,
  },
  {
    _id: 'menuItem-french-toast-lite',
    _type: 'menuItem',
    name: 'French Toast Lite',
    slug: { _type: 'slug', current: 'french-toast-lite' },
    description:
      'French Toast served with sausage links, margarine, syrup and sugar free syrup and Tang. Includes paper goods and cutlery.',
    available: true,
    featured: false,
    order: 6,
  },
  {
    _id: 'menuItem-french-toast-n-eggs',
    _type: 'menuItem',
    name: 'French Toast N Eggs',
    slug: { _type: 'slug', current: 'french-toast-n-eggs' },
    description:
      'Handmade golden French toast served with scrambled eggs, sausage links and Tang. Includes syrup, margarine and sugar free syrup, paper goods and cutlery.',
    available: true,
    featured: false,
    order: 7,
  },
  {
    _id: 'menuItem-biscuits-n-gravy',
    _type: 'menuItem',
    name: "Biscuits 'N Gravy",
    slug: { _type: 'slug', current: 'biscuits-n-gravy' },
    description:
      'Tasty hot biscuits with sausage gravy served with scrambled eggs and Tang. Includes paper goods and cutlery.',
    available: true,
    featured: false,
    order: 8,
  },
];

// Site settings singleton. Only created if one doesn't already exist —
// see the `createIfNotExists` call below. Shape matches
// sanity/schemas/siteSettings.ts.
const siteSettingsData = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'ChrisCakes of Michigan',
  description:
    "Premier breakfast caterer and large event specialist serving Michigan since 1969. Chris Cakes is more than great food at an affordable price... it's an experience!",
  phone: '989-802-0755',
  email: 'chriscakesmi@sbcglobal.net',
  contactFormRecipients: ['chriscakesmi@sbcglobal.net'],
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
    platforms: [],
  },
};

async function importContent() {
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

  try {
    console.log('\nStarting content import...\n');

    // Populated-dataset guard: if the catalogue already has ANY menuCategory
    // or menuItem documents, this script must not write to it — see the
    // header comment for why. It only reports what diverges.
    const [categoryCount, itemCount] = await Promise.all([
      client.fetch<number>(`count(*[_type == "menuCategory"])`),
      client.fetch<number>(`count(*[_type == "menuItem"])`),
    ]);
    const isPopulated = categoryCount > 0 || itemCount > 0;

    if (isPopulated) {
      console.log(
        `Dataset already has catalogue content: ${categoryCount} menu categories, ${itemCount} menu items.`
      );
      console.log(
        'Refusing to create or modify any menu category / menu item — this script only ' +
          'performs the initial import into an empty dataset. See header comment.\n'
      );

      const existingCategories = await client.fetch<
        Array<{ _id: string; title: string; slug: string | null }>
      >(`*[_type == "menuCategory"]{ _id, title, "slug": slug.current }`);
      const existingItems = await client.fetch<
        Array<{ _id: string; name: string; slug: string | null }>
      >(`*[_type == "menuItem"]{ _id, name, "slug": slug.current }`);

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

      const categoryMissing =
        !categorySlugs.has(breakfastCategoryData.slug.current) &&
        !categoryTitles.has(breakfastCategoryData.title);
      const missingItems = menuItemsData.filter(
        (item) => !itemSlugs.has(item.slug.current) && !itemNames.has(item.name)
      );

      console.log('Divergence report (no writes performed):');
      if (!categoryMissing && missingItems.length === 0) {
        console.log(
          '  None — every category and menu item in this file has a match in the dataset (by slug or title/name).'
        );
      } else {
        if (categoryMissing) {
          console.log(
            `  Present in script data but not in dataset (menu categories): ${breakfastCategoryData.title}`
          );
        }
        if (missingItems.length > 0) {
          console.log(
            `  Present in script data but not in dataset (menu items): ${missingItems
              .map((i) => i.name)
              .join(', ')}`
          );
        }
      }
      console.log(
        '\nNo menu categories or menu items were created or modified.\n'
      );
    } else {
      console.log('Dataset has no existing catalogue content — importing.\n');

      // Step 1: Create the Breakfast Menus category with a deterministic id.
      console.log('Creating Breakfast Menus category...');
      const category = await client.createIfNotExists(breakfastCategoryData);
      console.log(
        `✓ Created category: ${category.title} (ID: ${category._id})\n`
      );

      // Step 2: Create menu items with a deterministic id, referencing the
      // category just created above.
      console.log('Creating menu items...');
      for (const item of menuItemsData) {
        const menuItem = await client.createIfNotExists({
          ...item,
          category: {
            _type: 'reference',
            _ref: category._id,
          },
        });
        console.log(`✓ Created: ${menuItem.name}`);
      }
      console.log(`\n✓ Imported ${menuItemsData.length} menu items\n`);
    }

    // Site settings: independent of the catalogue guard above — always safe
    // to attempt since createIfNotExists never overwrites an existing doc.
    console.log('Ensuring site settings exist...');
    const existingSettings = await client.getDocument('siteSettings');
    await client.createIfNotExists(siteSettingsData);
    if (existingSettings) {
      console.log('✓ Site settings already existed — left untouched\n');
    } else {
      console.log('✓ Created site settings\n');
    }

    console.log('🎉 Import complete!\n');
    console.log(
      'You can view content in Sanity Studio at http://localhost:3000/studio'
    );
  } catch (error) {
    console.error('Error importing content:', error);
    process.exit(1);
  }
}

// Run the import
importContent();
