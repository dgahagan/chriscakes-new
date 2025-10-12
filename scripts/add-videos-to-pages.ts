import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// Get image asset references from Sanity
async function getImageAsset(filename: string): Promise<any> {
  const query = `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]`;
  const asset = await client.fetch(query, { filename });

  if (!asset) {
    console.warn(`⚠ Image not found: ${filename}`);
    return null;
  }

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt: filename.replace('.jpg', '').replace(/-/g, ' '),
  };
}

// Helper functions
function createTextSectionWithImage(title: string, paragraphs: string[], image: any): any {
  const content: any[] = [];

  // Add the image first
  if (image) {
    content.push({
      _type: 'image',
      _key: `image-${Math.random().toString(36).substring(7)}`,
      ...image,
    });
  }

  // Then add the text blocks
  paragraphs.forEach((text, index) => {
    content.push({
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
    });
  });

  return {
    _type: 'textSection',
    _key: `section-${Math.random().toString(36).substring(7)}`,
    title,
    content,
  };
}

function createVideoSection(
  title: string,
  videoUrl: string,
  description: string
): any {
  return {
    _type: 'videoSection',
    _key: `section-${Math.random().toString(36).substring(7)}`,
    title,
    videoUrl,
    description,
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

function createTextSection(title: string, paragraphs: string[]): any {
  const content = paragraphs.map((text, index) => ({
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
    _type: 'textSection',
    _key: `section-${Math.random().toString(36).substring(7)}`,
    title,
    content,
  };
}

async function addVideosToPages() {
  console.log('Adding videos to pages...\n');

  // Get image for How to Book page
  const book1 = await getImageAsset('book1.jpg');
  if (book1) book1.alt = 'Chris Cakes Event';

  // Update How to Book page with video
  console.log('Updating How to Book page with video...');
  const howToBookPage = {
    _type: 'page',
    _id: 'how-to-book-page',
    title: 'How to Book an Event',
    slug: {
      _type: 'slug',
      current: 'how-to-book',
    },
    sections: [
      createTextSectionWithImage(
        '',
        ['Download this GREAT YouTube video and play it during ticket sales and the day of your event… sure to add excitement and create even more FUN prior to your event!'],
        book1
      ),
      createVideoSection(
        '',
        'https://www.youtube.com/embed/o1iOkNDGkFA',
        'Download this GREAT YouTube video and play it during ticket sales and the day of your event… sure to add excitement and create even more FUN prior to your event!'
      ),
      createHighlightBox(
        'Booking Steps',
        [
          'STEP 1: Review website for policies, pricing, and procedures, or contact our office for further information.',
          'STEP 2: Fill out the CONTACT US form on website. This holds your date on our calendar until your deposit is received.',
          'STEP 3: Deposits are due within one week after the submission of the "CONTACT US" form. You will receive an email from our office when your deposit has been received. Should you decide not to confirm the date held on our calendar, please be mindful to release that date by notifying our office. If we receive a request that conflicts with your date prior to receiving your deposit, you will get first right of refusal.',
          'STEP 4: Upon receiving confirmation, please review ALL DETAILS and verify correctness of the date, serving time, serving address, and cell number for day of event.',
          'STEP 5: One week prior to your event date, you will receive a "Checking In" email. At this time, you can revise your confirmed number if needed and assure us your volunteers are ready.',
          'STEP 6: Three days prior to the event, you will receive a call from your Flipper.',
          "STEP 7: Chris Cakes is user friendly -- we do all the hard work. Organize 2-3 volunteers, sell your tickets, and together this ensures you'll have a fun and profitable experience.",
        ],
        'gray',
        'numbered'
      ),
      createCTASection('Ready to Book?', '', 'Contact Us Today', '/contact', 'primary'),
    ],
    seo: {
      metaTitle: 'How to Book an Event - ChrisCakes',
      metaDescription:
        'Learn how to book a ChrisCakes event in 7 easy steps. From initial inquiry to event day, we make the booking process simple and straightforward.',
    },
  };

  await client.createOrReplace(howToBookPage);
  console.log('✓ How to Book page updated with video\n');

  // Update Fundraising page with video
  console.log('Updating Fundraising page with video...');
  const fundraisingPage = {
    _type: 'page',
    _id: 'fundraising-page',
    title: 'Fundraising Menus',
    slug: {
      _type: 'slug',
      current: 'fundraising',
    },
    sections: [
      createTextSection('', [
        'SCHOOLS - CHURCHES - BENEFITS - CLUBS/ORGANIZATIONS - FESTIVALS - AIRPORT FLY-INS',
      ]),
      createVideoSection(
        '',
        'https://www.youtube.com/embed/o1iOkNDGkFA',
        ''
      ),
      createCTASection(
        'WE put the FUN… in FUNdraising!',
        'Contact us today for more information!',
        'Contact Us!',
        '/contact',
        'primary'
      ),
    ],
    seo: {
      metaTitle: 'Fundraising Menus - ChrisCakes',
      metaDescription:
        'Explore ChrisCakes fundraising menu options for schools, churches, benefits, clubs, festivals, and more. We put the FUN in fundraising!',
    },
  };

  await client.createOrReplace(fundraisingPage);
  console.log('✓ Fundraising page updated with video\n');

  console.log('\n========================================');
  console.log('Videos added successfully!');
  console.log('Pages updated:');
  console.log('- How to Book (1 video)');
  console.log('- Fundraising (1 video)');
  console.log('========================================\n');
}

// Run the script
addVideosToPages()
  .then(() => {
    console.log('\n✓ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
