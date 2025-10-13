import { client } from '@/lib/sanity';
import { pageBySlugQuery, allPagesQuery, siteSettingsQuery } from '@/lib/queries';
import SectionRenderer from '@/components/sections/SectionRenderer';
import ShareButtons from '@/components/common/ShareButtons';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableTextBlock } from '@portabletext/react';

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
  slug: {
    current: string;
  };
  sections: PageSection[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

// Generate static params for all pages
export async function generateStaticParams() {
  const pages = await client.fetch<Array<{ slug: { current: string } }>>(
    allPagesQuery,
    {},
    { next: { revalidate: 3600 } }
  );

  return pages.map((page) => ({
    slug: page.slug.current,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await client.fetch<PageData>(
    pageBySlugQuery,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!page) {
    return {
      title: 'Page Not Found - ChrisCakes',
    };
  }

  const title = page.seo?.metaTitle || `${page.title} - ChrisCakes`;
  const description = page.seo?.metaDescription || page.title;
  const pageUrl = `https://www.chriscakesofmi.com/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'ChrisCakes of Michigan',
      images: [
        {
          url: 'https://www.chriscakesofmi.com/logo.png',
          width: 1200,
          height: 630,
          alt: `${page.title} - ChrisCakes`,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.chriscakesofmi.com/logo.png'],
    },
    other: {
      'pinterest:description': description,
      'pinterest:image': 'https://www.chriscakesofmi.com/logo.png',
    },
  };
}

// Page component
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([
    client.fetch<PageData>(
      pageBySlugQuery,
      { slug },
      { next: { revalidate: 60 } }
    ),
    client.fetch(siteSettingsQuery),
  ]);

  if (!page) {
    notFound();
  }

  // Check if share buttons should be displayed
  const shareButtonsEnabled =
    settings?.shareButtons?.enabled &&
    (settings?.shareButtons?.displayPages?.includes('dynamicPages') ||
      settings?.shareButtons?.displayPages?.includes('all'));

  const pageUrl = `https://www.chriscakesofmi.com/${slug}`;
  const pageDescription = page.seo?.metaDescription || page.title;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">{page.title}</h1>

          {/* Share Buttons */}
          {shareButtonsEnabled && (
            <div className="mt-6">
              <ShareButtons
                url={pageUrl}
                title={`${page.title} - ChrisCakes`}
                description={pageDescription}
                image="https://www.chriscakesofmi.com/logo.png"
                platforms={settings?.shareButtons?.platforms || ['facebook', 'twitter', 'pinterest', 'whatsapp', 'native']}
                showNativeShare={settings?.shareButtons?.platforms?.includes('native')}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionRenderer sections={page.sections} />
      </div>
    </div>
  );
}
