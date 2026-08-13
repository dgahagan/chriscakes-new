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
 * Verify navigation links are present and working
 */
export async function checkNavigationLinks(
  page: Page,
  expectedLinks: string[]
) {
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
    const naturalWidth = await img.evaluate(
      (el) => (el as HTMLImageElement).naturalWidth
    );
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
