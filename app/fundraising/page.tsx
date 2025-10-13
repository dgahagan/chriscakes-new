import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';
import { pageBySlugQuery } from '@/lib/queries';
import SectionRenderer from '@/components/sections/SectionRenderer';
import type { Metadata } from 'next';
import { PortableTextBlock } from '@portabletext/react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
}

interface SanityImage {
  asset: {
    _ref: string;
  };
  alt?: string;
}

interface PageSection {
  _type: string;
  _key: string;
  title?: string;
  heading?: string;
  content?: PortableTextBlock[];
  description?: string;
  items?: string[];
  backgroundColor?: 'gray' | 'crimson' | 'white';
  style?: 'default' | 'checklist' | 'numbered' | 'primary' | 'secondary';
  image?: SanityImage;
  imagePosition?: 'left' | 'right';
  ctaButton?: {
    text: string;
    link: string;
  };
  buttonText?: string;
  buttonLink?: string;
  videoUrl?: string;
}

interface PageData {
  _id: string;
  title: string;
  sections: PageSection[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export const revalidate = 60;

async function getPageData(): Promise<PageData> {
  return client.fetch(pageBySlugQuery, { slug: 'fundraising' }, { next: { revalidate: 60 } });
}

async function getFundraisingItems(): Promise<MenuItem[]> {
  const query = groq`*[_type == "menuItem" && category->slug.current == "fundraising-menus" && available == true] | order(order asc) {
    _id,
    name,
    description,
    price
  }`;
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData();

  const title = page.seo?.metaTitle || `${page.title} - ChrisCakes`;
  const description = page.seo?.metaDescription || 'Fundraising menus for schools, churches, benefits, clubs, festivals and more. Delicious options to make your fundraiser a success!';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://www.chriscakesofmi.com/fundraising',
      siteName: 'ChrisCakes of Michigan',
      images: [
        {
          url: 'https://www.chriscakesofmi.com/logo.png',
          width: 1200,
          height: 630,
          alt: 'ChrisCakes Fundraising Menus',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.chriscakesofmi.com/logo.png'],
    },
  };
}

export default async function FundraisingPage() {
  const [page, menuItems] = await Promise.all([getPageData(), getFundraisingItems()]);

  // Get the first text section and extract plain text from PortableText content
  const firstTextSection = page.sections?.find(
    (section) => section._type === 'textSection',
  );

  // Extract plain text from PortableText blocks
  let subtitle = '';
  if (firstTextSection?.content) {
    const firstBlock = firstTextSection.content.find((block: any) => block._type === 'block');
    if (firstBlock?.children) {
      subtitle = firstBlock.children
        .filter((child: any) => child._type === 'span')
        .map((span: any) => span.text)
        .join('');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Dynamic from Sanity */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {page.title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Menu Items - Dynamic from Sanity */}
        <div className="space-y-12">
          {menuItems.map((item) => (
            <div key={item._id}>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h2>
                </div>
                <div>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <p className="text-center font-bold text-lg">Call for pricing!</p>
                  {item.name === 'Hot Dog Bash' && (
                    <p className="text-center text-[#dc143c] font-bold mt-2">
                      CONEY SAUCE ADD $1.00 pp
                    </p>
                  )}
                </div>
              </div>
              <hr className="mt-8 border-gray-300" />
            </div>
          ))}
        </div>

        {/* CTA Section - Dynamic from Sanity */}
        <div className="mt-12">
          <SectionRenderer sections={page.sections} />
        </div>
      </div>
    </div>
  );
}
