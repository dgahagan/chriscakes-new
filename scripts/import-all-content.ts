/**
 * One-time content migration: seeds menu categories, menu items, and (if
 * absent) site settings into Sanity.
 *
 * SAFE BY DESIGN AGAINST A POPULATED DATASET: this script's catalogue
 * writes (menu categories, menu items) only ever run against an EMPTY
 * dataset (zero `menuCategory` and zero `menuItem` documents). If the
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
 * When the catalogue IS empty, the full import runs and creates every
 * category/item with a deterministic `menuCategory-<slug>` /
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
 *   npx tsx scripts/import-all-content.ts --yes
 */
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

// Menu Categories
const categoriesData = [
  {
    _id: 'menuCategory-breakfast-menus',
    _type: 'menuCategory',
    title: 'Breakfast Menus',
    slug: { _type: 'slug', current: 'breakfast-menus' },
    description: 'Premier Breakfast Caterers',
    order: 1,
  },
  {
    _id: 'menuCategory-breakfast-a-la-carte',
    _type: 'menuCategory',
    title: 'Breakfast A-La-Carte',
    slug: { _type: 'slug', current: 'breakfast-a-la-carte' },
    description:
      'Add any of the following menu items to the Original Chris Cakes Menu or customize your own menu',
    order: 2,
  },
  {
    _id: 'menuCategory-menus-n-more-lunch-dinner',
    _type: 'menuCategory',
    title: 'Menus N More - Lunch & Dinner',
    slug: { _type: 'slug', current: 'menus-n-more-lunch-dinner' },
    description:
      'Corporate - Office - Employee & Member Appreciation - Family Reunions - Church Gatherings',
    order: 3,
  },
  {
    _id: 'menuCategory-menus-n-more',
    _type: 'menuCategory',
    title: 'Menus N More',
    slug: { _type: 'slug', current: 'menus-n-more' },
    description:
      'Graduations - Weddings - School & Church Picnics - Birthdays - Anniversaries',
    order: 4,
  },
  {
    _id: 'menuCategory-menus-n-more-a-la-carte',
    _type: 'menuCategory',
    title: 'Menus N More A-La-Carte',
    slug: { _type: 'slug', current: 'menus-n-more-a-la-carte' },
    description:
      'Call our Office to tailor your Menu… No group too large or too small!',
    order: 5,
  },
];

// Menu item data structure for import
interface MenuItemData {
  name: string;
  slug: string;
  description?: string;
  price?: number;
  featured?: boolean;
  order: number;
}

