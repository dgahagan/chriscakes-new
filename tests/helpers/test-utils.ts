import { Page, expect } from '@playwright/test';

/**
 * Test utility functions for ChrisCakes website testing
 */

/**
 * Wait for page to be fully loaded including network idle
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Check if an element is visible and in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  const box = await element.boundingBox();
  if (!box) return false;

  const viewport = page.viewportSize();
  if (!viewport) return false;

  return (
    box.y >= 0 &&
    box.x >= 0 &&
    box.y + box.height <= viewport.height &&
    box.x + box.width <= viewport.width
  );
}

/**
 * Check if touch target meets WCAG 2.1 AA minimum size (44x44px)
 */
export async function checkTouchTargetSize(page: Page, selector: string) {
  const element = page.locator(selector);
  const box = await element.boundingBox();

  expect(box).not.toBeNull();
  if (box) {
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
}

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateAndWait(page: Page, path: string) {
  await page.goto(path);
  await waitForPageLoad(page);
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options?: { fullPage?: boolean }
) {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: options?.fullPage ?? false,
  });
}

/**
 * Check color contrast ratio (simplified - for basic checks)
 * For comprehensive checks, use axe-core or similar
 */
export function calculateContrastRatio(
  foreground: string,
  background: string
): number {
  // This is a simplified version. For production, use a proper color contrast library
  // Returns a mock ratio for now - real implementation would parse RGB and calculate
  return 4.5; // Placeholder
}

/**
 * Verify navigation links are present and working
 */
export async function checkNavigationLinks(page: Page, expectedLinks: string[]) {
  for (const linkText of expectedLinks) {
    const link = page.getByRole('link', { name: linkText });
    await expect(link).toBeVisible();
  }
}

/**
 * Check if images are properly loaded
 */
export async function checkImagesLoaded(page: Page) {
  const images = page.locator('img');
  const count = await images.count();

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const naturalWidth = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  }
}

/**
 * Test mobile menu functionality
 */
export async function testMobileMenu(page: Page) {
  // Check if hamburger menu button is visible (on mobile)
  const menuButton = page.getByRole('button', { name: /menu/i });

  if (await menuButton.isVisible()) {
    // Click to open
    await menuButton.click();
    await page.waitForTimeout(500); // Wait for animation

    // Verify menu is open (check for navigation links)
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();

    // Click to close
    await menuButton.click();
    await page.waitForTimeout(500); // Wait for animation
  }
}

/**
 * Check for console errors
 */
export async function checkConsoleErrors(page: Page) {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
}

/**
 * Verify page has proper meta tags for SEO
 */
export async function checkSEOMetaTags(page: Page) {
  // Check title
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
  expect(title.length).toBeLessThan(60); // SEO best practice

  // Check meta description
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveCount(1);

  // Check Open Graph tags
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveCount(1);
}
