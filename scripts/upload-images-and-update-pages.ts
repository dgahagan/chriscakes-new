import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

interface ImageAsset {
  _type: string;
  asset: {
    _type: string;
    _ref: string;
  };
  alt: string;
}

// Upload an image to Sanity
async function uploadImage(filePath: string, altText: string): Promise<ImageAsset> {
  const imageBuffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload('image', imageBuffer, {
    filename: path.basename(filePath),
  });

  console.log(`✓ Uploaded ${path.basename(filePath)}`);

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt: altText,
  };
}

// Helper function to create two-column section with image
function createTwoColumnSection(
  heading: string,
  content: string[],
  image: ImageAsset,
  imagePosition: 'left' | 'right' = 'left',
  ctaButton?: { text: string; link: string }
): any {
  const contentBlocks = content.map((text, index) => ({
    _type: 'block',
    _key: `block-${index}-${Math.random().toString(36).substring(7)}`,
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: text,
        marks: [],
      },
    ],
  }));

  return {
    _type: 'twoColumnSection',
    _key: `section-${Math.random().toString(36).substring(7)}`,
    heading,
    content: contentBlocks,
    image,
    imagePosition,
    ctaButton,
  };
}

// Helper functions from original import script
function createTextSection(title: string, paragraphs: string[]): any {
  const content = paragraphs.map((text, index) => ({
    _type: 'block',
    _key: `block-${index}-${Math.random().toString(36).substring(7)}`,
    style: 'normal',
    children: [
      {
        _type: 'span',
        text: text,
        marks: text.includes('Chris Cakes has been around since 1969') ? ['strong'] : [],
      },
    ],
  }));

  return {
    _type: 'textSection',
    _key: `section-${Math.random().toString(36).substring(7)}`,
    title,
    content,
  };
}

function createHighlightBox(
  title: string,
  items: string[],
  backgroundColor: 'gray' | 'crimson' | 'white' = 'gray',
  style: 'default' | 'checklist' | 'numbered' = 'checklist'
): any {
  return {
    _type: 'highlightBox',
    _key: `section-${Math.random().toString(36).substring(7)}`,
    title,
    items,
    backgroundColor,
    style,
  };
}

function createCTASection(
  heading: string,
  description: string,
  buttonText: string,
  buttonLink: string,
  style: 'primary' | 'secondary' = 'primary'
): any {
  return {
    _type: 'ctaSection',
    _key: `section-${Math.random().toString(36).substring(7)}`,
    heading,
    description,
    buttonText,
    buttonLink,
    style,
  };
}

