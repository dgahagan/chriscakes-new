import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { navigateAndWait, checkTouchTargetSize } from '../helpers/test-utils';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const SCANNED_PAGES = ['/', '/menu', '/about', '/services', '/contact'];

/**
 * Runs axe over our own markup only.
 *
 * The homepage embeds a YouTube player, and axe descends into the iframe
 * and reports the player's internals (aria-level on a title element,
 * aria-label on #movie_player). That markup is served by YouTube, is not
 * ours to fix, and changes whenever they redeploy — so scanning it would
 * make the suite fail for reasons no change in this repo could address.
 * Everything outside third-party frames is still scanned.
 *
 * Colour contrast is covered here too: `wcag2aa` includes the
 * `color-contrast` rule, so it needs no separate test.
 */
function scanPage(page: Page) {
  return new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .exclude('iframe')
    .analyze();
}

test.describe('WCAG 2.1 AA compliance', () => {
  for (const path of SCANNED_PAGES) {
    test(`${path} has no axe violations`, async ({ page }) => {
      await navigateAndWait(page, path);

      const results = await scanPage(page);

      expect(results.violations).toEqual([]);
    });
  }
});

test.describe('Keyboard navigation', () => {
  test('the first Tab reaches the skip link, which then moves focus to main', async ({
    page,
  }) => {
    await navigateAndWait(page, '/');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });

    // Assert focus landed on this specific element. The previous version
    // only checked that document.activeElement was truthy, which is true of
    // <body> and therefore passed no matter what happened.
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
});

test.describe('Mobile keyboard access', () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: true });

  test('the hamburger opens the navigation panel from the keyboard', async ({
    page,
  }) => {
    await navigateAndWait(page, '/');

    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Scope to the panel: every nav link is rendered twice (desktop list and
    // this always-mounted panel), so an unscoped locator matches two
    // elements and fails strict mode.
    const panel = page.locator('#mobile-menu');
    await expect(panel).toBeVisible();
    await expect(
      panel.getByRole('link', { name: 'Home', exact: true })
    ).toBeVisible();
  });
});

test.describe('Touch target size (mobile)', () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: true });

  test('the hamburger button meets the 44x44 minimum', async ({ page }) => {
    await navigateAndWait(page, '/');

    await checkTouchTargetSize(page, 'button[aria-label="Toggle menu"]');
  });

  test('every category filter button meets the 44x44 minimum', async ({
    page,
  }) => {
    await navigateAndWait(page, '/menu');

    // Located by aria-pressed rather than by label text, so renaming a
    // category in the CMS cannot turn this red.
    const filters = page.locator('button[aria-pressed]');
    await expect(filters.first()).toBeVisible();

    const count = await filters.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await filters.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Heading hierarchy', () => {
  for (const path of SCANNED_PAGES) {
    test(`${path} has one h1 and no skipped heading levels`, async ({
      page,
    }) => {
      await navigateAndWait(page, path);

      const levels = await page
        .locator('h1, h2, h3, h4, h5, h6')
        .evaluateAll((elements) =>
          elements.map((el) => Number(el.tagName.substring(1)))
        );

      expect(levels.filter((level) => level === 1)).toHaveLength(1);

      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });
  }
});
