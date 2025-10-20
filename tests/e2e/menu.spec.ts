import { test, expect } from '@playwright/test';
import { navigateAndWait } from '../helpers/test-utils';

test.describe('Menu Page - Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/menu');
  });

  test('should load menu page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Menu.*ChrisCakes/i);

    const heading = page.getByRole('heading', { name: /menu/i, level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should display menu categories', async ({ page }) => {
    // Wait for menu items to load
    await page.waitForSelector('article, [role="article"], .menu-item', { timeout: 10000 });

    // Check for category filters or navigation
    const categoryButtons = page.locator('button').filter({ hasText: /breakfast|lunch|dinner|all/i });
    const count = await categoryButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display menu items', async ({ page }) => {
    // Wait for menu items to load
    await page.waitForTimeout(2000);

    // Check for menu item cards - using multiple possible selectors
    const menuItems = page.locator('[class*="menu"]').filter({ has: page.locator('h2, h3') });
    const count = await menuItems.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should filter menu by category', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find category filter buttons
    const breakfastButton = page.getByRole('button', { name: /breakfast/i });

    if (await breakfastButton.isVisible()) {
      await breakfastButton.click();
      await page.waitForTimeout(1000);

      // Verify URL or active state changed
      const isActive = await breakfastButton.evaluate((el) => {
        return el.classList.contains('active') ||
               el.classList.contains('bg-crimson') ||
               el.getAttribute('aria-current') === 'true';
      });

      expect(isActive).toBeTruthy();
    }
  });

  test('should display menu item details', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Look for any menu item with a heading
    const firstMenuItem = page.locator('h2, h3').first();
    await expect(firstMenuItem).toBeVisible();

    // Check that items have names visible
    const itemName = await firstMenuItem.textContent();
    expect(itemName?.length).toBeGreaterThan(0);
  });

  test('should show all categories when "All" is selected', async ({ page }) => {
    await page.waitForTimeout(2000);

    const allButton = page.getByRole('button', { name: /^all$/i });

    if (await allButton.isVisible()) {
      await allButton.click();
      await page.waitForTimeout(1000);

      // Count visible menu items
      const menuItems = page.locator('h2, h3').filter({ hasText: /.+/ });
      const count = await menuItems.count();

      expect(count).toBeGreaterThan(5); // Should show multiple items
    }
  });

  test('should load menu item images', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Check for Next.js Image components or img tags
    const images = page.locator('img').filter({ hasNot: page.locator('[alt=""]') });
    const count = await images.count();

    if (count > 0) {
      // Verify first image loaded
      const firstImg = images.first();
      const naturalWidth = await firstImg.evaluate((el) => (el as HTMLImageElement).naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('should be mobile responsive', async ({ page, isMobile }) => {
    await page.waitForTimeout(2000);

    // Menu should be readable on mobile
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Category filters should be visible
    const categoryButtons = page.locator('button').filter({ hasText: /breakfast|lunch|dinner|all/i });
    const count = await categoryButtons.count();
    expect(count).toBeGreaterThan(0);

    if (isMobile) {
      // On mobile, items should stack vertically
      const firstItem = page.locator('h2, h3').first();
      const box = await firstItem.boundingBox();
      expect(box?.width).toBeLessThan(600); // Should not be full desktop width
    }
  });
});
