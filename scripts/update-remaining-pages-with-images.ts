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

function createTwoColumnSection(
  heading: string,
  content: string[],
  image: any,
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

async function updatePages() {
  console.log('Fetching image assets from Sanity...\n');

  // Get all image references
  const book1 = await getImageAsset('book1.jpg');
  const book2 = await getImageAsset('book2.jpg');
  const howto1 = await getImageAsset('howto1.jpg');
  const help1 = await getImageAsset('help1.jpg');
  const help2 = await getImageAsset('help2.jpg');
  const help3 = await getImageAsset('help3.jpg');
  const day1 = await getImageAsset('day1.jpg');
  const day2 = await getImageAsset('day2.jpg');
  const day3 = await getImageAsset('day3.jpg');
  const day4 = await getImageAsset('day4.jpg');
  const day5 = await getImageAsset('day5.jpg');

  console.log('✓ Image assets retrieved\n');
  console.log('Updating pages...\n');

  // Update How to Book page
  console.log('Updating How to Book page...');
  if (book1) book1.alt = 'Chris Cakes Event';
  if (book2) book2.alt = 'Chris Cakes Event';

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
  console.log('✓ How to Book page updated\n');

  // Update Fundraising Tips page
  console.log('Updating Fundraising Tips page...');
  if (howto1) howto1.alt = 'Skrumpy Skedaddle at Almar Orchard - Over 2,025 people fed in just 3 hours';

  const fundraisingTipsPage = {
    _type: 'page',
    _id: 'fundraising-tips-page',
    title: 'How to Run a Successful Fundraiser',
    slug: {
      _type: 'slug',
      current: 'fundraising-tips',
    },
    sections: [
      createHighlightBox(
        'Tips for Success',
        [
          'Pre-selling tickets is the backbone to any successful fundraiser. Chris Cakes is always prepared for walk-ins. Many events charge an extra $1 or $2 at the door to encourage advance ticket sales. If you sell 300 tickets and only 220 actually eat, remainder 80 tickets sold is an "out right" donation to your group. The more you feed, the less we charge, the more your group makes!',
          'Chris Cakes serves in increments of 3 hours. Depending on service hours and number of people to feed, our office will determine the number of grills for your event. We strongly suggest selling seating times. Selling 75 tickets for each 30 minute time block will also allow for walk-ins. By selling seating times, you will control the flow of your crowd ensuring not all will show at the same time, or have long lines (for groups of 300 or more where applicable).',
          'Chris Cakes is most successful when planned around other activities that will draw attendance. Book fairs, science fairs, music performances, puppet shows, plays, before sporting events, etc.',
          'Theme your event Pancakes and Pajamas, Breakfast with Santa, breakfast with the Easter Bunny, superheroes, famous book characters, etc.',
          'Many hands make for light work! Chris Cakes prices are structured to partner with 2 to 4 of your volunteers. Chris Cakes can bring additional staff for a nominal fee. Volunteers will help unload, set up, light serving, reload and clean-up of your event.',
          "Don't forget: it's a fundraiser. Consider the price you pay when eating out! We have been doing this for many years. Ask our office any questions you have… we have the answers!",
          'In your advertising, please include "As Seen on Food Network," "Guinness Book World Record Holders," and "Caution: Beware of Flying Pancakes." Feel free to download our logos, a sample flyer, tickets, and word search. You are also welcome to download logos and YouTube videos from our website, especially the "Pancake Robot" YouTube video, to enhance your advertising.',
          'Book early! We take bookings up to one year in advance. If you have a specific date, call us to check the availability on our busy calendar!',
        ],
        'white',
        'numbered'
      ),
      createTextSectionWithImage(
        'Success Story',
        [
          'Skrumpy Skedaddle at Almar Orchard - Sponsored by RunFit',
          'Over 2,025 people fed in just 3 hours!',
          '"You guys did an awesome job at the Skrumpy Skedaddle! Organized clean Fast good food with a FLAIR!" - Dave Gillie',
        ],
        howto1
      ),
    ],
    seo: {
      metaTitle: 'Fundraising Tips - ChrisCakes',
      metaDescription:
        'Learn how to run a successful fundraiser with ChrisCakes. Expert tips on ticket sales, event planning, and maximizing your fundraising profits.',
    },
  };

  await client.createOrReplace(fundraisingTipsPage);
  console.log('✓ Fundraising Tips page updated\n');

  // Update Volunteers page
  console.log('Updating Volunteers page...');
  if (help1) help1.alt = 'National Cherry Festival Flying Flapjacks prior to the Blue Angels Air Show';
  if (help2) help2.alt = 'We Flip Burgers too';
  if (help3) help3.alt = 'Breakfast with Santa - An ongoing Chris Cakes tradition';

  const volunteersPage = {
    _type: 'page',
    _id: 'volunteers-page',
    title: 'Volunteer Information',
    slug: {
      _type: 'slug',
      current: 'volunteers',
    },
    sections: [
      createTextSection('', [
        'As Grandma said, "Many hands makes for light work."',
        'Chris Cakes is designed to make the work easy and enjoyable for everyone involved. Our inexpensive price per plate is based on partnering with your group and the volunteers that you provide. If you are unable to provide us with those volunteers, we reserve the right to adjust our prices accordingly.',
      ]),
      createHighlightBox(
        'What is expected from your group:',
        [
          'Someone to assist our Flippers upon arrival with basic unloading',
          'Set-up of tables and chairs and service tables',
          'Light serving (sausage & drinks)',
          'Refilling syrup bottles',
          'General area clean-up and several trash receptacles',
          "Two 6-8' serving tables for each serving line required",
          'Access to potable (drinking) water',
          'Access to one 110 volts/15-amp electrical outlet',
          'Someone to assist our Flippers upon departure with basic reloading',
        ],
        'gray',
        'checklist'
      ),
      createTextSection('Event Flow Tips', [
        'Chris Cakes can cook, flip, and provide a show faster than your guests can go through the serving line. We suggest considering the following to help the flow of your event:',
      ]),
      createHighlightBox(
        'Flow Management',
        [
          'Know the occupancy for the room in which you are serving',
          'Each grill serves 200 people/hour (depending on the appetites). We allow a maximum of 3 hours for serving time and will dispatch an additional grill if needed.',
          'Pre-sell tickets with seating times. For groups of 300 or more (i.e., closed events, schools, etc.), we suggest selling 75 tickets every 30 minutes. That will also allow for walk-ins.',
          'Planning other activities to augment your event which will draw a crowd. Contact our office for ideas in you planning stages.',
        ],
        'white',
        'numbered'
      ),
      createTextSection('', [
        'One week prior, when you confirm your event numbers, please alert our office if seating times were assigned so our flippers can be prepared. Also, verify your volunteers are ready for the event.',
      ]),
      createTextSectionWithImage('National Cherry Festival', ['National Cherry Festival Flying Flapjacks prior to the Blue Angels Air Show'], help1),
      createTextSectionWithImage('We Flip Burgers Too', ['We Flip Burgers too'], help2),
      createTextSectionWithImage('Breakfast with Santa', ['Breakfast with Santa - An ongoing Chris Cakes tradition'], help3),
    ],
    seo: {
      metaTitle: 'Volunteer Information - ChrisCakes',
      metaDescription:
        'Learn what volunteers are needed for a ChrisCakes event. We make it easy and fun! Find out what your group needs to provide for a successful event.',
    },
  };

  await client.createOrReplace(volunteersPage);
  console.log('✓ Volunteers page updated\n');

  // Update Day of Event page
  console.log('Updating Day of Event page...');
  if (day1) day1.alt = 'Ausable River Canoe Marathon';
  if (day2) day2.alt = 'Ausable River Canoe Marathon';
  if (day3) day3.alt = 'MSU Extension Breakfast on the Farm';
  if (day4) day4.alt = 'Rogers Athletic Christmas Party';
  if (day5) day5.alt = 'Rogers Athletic Christmas Party';

  const dayOfEventPage = {
    _type: 'page',
    _id: 'day-of-event-page',
    title: 'Day of Event Information',
    slug: {
      _type: 'slug',
      current: 'day-of-event',
    },
    sections: [
      createTextSectionWithImage('What to Expect', [
        'We will arrive 1 hour before the start time of your event, and 1-2 hours prior for Menus N More events. You must have 2-3 volunteers meet us to unload. We will not unload without your help.',
      ], day1),
      createTextSection('', [
        'When we arrive, our flippers will assess your room for optimum usage and the flow of your event. If you have questions regarding your room set-up prior to our arrival, please call our office. Outside events require a three-sided tent and prior approval from our office.',
        'After unloading, your volunteers will be asked to help set-up the serving tables, work the serving tables during the event, help with clean-up and reloading. Your group will not be asked to cook! Remember what Grandma used to say… "Many hands make for light work!"',
        'Someone from your group will be responsible for ticket, money, and plate distribution. We invoice based on the number of plates used. You may want to have signage for your guests to "keep their plate until they have had all they can eat."',
        'Payment is due at the conclusion of the event. Take a look at our INVOICE AND PAYMENT page for more information.',
      ]),
      createTextSectionWithImage('MSU Extension Breakfast on the Farm', [''], day3),
      createTextSectionWithImage('Rogers Athletic Christmas Party', [''], day4),
      createHighlightBox(
        'Testimonial - Scott Kefgen and the staff at UPA',
        [
          '"Melanie, Trevor and the gang at Chris Cakes - Thank you so much for the amazing event! Our team was thrilled with everything you did for us! Our families were really excited for our pancake fundraiser, and they really showed their support by showing up in such large numbers. We are so happy with the results that we hope to work with you again in the future! Please let us know if there is anything we can ever do to help you." - Sincerely, your very happy customers!',
        ],
        'gray',
        'default'
      ),
    ],
    seo: {
      metaTitle: 'Day of Event Information - ChrisCakes',
      metaDescription:
        'What to expect on the day of your ChrisCakes event. Arrival times, setup, volunteer responsibilities, and payment information.',
    },
  };

  await client.createOrReplace(dayOfEventPage);
  console.log('✓ Day of Event page updated\n');

  console.log('\n========================================');
  console.log('All pages updated successfully!');
  console.log('Pages with images:');
  console.log('- How to Book (1 image)');
  console.log('- Fundraising Tips (1 image)');
  console.log('- Volunteers (3 images)');
  console.log('- Day of Event (3 images)');
  console.log('\nTotal images integrated: 8');
  console.log('========================================\n');
}

// Run the script
updatePages()
  .then(() => {
    console.log('\n✓ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
