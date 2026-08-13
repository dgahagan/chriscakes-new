import {
  test,
  expect,
  type Page,
  type Locator,
  type Route,
} from '@playwright/test';
import { navigateAndWait } from '../helpers/test-utils';

/**
 * SAFETY: this file must never let a real submission reach the server.
 * `RESEND_API_KEY` is a live key against a real inbox in local/dev
 * environments, so every test here either mocks `**\/api/contact` via
 * `page.route()` (happy path) or never triggers a submission at all
 * (client-side validation never fires a request; the honeypot test never
 * submits the form). See `tests/api/contact.spec.ts` for coverage of the
 * server's pre-send rejection paths, which are safe to hit directly because
 * they all return before any email is attempted.
 */

function contactNameInput(page: Page): Locator {
  return page.locator('#contactName');
}

function contactPhoneInput(page: Page): Locator {
  return page.locator('#contactPhone');
}

function contactEmailInput(page: Page): Locator {
  return page.locator('#contactEmail');
}

function submitButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Submit Inquiry', exact: true });
}

function statusMessage(page: Page): Locator {
  return page.getByRole('status');
}

function honeypotInput(page: Page): Locator {
  return page.locator('#website');
}

test.describe('Contact form', () => {
  test('happy path: successful submission announces success and moves focus to it', async ({
    page,
  }) => {
    // The API is fully mocked -- no request reaches the real server, so this
    // is safe regardless of what RESEND_API_KEY is set to.
    let requestCount = 0;
    await page.route('**/api/contact', async (route: Route) => {
      requestCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Your inquiry has been sent successfully!',
        }),
      });
    });

    await navigateAndWait(page, '/contact');

    await contactNameInput(page).fill('Jane Doe');
    await contactPhoneInput(page).fill('555-123-4567');
    await contactEmailInput(page).fill('jane@example.com');

    await submitButton(page).click();

    // T13: the result is role="status"/aria-live="polite" and receives
    // focus so screen readers announce it immediately.
    const status = statusMessage(page);
    await expect(status).toBeVisible();
    await expect(status).toHaveText(/thank you for your inquiry/i);
    await expect(status).toBeFocused();

    expect(requestCount).toBe(1);
  });

  test('client-side validation errors surface for invalid input', async ({
    page,
  }) => {
    // Belt-and-braces: react-hook-form should block submission entirely for
    // invalid input, so no request should ever be made. Abort anything that
    // reaches the network so a validation regression can never trigger a
    // real send.
    await page.route('**/api/contact', (route: Route) => route.abort());

    await navigateAndWait(page, '/contact');

    // Leave contactName and contactPhone empty, and give contactEmail a
    // value that fails react-hook-form's stricter pattern (no TLD) while
    // still being syntactically valid enough to satisfy the input's native
    // type="email" constraint validation -- an obviously-malformed value
    // like "not-an-email" gets blocked by the browser's own native
    // validation before React ever sees a submit event, which would test
    // the browser instead of the app's client-side validation.
    await contactEmailInput(page).fill('test@test');
    await submitButton(page).click();

    await expect(page.getByText('Contact name is required')).toBeVisible();
    await expect(page.getByText('Contact phone is required')).toBeVisible();
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test.describe('Honeypot field', () => {
    test('is present in the DOM, hidden from sighted users, and out of the tab order', async ({
      page,
    }) => {
      // No submission happens in this test at all.
      await navigateAndWait(page, '/contact');

      const honeypot = honeypotInput(page);
      await expect(honeypot).toHaveCount(1);
      await expect(honeypot).toHaveAttribute('tabindex', '-1');

      // Not visible to sighted users. Playwright's toBeVisible()/toBeHidden()
      // only look at display/visibility/opacity and element size -- an
      // off-canvas absolutely-positioned element (left: -9999px) still has a
      // non-empty layout box and would report as "visible" under that
      // definition even though no user ever sees it on screen. Asserting
      // that it never intersects the actual viewport is the check that
      // matches what a sighted user experiences.
      await expect(honeypot).not.toBeInViewport();

      // Its wrapping container is also removed from the accessibility tree.
      const wrapper = page
        .locator('div[aria-hidden="true"]')
        .filter({ has: honeypot });
      await expect(wrapper).toHaveCount(1);

      // Cannot be reached by keyboard: tabindex=-1 removes it from
      // sequential tab navigation, so shift-tabbing back from the next real
      // field must skip straight over it.
      await page.locator('#eventStartDate').focus();
      await page.keyboard.press('Shift+Tab');
      const activeId = await page.evaluate(
        () => document.activeElement?.id ?? null
      );
      expect(activeId).not.toBe('website');
    });
  });
});
