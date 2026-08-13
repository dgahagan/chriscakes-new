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