// All menu items organized by category
const menuItemsByCategory: Record<string, MenuItemData[]> = {
  'Breakfast Menus': [
    {
      name: 'Easy Breezy',
      slug: 'easy-breezy',
      description:
        'Scrambled eggs served with bagels and cream cheese complete with a fresh fruit yogurt and granola parfait and Tang. Includes paper goods and cutlery.',
      order: 1,
    },
    {
      name: 'Cakes & Eggs',
      slug: 'cakes-and-eggs',
      description:
        'Unlimited Pancakes served with sausage links, scrambled eggs, margarine, syrup, sugar free syrup and Tang. Includes paper goods and cutlery.',
      featured: true,
      order: 2,
    },
    {
      name: 'Top Cake',
      slug: 'top-cake',
      description:
        'Unlimited Pancakes served with sausage links. Topping bar includes your choice of 2 fruits, chocolate chips, sprinkles, whipped cream and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery.',
      order: 3,
    },
    {
      name: 'Chris Cakes Deluxe',
      slug: 'chris-cakes-deluxe',
      description:
        'Unlimited Pancakes served with scrambled eggs, sausage links, hash browns and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery.',
      featured: true,
      order: 4,
    },
    {
      name: 'Big Chris',
      slug: 'big-chris',
      description:
        'Unlimited Pancakes served with two meat choices, scrambled eggs, hash browns, and Tang. Includes margarine, syrup, sugar free syrup, paper products and cutlery.',
      order: 5,
    },
    {
      name: 'French Toast Lite',
      slug: 'french-toast-lite',
      description:
        'French Toast served with sausage links, margarine, syrup and sugar free syrup and Tang. Includes paper goods and cutlery.',
      order: 6,
    },
    {
      name: 'French Toast N Eggs',
      slug: 'french-toast-n-eggs',
      description:
        'Handmade golden French toast served with scrambled eggs, sausage links and Tang. Includes syrup, margarine and sugar free syrup, paper goods and cutlery.',
      order: 7,
    },
    {
      name: "Biscuits 'N Gravy",
      slug: 'biscuits-n-gravy',
      description:
        'Tasty hot biscuits with sausage gravy served with scrambled eggs and Tang. Includes paper goods and cutlery.',
      order: 8,
    },
  ],
  'Breakfast A-La-Carte': [
    {
      name: 'Turkey Sausage',
      slug: 'turkey-sausage',
      description: 'Limit 3 links per person',
      order: 1,
    },
    {
      name: 'Bacon',
      slug: 'bacon',
      description: 'Limit 3 slices per person',
      order: 2,
    },
    {
      name: 'Ham',
      slug: 'ham',
      description: 'Limit 3 triangles per person',
      order: 3,
    },
    {
      name: 'Scrambled Eggs',
      slug: 'scrambled-eggs',
      description: '',
      order: 4,
    },
    {
      name: 'Hash Browns',
      slug: 'hash-browns',
      description: '',
      order: 5,
    },
    {
      name: 'Biscuits N Gravy',
      slug: 'biscuits-n-gravy-alacarte',
      description: '',
      order: 6,
    },
    {
      name: 'French Toast',
      slug: 'french-toast',
      description: 'Limit 3 half slices per person',
      order: 7,
    },
    {
      name: 'Fresh Fruit Cup',
      slug: 'fresh-fruit-cup',
      description: '',
      order: 8,
    },
    {
      name: 'Real Orange Juice',
      slug: 'real-orange-juice',
      description: '',
      price: 0.5,
      order: 9,
    },
    {
      name: 'Coffee or Tea',
      slug: 'coffee-or-tea',
      description: '',
      order: 10,
    },
    {
      name: 'Topping Bar',
      slug: 'topping-bar',
      description: '',
      order: 11,
    },
    {
      name: 'Yogurt Bar',
      slug: 'yogurt-bar',
      description: 'Includes granola and fresh fruit',
      order: 12,
    },
  ],
  'Menus N More - Lunch & Dinner': [
    {
      name: 'Box Lunches',
      slug: 'box-lunches',
      description:
        'Choice of shaved ham, turkey, chicken or salami served on mini Hoagie roll. Including lettuce, tomato & cheese served with condiments, a pickle spear, chips and a cookie.',
      order: 1,
    },
    {
      name: "Dogs N' More",
      slug: 'dogs-n-more',
      description:
        'Grilled hot dogs (2 per person) and buns served with your choice of side dish, potato chips, condiments and pink lemonade.',
      order: 2,
    },
    {
      name: "Coneys N' More",
      slug: 'coneys-n-more',
      description:
        'Our vintage coney sauce recipe served over grilled hot dogs buns, mac n cheese, cookie and pink lemonade. Includes ketchup, mustard, relish, onion and paper goods and cutlery.',
      order: 3,
    },
    {
      name: 'Taco Bar / Nacho Bar',
      slug: 'taco-nacho-bar',
      description:
        'Both corn taco shells and flour tortillas or nacho chips served with taco meat, refried beans, lettuce, diced tomatoes, grated cheese, salsa, sour cream and jalapenos.',
      order: 4,
    },
    {
      name: "Brats N' More",
      slug: 'brats-n-more',
      description:
        'Beer boiled and grilled brats, buns served with your choice of one side and potato chips, condiments and pink lemonade.',
      order: 5,
    },
    {
      name: "Burgers N' More",
      slug: 'burgers-n-more-lunch',
      description:
        'USDA Choice Pub burger, buns with your choice of one side and potato chips, mustard, ketchup, dill pickle slices, onions and pink lemonade. Add Cheese +$0.50 pp | Add Lettuce, Tomato and Cheese $1.50 pp',
      order: 6,
    },
  ],
  'Menus N More': [
    {
      name: "Burger's N Dogs / Burger's N Brats",
      slug: 'burgers-n-dogs-brats',
      description:
        'USDA Choice Pub burger, buns with your choice of either hot dogs or brats, one side and potato chips, mustard, ketchup, dill pickle slices, relish, onions and pink lemonade.',
      order: 1,
    },
    {
      name: "Grill Chicken N' More",
      slug: 'grill-chicken-n-more',
      description:
        'Grill Tyson chicken breast and bun served with your choice of one side, potato chips, BBQ sauce, mayo, mustard, pickle slices and pink lemonade.',
      order: 2,
    },
    {
      name: "Pasta N' More",
      slug: 'pasta-n-more',
      description:
        'Spaghetti with meat sauce, chicken penne alfredo, side salad, rolls & butter served with pink lemonade or iced tea. Includes paper goods and cutlery.',
      order: 3,
    },
    {
      name: "BBQ N' More",
      slug: 'bbq-n-more',
      description:
        "Choose your meat (pork, chicken, turkey) and sides and call our office for more info. It ain't your car Smokin'… It's our BBQ!!",
      featured: true,
      order: 4,
    },
  ],
  'Menus N More A-La-Carte': [
    { name: 'Beef Brisket', slug: 'beef-brisket', order: 1 },
    { name: 'Pulled Pork', slug: 'pulled-pork', order: 2 },
    { name: 'Smoked Chicken', slug: 'smoked-chicken', order: 3 },
    { name: 'Smoked Turkey', slug: 'smoked-turkey', order: 4 },
    { name: 'Smoked Potato Salad', slug: 'smoked-potato-salad', order: 5 },
    { name: 'Pasta Salad', slug: 'pasta-salad', order: 6 },
    { name: 'Cowboy Beans', slug: 'cowboy-beans', order: 7 },
    { name: 'Baked Beans', slug: 'baked-beans', order: 8 },
    { name: 'Vinegar N Oil Coleslaw', slug: 'vinegar-oil-coleslaw', order: 9 },
    { name: 'Mayo Slaw', slug: 'mayo-slaw', order: 10 },
    { name: 'Macaroni Salad', slug: 'macaroni-salad', order: 11 },
    { name: 'Mac N Chez', slug: 'mac-n-chez', order: 12 },
    { name: 'Garden Salad', slug: 'garden-salad', order: 13 },
    { name: 'Caesar Salad', slug: 'caesar-salad', order: 14 },
    { name: 'Southwest Salad', slug: 'southwest-salad', order: 15 },
    { name: 'Tex Mex Salad', slug: 'tex-mex-salad', order: 16 },
    { name: 'Broccoli Salad', slug: 'broccoli-salad', order: 17 },
    { name: 'Cucumber Salad', slug: 'cucumber-salad', order: 18 },
    { name: 'Taco Salad', slug: 'taco-salad', order: 19 },
    { name: 'Couscous Salad', slug: 'couscous-salad', order: 20 },
    { name: 'Corn', slug: 'corn', order: 21 },
    { name: 'Green Beans', slug: 'green-beans', order: 22 },
    { name: 'Relish Trays', slug: 'relish-trays', order: 23 },
    { name: 'Meat N Chez Trays', slug: 'meat-n-chez-trays', order: 24 },
    { name: 'Veggie Trays', slug: 'veggie-trays', order: 25 },
    { name: 'Fresh Fruit', slug: 'fresh-fruit', order: 26 },
    { name: 'Brownies', slug: 'brownies', order: 27 },
    { name: 'Cookies', slug: 'cookies', order: 28 },
    { name: 'Bottled Water', slug: 'bottled-water', order: 29 },
    { name: 'Soda Pop', slug: 'soda-pop', order: 30 },
    { name: 'Punch', slug: 'punch', order: 31 },
    { name: 'Lemonade', slug: 'lemonade', order: 32 },
    { name: 'Coffee', slug: 'coffee', order: 33 },
    { name: 'Iced & Hot Tea', slug: 'iced-hot-tea', order: 34 },
  ],
};

