import { test, expect, type APIRequestContext } from '@playwright/test';

/**
 * Slugs that must never be picked as the dynamic `[slug]` test target:
 * 'fundraising' and 'services' have dedicated routes and are deliberately
 * excluded from `[slug]`'s generateStaticParams (see app/[slug]/page.tsx's
 * RESERVED_SLUGS), and '', 'menu', 'contact' are Next.js static routes with
 * their own page files, not `[slug]` pages.
 */
const EXCLUDED_SLUGS = new Set([
  '',
  'menu',
  'contact',
  'services',
  'fundraising',
]);

/**
 * Pulls a `[slug]`-eligible path out of /sitemap.xml, which T18 made list
 * every published Sanity `page` document. This deliberately avoids
 * hardcoding a slug name -- the CMS content (and therefore the sitemap) can
 * change at any time -- and avoids requiring Sanity credentials in the test,
 * since the sitemap is served over plain HTTP.
 */
async function fetchDynamicSlug(request: APIRequestContext): Promise<string> {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);

  const body = await response.text();
  const locs = Array.from(body.matchAll(/<loc>(.*?)<\/loc>/g)).map(
    (match) => match[1]
  );
  expect(locs.length).toBeGreaterThan(0);

  for (const loc of locs) {
    const slug = new URL(loc).pathname.replace(/^\/+|\/+$/g, '');
    if (!EXCLUDED_SLUGS.has(slug)) {
      return slug;
    }
  }

  throw new Error(
    'sitemap.xml contained no [slug]-eligible page to test against'
  );
}

test.describe('Dedicated routes', () => {
  test('/fundraising renders', async ({ page }) => {
    const response = await page.goto('/fundraising');
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('Dynamic [slug] pages', () => {
  test('a page slug sourced from the sitemap renders', async ({
    page,
    request,
  }) => {
    const slug = await fetchDynamicSlug(request);

    const response = await page.goto(`/${slug}`);
    expect(response?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('an unknown slug returns a 404 with the branded not-found page', async ({
    page,
  }) => {
    const response = await page.goto(
      '/this-slug-should-never-exist-e2e-404-check'
    );
    expect(response?.status()).toBe(404);

    await expect(
      page.getByRole('heading', { level: 1, name: 'Page Not Found' })
    ).toBeVisible();
  });
});
