import { client } from '@/lib/sanity';
import { pageBySlugQuery } from '@/lib/queries';
import { PortableText, PortableTextBlock } from '@portabletext/react';
import { portableTextComponents } from '@/components/portable-text/PortableTextComponents';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageData {
  _id: string;
  title: string;
  slug: { current: string };
  content: PortableTextBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

  return {
    title: page.seo?.metaTitle || `${page.title} - ChrisCakes`,
    description: page.seo?.metaDescription || undefined,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await client.fetch<PageData>(
    pageBySlugQuery,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!page) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">{page.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none text-gray-700">
          <PortableText
            value={page.content}
            components={portableTextComponents}
          />
        </div>
      </div>
    </div>
  );
}
