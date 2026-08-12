import type { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';
import { allPagesQuery } from '@/lib/queries';

const SITE_URL = 'https://www.chriscakesofmi.com';

/**
 * Slugs that have a dedicated route with bespoke rendering (see
 * app/[slug]/page.tsx's RESERVED_SLUGS). They're already included as static
 * routes below, so the corresponding CMS `page` documents must be excluded
 * here to avoid listing the same URL twice.
 */
const RESERVED_SLUGS = new Set(['fundraising', 'services']);

const STATIC_ROUTES = ['', '/menu', '/contact', '/services', '/fundraising'];

interface SanityPage {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));

  let pages: SanityPage[] = [];
  try {
    pages = await client.fetch<SanityPage[]>(
      allPagesQuery,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    // Sanity outage - fall back to the static routes only.
    return staticEntries;
  }

  const pageEntries: MetadataRoute.Sitemap = pages
    .filter((page) => !RESERVED_SLUGS.has(page.slug.current))
    .map((page) => ({
      url: `${SITE_URL}/${page.slug.current}`,
    }));

  return [...staticEntries, ...pageEntries];
}
