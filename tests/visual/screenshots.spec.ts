import { test, expect } from '@playwright/test';
import { navigateAndWait } from '../helpers/test-utils';

/**
 * Visual regression tests using Playwright's screenshot comparison
 *
 * First run will create baseline screenshots
 * Subsequent runs will compare against baselines
 */

test.describe('Visual Regression - Desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('homepage should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/');
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('menu page should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/menu');
    await page.waitForTimeout(2000); // Wait for menu items to load
    await expect(page).toHaveScreenshot('menu-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('about page should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/about');
    await expect(page).toHaveScreenshot('about-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('services page should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/services');
    await expect(page).toHaveScreenshot('services-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('contact page should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/contact');
    await expect(page).toHaveScreenshot('contact-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: true });

  test('homepage mobile should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/');
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('menu page mobile should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/menu');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('menu-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile menu open should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('mobile-menu-open.png', {
      animations: 'disabled',
    });
  });

  test('about page mobile should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/about');
    await expect(page).toHaveScreenshot('about-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 }, isMobile: true });

  test('homepage tablet should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/');
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('menu page tablet should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/menu');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('menu-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Component Snapshots', () => {
  test('header navigation should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/');

    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('header-component.png', {
      animations: 'disabled',
    });
  });

  test('footer should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/');

    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-component.png', {
      animations: 'disabled',
    });
  });

  test('menu category filters should match baseline', async ({ page }) => {
    await navigateAndWait(page, '/menu');
    await page.waitForTimeout(2000);

    // Screenshot the category filter section
    const filters = page.locator('[class*="filter"], nav').first();
    await expect(filters).toHaveScreenshot('menu-filters-component.png', {
      animations: 'disabled',
    });
  });
});
