import { test, expect } from '@playwright/test';
import { navigateAndWait, checkImagesLoaded } from '../helpers/test-utils';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/');
  });

  test('loads with the expected title and exactly one h1', async ({ page }) => {
    await expect(page).toHaveTitle(/ChrisCakes/i);

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();
  });

  test('has no heading-level skips', async ({ page }) => {
    // Structural check on heading order (h1 > h2 > h3 ...): dropping back
    // down a level (e.g. h3 -> h2) is a normal new section and is fine;
    // jumping forward by more than one (e.g. h2 -> h4) is not.
    const levels = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
        (el) => Number(el.tagName.charAt(1))
      )
    );

    expect(levels.length).toBeGreaterThan(0);
    expect(levels[0]).toBe(1);

    for (let i = 1; i < levels.length; i++) {
      const jump = levels[i] - levels[i - 1];
      expect(jump).toBeLessThanOrEqual(1);
    }
  });

  test('all images have an alt attribute', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      expect(await images.nth(i).getAttribute('alt')).not.toBeNull();
    }
  });

  test('all images finish loading successfully', async ({ page }) => {
    await checkImagesLoaded(page);
  });

  test('has the expected landmark regions', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('footer exposes a mailto contact link (not a literal address)', async ({
    page,
  }) => {
    // Phone/email/address come from Sanity and are owner-editable, so this
    // asserts the structural affordance (a mailto: link exists) rather than
    // any literal contact text, which could change at any time.
    const footer = page.getByRole('contentinfo');
    const mailLink = footer.locator('a[href^="mailto:"]');
    await expect(mailLink).toHaveCount(1);
  });

  test('has a working "Contact us Today!" call-to-action to /contact', async ({
    page,
  }) => {
    // This CTA text and href are hardcoded in app/page.tsx (not CMS
    // content), so asserting on it is safe.
    const cta = page.getByRole('link', {
      name: 'Contact us Today!',
      exact: true,
    });
    await expect(cta).toHaveAttribute('href', '/contact');
  });

  test('has a meta description tag', async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
    const content = await description.getAttribute('content');
    expect(content?.length).toBeGreaterThan(0);
  });
});

test.describe('Homepage - console errors', () => {
  test('has no unexpected console or page errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await navigateAndWait(page, '/');

    const criticalErrors = errors.filter((error) => !error.includes('favicon'));
    expect(criticalErrors).toEqual([]);
  });
});
