import { client } from '@/lib/sanity';
import { faqsQuery, pageBySlugQuery } from '@/lib/queries';
import SectionRenderer from '@/components/sections/SectionRenderer';
import type { Metadata } from 'next';
import { PortableTextBlock } from '@portabletext/react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
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
  return client.fetch(pageBySlugQuery, { slug: 'services' }, { next: { revalidate: 60 } });
}

async function getFAQs(): Promise<FAQ[]> {
  return client.fetch(faqsQuery, {}, { next: { revalidate: 60 } });
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData();

  return {
    title: page.seo?.metaTitle || `${page.title} - ChrisCakes`,
    description: page.seo?.metaDescription || page.title,
  };
}

export default async function ServicesPage() {
  const [page, faqs] = await Promise.all([getPageData(), getFAQs()]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">
            24/7-365 <span className="text-xl font-normal text-gray-600">NO ONE CAN DO WHAT WE DO!</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Dynamic Content from Sanity */}
        <SectionRenderer sections={page.sections} />

        <hr className="my-12 border-gray-300" />

        {/* FAQs Section - Dynamic from Sanity */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq._id}
                className="group border border-gray-200 rounded-lg overflow-hidden"
              >
                <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <span className="text-[#dc143c] group-open:rotate-180 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 bg-white">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