const allMenuItems: MenuItemData[] = Object.values(menuItemsByCategory).flat();

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
    console.log('\nStarting full content import...\n');

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

      const missingCategories = categoriesData.filter(
        (c) =>
          !categorySlugs.has(c.slug.current) && !categoryTitles.has(c.title)
      );
      const missingItems = allMenuItems.filter(
        (i) => !itemSlugs.has(i.slug) && !itemNames.has(i.name)
      );

      console.log('Divergence report (no writes performed):');
      if (missingCategories.length === 0 && missingItems.length === 0) {
        console.log(
          '  None — every category and menu item in this file has a match in the dataset (by slug or title/name).'
        );
      } else {
        if (missingCategories.length > 0) {
          console.log(
            `  Present in script data but not in dataset (menu categories): ${missingCategories
              .map((c) => c.title)
              .join(', ')}`
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

      // Step 1: Create every category with a deterministic id.
      console.log('Creating menu categories...');
      const categoryMap: Record<string, string> = {};
      for (const categoryData of categoriesData) {
        const category = await client.createIfNotExists(categoryData);
        categoryMap[categoryData.title] = category._id;
        console.log(`✓ Created: ${category.title} (ID: ${category._id})`);
      }
      console.log(`\n✓ Created ${categoriesData.length} categories\n`);

      // Step 2: Create every menu item with a deterministic id, referencing
      // the category just created above.
      console.log('Creating menu items...\n');
      let totalItems = 0;
      for (const [categoryTitle, items] of Object.entries(
        menuItemsByCategory
      )) {
        console.log(`Importing ${categoryTitle}...`);
        const categoryId = categoryMap[categoryTitle];

        for (const item of items) {
          await client.createIfNotExists({
            _id: `menuItem-${item.slug}`,
            _type: 'menuItem',
            name: item.name,
            slug: { _type: 'slug', current: item.slug },
            description: item.description || '',
            ...(item.price !== undefined ? { price: item.price } : {}),
            available: true,
            featured: item.featured || false,
            order: item.order,
            category: {
              _type: 'reference',
              _ref: categoryId,
            },
          });
          totalItems++;
        }
        console.log(`  ✓ Imported ${items.length} items`);
      }
      console.log(`\n✓ Imported ${totalItems} total menu items\n`);
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
