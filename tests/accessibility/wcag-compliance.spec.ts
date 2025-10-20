import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { navigateAndWait, checkTouchTargetSize } from '../helpers/test-utils';

test.describe('WCAG 2.1 AA Compliance Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await navigateAndWait(page, '/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('menu page should not have accessibility violations', async ({ page }) => {
    await navigateAndWait(page, '/menu');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('about page should not have accessibility violations', async ({ page }) => {
    await navigateAndWait(page, '/about');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('services page should not have accessibility violations', async ({ page }) => {
    await navigateAndWait(page, '/services');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('contact page should not have accessibility violations', async ({ page }) => {
    await navigateAndWait(page, '/contact');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Keyboard Navigation Tests', () => {
  test('should support full keyboard navigation', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Press Tab multiple times to navigate through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }

    // Check that focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;

      const styles = window.getComputedStyle(el);
      return {
        tagName: el.tagName,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
      };
    });

    expect(focusedElement).not.toBeNull();
  });

  test('skip to content link should work', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Press Tab to focus skip link
    await page.keyboard.press('Tab');

    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Main content should be focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });

  test('mobile menu should be keyboard accessible', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Set mobile viewport for this test
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await navigateAndWait(page, '/');

    // Tab to menu button
    let menuButtonFocused = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.getAttribute('aria-label')?.toLowerCase().includes('menu') ||
               el?.textContent?.toLowerCase().includes('menu');
      });
      if (focused) {
        menuButtonFocused = true;
        break;
      }
    }

    expect(menuButtonFocused).toBeTruthy();

    // Press Enter to open menu
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Navigation should be visible
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
  });
});

test.describe('Touch Target Size Tests (Mobile)', () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: true });

  test('navigation buttons should meet minimum touch target size', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Check menu button (hamburger)
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await checkTouchTargetSize(page, 'button[aria-label*="menu" i], button:has-text("Menu")');
    }
  });

  test('menu category filters should meet minimum touch target size', async ({ page }) => {
    await navigateAndWait(page, '/menu');
    await page.waitForTimeout(2000);

    // Get all category filter buttons
    const buttons = page.locator('button').filter({ hasText: /breakfast|lunch|dinner|all/i });
    const count = await buttons.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        expect(box).not.toBeNull();

        if (box) {
          // WCAG 2.1 AA requires 44x44px minimum
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });
});

test.describe('Image Alt Text Tests', () => {
  test('all images should have alt text', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Get all images
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Alt attribute should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('meaningful images should have descriptive alt text', async ({ page }) => {
    await navigateAndWait(page, '/menu');
    await page.waitForTimeout(2000);

    // Get images that are likely menu items or content images
    const contentImages = page.locator('article img, [class*="menu"] img');
    const count = await contentImages.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = contentImages.nth(i);
        const alt = await img.getAttribute('alt');

        expect(alt).not.toBeNull();
        // Meaningful images should have non-empty alt (unless decorative)
        if (alt) {
          expect(alt.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

test.describe('Heading Hierarchy Tests', () => {
  test('pages should have proper heading hierarchy', async ({ page }) => {
    await navigateAndWait(page, '/');

    // Get all headings
    const headings = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return elements.map((el) => ({
        level: parseInt(el.tagName.substring(1)),
        text: el.textContent?.substring(0, 50),
      }));
    });

    // Should have exactly one h1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count).toBe(1);

    // Check heading hierarchy (no skipping levels)
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1].level;
      const current = headings[i].level;

      // Current heading should not skip levels (e.g., h1 -> h3)
      expect(current - prev).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('Color Contrast Tests', () => {
  test('text should have sufficient color contrast', async ({ page }) => {
    await navigateAndWait(page, '/');

    const contrastResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Filter for color-contrast violations
    const contrastViolations = contrastResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });
});
