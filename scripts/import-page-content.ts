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

// Helper function to create block content from text
function createBlockContent(text: string, strong: boolean = false): any[] {
  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: text,
          marks: strong ? ['strong'] : [],
        },
      ],
    },
  ];
}

// Helper function to create text section
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

// Helper function to create highlight box with items
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

// Helper function to create CTA section
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

async function importPages() {
  console.log('Starting page content import...\n');
  console.log('Note: Images will need to be uploaded to Sanity manually after import.\n');

  // About Page
  console.log('Importing About page...');
  const aboutPage = {
    _type: 'page',
    _id: 'about-page',
    title: 'About ChrisCakes',
    slug: {
      _type: 'slug',
      current: 'about',
    },
    sections: [
      createTextSection('Our Story', [
        "Chris Cakes has been around since 1969 – you won't find us in any history books! But you can find us in the Guinness Book of World Records... twice!",
        'We use a custom designed grill and dispensing unit that allows us to feed large and small groups extremely fast and efficiently. Add a dose of humor and some fancy pancake flipping, and you have a one of a kind event that people love to watch while enjoying our delicious pancakes!',
      ]),
      createTextSection('What We Do', [
        "Not only do we flip flapjacks, we flip burgers, too! Our Menus N More options are full of tasty lunch and dinner options. Pulled pork and smoked potato salad are our specialties because our sister business is a BBQ joint! Don't see what you're looking for? ASK US! We try to accommodate all requests.",
        'Chris Cakes can be found at fundraisers, church gatherings, school events, university functions, corporate lunches, dinners, benefits, graduations, reunions, fly-ins and national festivals; the list is endless. No event is too large or too small, from groups of 50 to 50,000!',
      ]),
      createTextSection('Service Area', [
        'Chris Cakes of Michigan is a dependable catering service that is readily available for your 24/7 catering needs. We service the entire state of Michigan and beyond! Centrally located, we can travel anywhere in Michigan in about two hours! In four feet of snow, in the dead of a Michigan winter, Chris Cakes has a 99.9% success rate.',
      ]),
      createTextSection('Our Promise', [
        "Chris Cakes is more than great food at an affordable price... it's an experience!",
      ]),
      createHighlightBox(
        'Notable Achievements',
        [
          'Served four Presidents and 16 Governors',
          'Featured on Food Network',
          'Two Guinness World Records',
          'Most pancakes made in an hour',
          'Highest pancake tossed and caught',
        ],
        'gray',
        'checklist'
      ),
      createCTASection(
        'Ready to experience ChrisCakes?',
        '',
        'Contact Us Today',
        '/contact',
        'primary'
      ),
    ],
    seo: {
      metaTitle: 'About ChrisCakes - Serving Michigan Since 1969',
      metaDescription:
        "Learn about ChrisCakes, Michigan's premier catering service since 1969. Two Guinness World Records, serving groups from 50 to 50,000 people!",
    },
  };

  try {
    await client.createOrReplace(aboutPage);
    console.log('✓ About page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing About page:', error);
  }

  // Services Page
  // Note: This page will need images (services1.jpg, services2.jpg, services3.jpg) uploaded to Sanity
  // and converted to twoColumnSection later. For now using textSection.
  console.log('Importing Services page...');
  const servicesPage = {
    _type: 'page',
    _id: 'services-page',
    title: '24/7-365 Services',
    slug: {
      _type: 'slug',
      current: 'services',
    },
    sections: [
      createTextSection('FUNdraising', [
        'Where else can you make $1,000 in just a short amount of time? Chris Cakes original pancake menu is structured so you can make a lot of money in just a few hours; or host a benefit spaghetti dinner or Coney night. Chris Cakes helps to make a profitable and unique experience. The FUN is no extra charge.',
      ]),
      createCTASection('View Fundraising Options', '', 'View Fundraising', '/fundraising', 'primary'),
      createTextSection('Premiere Breakfast', [
        'Our breakfast options include more than just flying flapjacks. We also serve French toast, scrambled eggs, hash browns, fresh fruit, and much more. Chris Cakes Premiere Breakfast options can be served at your office meetings, civic clubs, and more. Take a look at our breakfast menus, check out our options, build your budget, and call our office.',
      ]),
      createCTASection('View Breakfast Menus', '', 'Breakfast Menus', '/menu', 'primary'),
      createTextSection('Menus N More', [
        "From pulled pork, pasta, burgers, and brats, Chris Cakes serves corporate picnics, graduations, sporting events, and even weddings. Create your own specialized menu. There is very little we can't do! Special requests are welcome.",
      ]),
      createCTASection('View All Menus', '', 'Menus N More', '/menu', 'primary'),
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

  try {
    await client.createOrReplace(servicesPage);
    console.log('✓ Services page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing Services page:', error);
  }

  // How to Book Page
  console.log('Importing How to Book page...');
  const howToBookPage = {
    _type: 'page',
    _id: 'how-to-book-page',
    title: 'How to Book an Event',
    slug: {
      _type: 'slug',
      current: 'how-to-book',
    },
    sections: [
      createHighlightBox(
        'Booking Steps',
        [
          'STEP 1: Review website for policies, pricing, and procedures, or contact our office for further information.',
          'STEP 2: Fill out the CONTACT US form on website. This holds your date on our calendar until your deposit is received.',
          'STEP 3: Deposits are due within one week after the submission of the "CONTACT US" form. You will receive an email from our office when your deposit has been received. Should you decide not to confirm the date held on our calendar, please be mindful to release that date by notifying our office. If we receive a request that conflicts with your date prior to receiving your deposit, you will get first right of refusal.',
          'STEP 4: Upon receiving confirmation, please review ALL DETAILS and verify correctness of the date, serving time, serving address, and cell number for day of event.',
          'STEP 5: One week prior to your event date, you will receive a "Checking In" email. At this time, you can revise your confirmed number if needed and assure us your volunteers are ready.',
          'STEP 6: Three days prior to the event, you will receive a call from your Flipper.',
          'STEP 7: Chris Cakes is user friendly -- we do all the hard work. Organize 2-3 volunteers, sell your tickets, and together this ensures you\'ll have a fun and profitable experience.',
        ],
        'gray',
        'numbered'
      ),
      createTextSection('', [
        'Download this GREAT YouTube video and play it during ticket sales and the day of your event… sure to add excitement and create even more FUN prior to your event!',
      ]),
      createCTASection('Ready to Book?', '', 'Contact Us Today', '/contact', 'primary'),
    ],
    seo: {
      metaTitle: 'How to Book an Event - ChrisCakes',
      metaDescription:
        'Learn how to book a ChrisCakes event in 7 easy steps. From initial inquiry to event day, we make the booking process simple and straightforward.',
    },
  };

  try {
    await client.createOrReplace(howToBookPage);
    console.log('✓ How to Book page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing How to Book page:', error);
  }

  // Fundraising Tips Page
  console.log('Importing Fundraising Tips page...');
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
      createHighlightBox(
        'Success Story',
        [
          'Skrumpy Skedaddle at Almar Orchard - Sponsored by RunFit',
          'Over 2,025 people fed in just 3 hours!',
          '"You guys did an awesome job at the Skrumpy Skedaddle! Organized clean Fast good food with a FLAIR!" - Dave Gillie',
        ],
        'gray',
        'default'
      ),
    ],
    seo: {
      metaTitle: 'Fundraising Tips - ChrisCakes',
      metaDescription:
        'Learn how to run a successful fundraiser with ChrisCakes. Expert tips on ticket sales, event planning, and maximizing your fundraising profits.',
    },
  };

  try {
    await client.createOrReplace(fundraisingTipsPage);
    console.log('✓ Fundraising Tips page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing Fundraising Tips page:', error);
  }

  // Fundraising Page
  // Note: This page has dynamic menu items that pull from Sanity, only importing the CTA section
  console.log('Importing Fundraising page...');
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

  try {
    await client.createOrReplace(fundraisingPage);
    console.log('✓ Fundraising page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing Fundraising page:', error);
  }

  // Volunteers Page
  console.log('Importing Volunteers page...');
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
          'Two 6-8\' serving tables for each serving line required',
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
    ],
    seo: {
      metaTitle: 'Volunteer Information - ChrisCakes',
      metaDescription:
        'Learn what volunteers are needed for a ChrisCakes event. We make it easy and fun! Find out what your group needs to provide for a successful event.',
    },
  };

  try {
    await client.createOrReplace(volunteersPage);
    console.log('✓ Volunteers page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing Volunteers page:', error);
  }

  // Day of Event Page
  console.log('Importing Day of Event page...');
  const dayOfEventPage = {
    _type: 'page',
    _id: 'day-of-event-page',
    title: 'Day of Event Information',
    slug: {
      _type: 'slug',
      current: 'day-of-event',
    },
    sections: [
      createTextSection('What to Expect', [
        'We will arrive 1 hour before the start time of your event, and 1-2 hours prior for Menus N More events. You must have 2-3 volunteers meet us to unload. We will not unload without your help.',
        'When we arrive, our flippers will assess your room for optimum usage and the flow of your event. If you have questions regarding your room set-up prior to our arrival, please call our office. Outside events require a three-sided tent and prior approval from our office.',
        'After unloading, your volunteers will be asked to help set-up the serving tables, work the serving tables during the event, help with clean-up and reloading. Your group will not be asked to cook! Remember what Grandma used to say… "Many hands make for light work!"',
        'Someone from your group will be responsible for ticket, money, and plate distribution. We invoice based on the number of plates used. You may want to have signage for your guests to "keep their plate until they have had all they can eat."',
        'Payment is due at the conclusion of the event. Take a look at our INVOICE AND PAYMENT page for more information.',
      ]),
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

  try {
    await client.createOrReplace(dayOfEventPage);
    console.log('✓ Day of Event page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing Day of Event page:', error);
  }

  // Invoice & Payment Page
  console.log('Importing Invoice & Payment page...');
  const invoicePaymentPage = {
    _type: 'page',
    _id: 'invoice-payment-page',
    title: 'Invoice, Mileage, Payment & License',
    slug: {
      _type: 'slug',
      current: 'invoice-payment',
    },
    sections: [
      createTextSection('Invoice', [
        'Fundraisers will be invoiced one of two ways:',
      ]),
      createHighlightBox(
        'Invoice Details',
        [
          'Either 80% of the number confirmed to serve (Note: Confirmed number can be revised up to one week prior)',
          'The actual number of people fed that day, whichever is greatest. Deposit will be applied to final invoice.',
          'Because we purchase a-la-carte items per event based on your confirmed number, you will be invoiced for the a-la-carte items based on the number of people you confirm, not the number of people who actually eat that day.',
        ],
        'white',
        'numbered'
      ),
      createTextSection('Mileage', [
        'Because of our inexpensive price per plate, a charge of 70 cents per mile round trip offsets the cost of travel to your event, and helps us to maintain our vehicles, insurance, licenses and inspections. If reaching your event requires a drive time of three hours or more, or your start time is prior to 6:00am, the cost of a motel will be necessary.',
      ]),
      createTextSection('Payment', [
        'A $200 deposit is required within ONE WEEK of your inquiry to secure your date and will be applied to your final invoice. We will no longer hold dates. Payment is DUE at the completion of your event. The prices listed are CASH prices. We accept cash, checks, and all major credit cards (a 3% convenience fee applies to all credit card payments). If you are unable to provide payment at the completion of your event, there will be an additional 15% administration fee added to these cash prices.',
        'If you enjoy our flipping, our flippers appreciate your tipping.',
        '*Rescheduling policy: Your $200 deposit will follow you through the calendar year until a new date has been booked.*',
      ]),
      createTextSection('License & Insurance', [
        'We are a licensed State Transitory Food Unit through the State of Michigan and carry a $1,000,000 liability policy.',
      ]),
    ],
    seo: {
      metaTitle: 'Invoice, Payment & Pricing - ChrisCakes',
      metaDescription:
        'ChrisCakes pricing, invoice, mileage, and payment information. Learn about deposits, payment methods, and our licensing and insurance.',
    },
  };

  try {
    await client.createOrReplace(invoicePaymentPage);
    console.log('✓ Invoice & Payment page imported successfully\n');
  } catch (error) {
    console.error('✗ Error importing Invoice & Payment page:', error);
  }

  console.log('\n========================================');
  console.log('Import complete! Check Sanity Studio to verify the content.');
  console.log('Visit: http://localhost:3001/studio');
  console.log('\nNext steps:');
  console.log('1. Upload images to Sanity Studio for each page');
  console.log('2. Convert text sections to twoColumnSection where needed (Services, Invoice pages)');
  console.log('3. Add YouTube video embeds to How to Book and Fundraising pages');
  console.log('========================================\n');
}

// Run the import
importPages()
  .then(() => {
    console.log('\n✓ All pages imported successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Import failed:', error);
    process.exit(1);
  });