async function uploadImagesAndUpdatePages() {
  console.log('Starting image upload and page update process...\n');

  // Upload all images
  console.log('Uploading images to Sanity...\n');

  const services1 = await uploadImage('public/services1.jpg', 'Fundraising Services');
  const services2 = await uploadImage('public/services2.jpg', 'Premiere Breakfast');
  const services3 = await uploadImage('public/services3.jpg', 'Menus N More');

  const invoice1 = await uploadImage('public/invoice1.jpg', 'University of Michigan Football');
  const invoice2 = await uploadImage('public/invoice2.jpg', 'Chris Cakes Catering');
  const invoice3 = await uploadImage('public/invoice3.jpg', 'Nutcake teaches Sparty how to Flip');
  const invoice4 = await uploadImage('public/invoice4.jpg', 'Licensed and Insured');

  const book1 = await uploadImage('public/book1.jpg', 'Chris Cakes Event');
  const book2 = await uploadImage('public/book2.jpg', 'Chris Cakes Event');

  const howto1 = await uploadImage('public/howto1.jpg', 'Skrumpy Skedaddle at Almar Orchard');

  const help1 = await uploadImage('public/help1.jpg', 'National Cherry Festival Flying Flapjacks');
  const help2 = await uploadImage('public/help2.jpg', 'We Flip Burgers too');
  const help3 = await uploadImage('public/help3.jpg', 'Breakfast with Santa');

  const day1 = await uploadImage('public/day1.jpg', 'Ausable River Canoe Marathon');
  const day2 = await uploadImage('public/day2.jpg', 'Ausable River Canoe Marathon');
  const day3 = await uploadImage('public/day3.jpg', 'MSU Extension Breakfast on the Farm');
  const day4 = await uploadImage('public/day4.jpg', 'Rogers Athletic Christmas Party');
  const day5 = await uploadImage('public/day5.jpg', 'Rogers Athletic Christmas Party');

  console.log('\n✓ All images uploaded successfully!\n');
  console.log('Updating page content with images...\n');

  // Update Services page with images
  console.log('Updating Services page...');
  const servicesPage = {
    _type: 'page',
    _id: 'services-page',
    title: '24/7-365 Services',
    slug: {
      _type: 'slug',
      current: 'services',
    },
    sections: [
      createTwoColumnSection(
        'FUNdraising',
        [
          'Where else can you make $1,000 in just a short amount of time? Chris Cakes original pancake menu is structured so you can make a lot of money in just a few hours; or host a benefit spaghetti dinner or Coney night. Chris Cakes helps to make a profitable and unique experience. The FUN is no extra charge.',
        ],
        services1,
        'left',
        { text: 'View Fundraising', link: '/fundraising' }
      ),
      createTwoColumnSection(
        'Premiere Breakfast',
        [
          'Our breakfast options include more than just flying flapjacks. We also serve French toast, scrambled eggs, hash browns, fresh fruit, and much more. Chris Cakes Premiere Breakfast options can be served at your office meetings, civic clubs, and more. Take a look at our breakfast menus, check out our options, build your budget, and call our office.',
        ],
        services2,
        'left',
        { text: 'Breakfast Menus', link: '/menu' }
      ),
      createTwoColumnSection(
        'Menus N More',
        [
          "From pulled pork, pasta, burgers, and brats, Chris Cakes serves corporate picnics, graduations, sporting events, and even weddings. Create your own specialized menu. There is very little we can't do! Special requests are welcome.",
        ],
        services3,
        'left',
        { text: 'Menus N More', link: '/menu' }
      ),
      createTextSection('Emergency Catering', [
        'If you have a catering crisis, Chris Cakes is available. We are a 24/7-365 caterer and we can get you out of a tight spot. We have the ability to feed a large amount of food to massive amounts of people, from serving utility workers to military personnel. Chris Cakes has been even known to provide relief in disaster situations.',
      ]),
      createCTASection('Contact Us for Emergency Catering', '', 'Contact Us', '/contact', 'primary'),
    ],
    seo: {
      metaTitle: '24/7 Catering Services - ChrisCakes Michigan',
      metaDescription:
        'ChrisCakes offers 24/7-365 catering services including fundraising, breakfast catering, lunch & dinner menus, and emergency catering throughout Michigan.',
    },
  };

  await client.createOrReplace(servicesPage);
  console.log('✓ Services page updated\n');

  // Update Invoice & Payment page with images
  console.log('Updating Invoice & Payment page...');
  const invoicePaymentPage = {
    _type: 'page',
    _id: 'invoice-payment-page',
    title: 'Invoice, Mileage, Payment & License',
    slug: {
      _type: 'slug',
      current: 'invoice-payment',
    },
    sections: [
      createTwoColumnSection(
        'Invoice',
        [
          'Fundraisers will be invoiced one of two ways:',
          '1. Either 80% of the number confirmed to serve (Note: Confirmed number can be revised up to one week prior)',
          '2. The actual number of people fed that day, whichever is greatest. Deposit will be applied to final invoice.',
          '3. Because we purchase a-la-carte items per event based on your confirmed number, you will be invoiced for the a-la-carte items based on the number of people you confirm, not the number of people who actually eat that day.',
        ],
        invoice1,
        'left'
      ),
      createTwoColumnSection(
        'Mileage',
        [
          'Because of our inexpensive price per plate, a charge of 70 cents per mile round trip offsets the cost of travel to your event, and helps us to maintain our vehicles, insurance, licenses and inspections. If reaching your event requires a drive time of three hours or more, or your start time is prior to 6:00am, the cost of a motel will be necessary.',
        ],
        invoice2,
        'left'
      ),
      createTwoColumnSection(
        'Payment',
        [
          'A $200 deposit is required within ONE WEEK of your inquiry to secure your date and will be applied to your final invoice. We will no longer hold dates. Payment is DUE at the completion of your event. The prices listed are CASH prices. We accept cash, checks, and all major credit cards (a 3% convenience fee applies to all credit card payments). If you are unable to provide payment at the completion of your event, there will be an additional 15% administration fee added to these cash prices.',
          'If you enjoy our flipping, our flippers appreciate your tipping.',
          '*Rescheduling policy: Your $200 deposit will follow you through the calendar year until a new date has been booked.*',
        ],
        invoice3,
        'left'
      ),
      createTwoColumnSection(
        'License & Insurance',
        [
          'We are a licensed State Transitory Food Unit through the State of Michigan and carry a $1,000,000 liability policy.',
        ],
        invoice4,
        'left'
      ),
    ],
    seo: {
      metaTitle: 'Invoice, Payment & Pricing - ChrisCakes',
      metaDescription:
        'ChrisCakes pricing, invoice, mileage, and payment information. Learn about deposits, payment methods, and our licensing and insurance.',
    },
  };

  await client.createOrReplace(invoicePaymentPage);
  console.log('✓ Invoice & Payment page updated\n');

  // Note: The other pages don't use twoColumnSection in their current design
  // They use images within content or as decorative elements, which would need
  // different handling. For now, focusing on pages that clearly need twoColumnSection.

  console.log('\n========================================');
  console.log('Image upload and page update complete!');
  console.log('Pages updated:');
  console.log('- Services (3 images)');
  console.log('- Invoice & Payment (4 images)');
  console.log('\nRemaining images uploaded but not yet integrated:');
  console.log('- book1.jpg, book2.jpg (How to Book page)');
  console.log('- howto1.jpg (Fundraising Tips page)');
  console.log('- help1-3.jpg (Volunteers page)');
  console.log('- day1-5.jpg (Day of Event page)');
  console.log('\nThese will need manual integration via Sanity Studio.');
  console.log('========================================\n');
}

// Run the script
uploadImagesAndUpdatePages()
  .then(() => {
    console.log('\n✓ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
