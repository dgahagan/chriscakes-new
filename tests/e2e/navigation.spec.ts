import { test, expect } from '@playwright/test';
import { navigateAndWait, testMobileMenu } from '../helpers/test-utils';

test.describe('Navigation - Cross-Browser Tests', () => {
  test('should navigate between all main pages', async ({ page }) => {
    // Start at homepage
    await navigateAndWait(page, '/');

    // Navigate to Menu
    await page.getByRole('link', { name: 'Menu' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/menu/);

    // Navigate to About
    await page.getByRole('link', { name: 'About' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/about/);

    // Navigate to Services
    await page.getByRole('link', { name: 'Services' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/services/);

    // Navigate to Contact
    await page.getByRole('link', { name: 'Contact' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/contact/);

    // Navigate back to Home
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/^\/$|\/$/);
  });

  test('should display mobile menu on small screens', async ({ page, isMobile }) => {
    await navigateAndWait(page, '/');

    if (isMobile) {
      await testMobileMenu(page);
    }
  });

  test('should have working logo link to homepage', async ({ page }) => {
    await navigateAndWait(page, '/menu');

    // Find logo or site title link
    const logoLink = page.locator('a[href="/"]').first();
    await logoLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/^\/$|\/$/);
  });

  test('should highlight active page in navigation', async ({ page }) => {
    await navigateAndWait(page, '/menu');

    // Menu link should have active styling or aria-current
    const menuLink = page.getByRole('link', { name: 'Menu' });
    const ariaCurrentValue = await menuLink.getAttribute('aria-current');

    // Check if marked as current page
    expect(ariaCurrentValue === 'page' || ariaCurrentValue === 'true').toBeTruthy();
  });

  test('should have accessible navigation landmarks', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Check for header navigation
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have skip to content link for accessibility', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Press Tab to focus skip link
    await page.keyboard.press('Tab');

    // Skip link should become visible when focused
    const skipLink = page.getByText(/skip to (main )?content/i);
    const isVisible = await skipLink.isVisible();

    expect(isVisible).toBeTruthy();
  });
});
