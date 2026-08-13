import { test, expect, type Page } from '@playwright/test';
import { navigateAndWait } from '../helpers/test-utils';

interface NavLink {
  href: string;
  label: string;
}

/**
 * Mirrors the `navLinks` array in components/layout/Header.tsx exactly
 * (label + href). Keep in sync if the header nav changes.
 */
const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/fundraising', label: 'Fundraising' },
  { href: '/menu', label: 'Menus' },
  { href: '/how-to-book', label: 'How to Book' },
  { href: '/fundraising-tips', label: 'Fundraising Tips' },
  { href: '/volunteers', label: 'Your Group' },
  { href: '/day-of-event', label: 'Day of Event' },
  { href: '/invoice-payment', label: 'Invoice & Payment' },
  { href: '/about', label: 'On the Flip Side' },
  { href: '/contact', label: 'Contact Us' },
];

/**
 * Every nav link is rendered twice in the DOM at all times: once in the
 * desktop list (`div.hidden.lg:flex`) and once in the always-mounted mobile
 * panel (`#mobile-menu`, shown/hidden via the `hidden` class so
 * `aria-controls` always resolves). A bare `getByRole('link', { name })`
 * therefore hits Playwright strict mode -- every locator below is scoped to
 * one container or the other.
 */
function desktopNav(page: Page) {
  return page.locator('div.hidden.lg\\:flex');
}

function mobileMenu(page: Page) {
  return page.locator('#mobile-menu');
}

function hamburgerButton(page: Page) {
  return page.getByRole('button', { name: 'Toggle menu', exact: true });
}

// The `lg` breakpoint (1024px) is where Header.tsx switches between the
// desktop list and the hamburger/mobile-panel layout.
function isDesktopViewport(page: Page): boolean {
  const size = page.viewportSize();
  return !!size && size.width >= 1024;
}

function endsWithPath(path: string): RegExp {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}$`);
}

test.describe('Navigation - desktop nav list', () => {
  test('lists all primary links with correct hrefs', async ({ page }) => {
    test.skip(!isDesktopViewport(page), 'desktop-only nav layout');
    await navigateAndWait(page, '/');

    const nav = desktopNav(page);
    await expect(nav).toBeVisible();

    for (const link of NAV_LINKS) {
      const navLink = nav.getByRole('link', { name: link.label, exact: true });
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveAttribute('href', link.href);
    }
  });

  test('clicking through every link navigates and marks aria-current', async ({
    page,
  }) => {
    test.skip(!isDesktopViewport(page), 'desktop-only nav layout');
    await navigateAndWait(page, '/');

    for (const link of NAV_LINKS) {
      await desktopNav(page)
        .getByRole('link', { name: link.label, exact: true })
        .click();
      await page.waitForURL(endsWithPath(link.href));

      const activeLink = desktopNav(page).getByRole('link', {
        name: link.label,
        exact: true,
      });
      await expect(activeLink).toHaveAttribute('aria-current', 'page');
    }
  });

  test('mobile hamburger and panel are not shown at desktop widths', async ({
    page,
  }) => {
    test.skip(!isDesktopViewport(page), 'desktop-only nav layout');
    await navigateAndWait(page, '/');

    await expect(hamburgerButton(page)).toBeHidden();
    await expect(mobileMenu(page)).toBeHidden();
  });
});

test.describe('Navigation - mobile hamburger menu', () => {
  test('opens, navigates, closes, and Escape returns focus to the button', async ({
    page,
  }) => {
    test.skip(isDesktopViewport(page), 'mobile-only hamburger flow');
    await navigateAndWait(page, '/');

    const button = hamburgerButton(page);
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu(page)).toBeHidden();

    // Open the panel.
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(mobileMenu(page)).toBeVisible();

    // Navigate via a link inside the panel.
    await mobileMenu(page)
      .getByRole('link', { name: 'Services', exact: true })
      .click();
    await page.waitForURL(endsWithPath('/services'));

    // Selecting a link closes the panel.
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu(page)).toBeHidden();

    // Reopen, then close with Escape.
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(mobileMenu(page)).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu(page)).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('marks the active link with aria-current inside the panel', async ({
    page,
  }) => {
    test.skip(isDesktopViewport(page), 'mobile-only nav layout');
    await navigateAndWait(page, '/menu');

    await hamburgerButton(page).click();
    const activeLink = mobileMenu(page).getByRole('link', {
      name: 'Menus',
      exact: true,
    });
    await expect(activeLink).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('Navigation - shared behavior', () => {
  test('logo links back to the homepage', async ({ page }) => {
    await navigateAndWait(page, '/menu');

    // The logo <Link> has no text content -- its accessible name comes from
    // the wrapped <Image alt="...">, and it is the only link with that name.
    await page
      .getByRole('link', { name: 'Chris Cakes of Michigan', exact: true })
      .click();
    await page.waitForURL(endsWithPath('/'));
  });

  test('has accessible landmark regions', async ({ page }) => {
    await navigateAndWait(page, '/');

    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('has a skip-to-content link that becomes visible and focused on Tab', async ({
    page,
  }) => {
    await navigateAndWait(page, '/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();
  });
});
