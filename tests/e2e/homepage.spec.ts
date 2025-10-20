import { test, expect } from '@playwright/test';
import { navigateAndWait, checkNavigationLinks, checkImagesLoaded } from '../helpers/test-utils';

test.describe('Homepage - Cross-Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/ChrisCakes/i);

    // Check main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should display header navigation', async ({ page }) => {
    const expectedLinks = ['Home', 'Menu', 'About', 'Services', 'Contact'];
    await checkNavigationLinks(page, expectedLinks);
  });

  test('should display footer with contact information', async ({ page }) => {
    // Footer should be visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for phone number or contact info
    await expect(footer).toContainText(/248/); // Phone area code
  });

  test('should load all images without errors', async ({ page }) => {
    await checkImagesLoaded(page);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Navigate and interact
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (if any)
    const criticalErrors = errors.filter(
      (error) => !error.includes('favicon') // Ignore favicon errors
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should display hero section with CTA', async ({ page }) => {
    // Look for main call-to-action button
    const ctaButton = page.getByRole('link', { name: /menu|order|book/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
  });

  test('should be responsive on mobile viewport', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, hamburger menu should be visible
      const menuButton = page.getByRole('button', { name: /menu/i });
      await expect(menuButton).toBeVisible();

      // Click to open menu
      await menuButton.click();
      await page.waitForTimeout(500);

      // Navigation links should now be visible
      const homeLink = page.getByRole('link', { name: 'Home' });
      await expect(homeLink).toBeVisible();
    } else {
      // On desktop, navigation links should be visible directly
      const homeLink = page.getByRole('link', { name: 'Home' });
      await expect(homeLink).toBeVisible();
    }
  });
});
