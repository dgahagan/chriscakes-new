import { test, expect, type Page, type Locator } from '@playwright/test';
import { navigateAndWait } from '../helpers/test-utils';

function menuItems(page: Page): Locator {
  return page.locator('[data-testid="menu-item"]');
}

function categoryFilter(page: Page): Locator {
  return page.getByRole('button', { name: 'All Categories', exact: true });
}

// Every category button (including "All Categories") carries aria-pressed;
// no other button on the page does, so this is a reliable way to find "some
// category button that isn't All Categories" regardless of its label.
function categoryButtons(page: Page): Locator {
  return page.locator('button[aria-pressed]');
}

function searchInput(page: Page): Locator {
  return page.getByRole('textbox', { name: 'Search menu items' });
}

function clearSearchButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Clear search', exact: true });
}

function sortSelect(page: Page): Locator {
  return page.locator('#sort-select');
}

function printButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Print menu', exact: true });
}

/**
 * Reads the visible name of the first menu item card. Cards render the item
 * name in an <h3>, scoped inside the card so it never collides with the
 * category <h2> headings that also appear on the page.
 */
async function firstItemName(page: Page): Promise<string | null> {
  return menuItems(page).first().locator('h3').first().textContent();
}

test.describe('Menu Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/menu');
  });

  test('loads with the expected title and an h1', async ({ page }) => {
    await expect(page).toHaveTitle(/Menu.*ChrisCakes/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('renders at least one category button and one menu item', async ({
    page,
  }) => {
    await expect(categoryFilter(page)).toBeVisible();
    expect(await categoryButtons(page).count()).toBeGreaterThan(0);
    await expect(menuItems(page).first()).toBeVisible();
    expect(await menuItems(page).count()).toBeGreaterThan(0);
  });

  test('"All Categories" starts pressed', async ({ page }) => {
    await expect(categoryFilter(page)).toHaveAttribute('aria-pressed', 'true');
  });

  test('selecting a category updates aria-pressed and keeps the grid non-empty', async ({
    page,
  }) => {
    // Any category button other than "All Categories" is a real category,
    // whatever its label happens to be today.
    const categoryButton = categoryButtons(page)
      .filter({ hasNotText: 'All Categories' })
      .first();

    // Fall back gracefully if the CMS currently has zero categories beyond
    // "All Categories" -- the grid-shape tests above already cover that case.
    if ((await categoryButton.count()) === 0) {
      test.skip(true, 'no non-default category button rendered');
    }

    await expect(categoryFilter(page)).toHaveAttribute('aria-pressed', 'true');

    await categoryButton.click();
    await expect(categoryButton).toHaveAttribute('aria-pressed', 'true');
    await expect(categoryFilter(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(menuItems(page).first()).toBeVisible();

    // Switching back to "All Categories" restores its pressed state.
    await categoryFilter(page).click();
    await expect(categoryFilter(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(categoryButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('searching narrows the visible set and clearing restores it', async ({
    page,
  }) => {
    const initialCount = await menuItems(page).count();
    expect(initialCount).toBeGreaterThan(0);

    // A name lifted from the currently-rendered first item is guaranteed to
    // match at least that one item, without asserting anything about which
    // item it is.
    const targetName = (await firstItemName(page))?.trim();
    expect(targetName).toBeTruthy();

    const search = searchInput(page);
    await search.fill(targetName as string);

    // The grid re-renders synchronously off React state; wait for the count
    // to settle rather than a fixed timeout.
    await expect(async () => {
      const filteredCount = await menuItems(page).count();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }).toPass();

    // An obviously-unmatchable query empties the grid entirely.
    await search.fill('zzzzzznonexistentmenuitemzzzzzz');
    await expect(menuItems(page)).toHaveCount(0);

    await clearSearchButton(page).click();
    await expect(search).toHaveValue('');
    await expect(menuItems(page)).toHaveCount(initialCount);
  });

  test('the clear-search button only appears while there is a query', async ({
    page,
  }) => {
    await expect(clearSearchButton(page)).toBeHidden();
    await searchInput(page).fill('a');
    await expect(clearSearchButton(page)).toBeVisible();
    await clearSearchButton(page).click();
    await expect(clearSearchButton(page)).toBeHidden();
  });

  test('sorting by name-asc then name-desc reverses the first item', async ({
    page,
  }) => {
    // Sorting only produces an observable reversal when there's more than
    // one item to reorder.
    test.skip(
      (await menuItems(page).count()) < 2,
      'fewer than two menu items rendered'
    );

    await sortSelect(page).selectOption('name-asc');
    const ascName = await firstItemName(page);

    await sortSelect(page).selectOption('name-desc');
    const descName = await firstItemName(page);

    expect(ascName).toBeTruthy();
    expect(descName).toBeTruthy();
    expect(descName).not.toBe(ascName);
  });

  test('print button triggers window.print', async ({ page }) => {
    await page.evaluate(() => {
      (window as unknown as { __printCalled: boolean }).__printCalled = false;
      window.print = () => {
        (window as unknown as { __printCalled: boolean }).__printCalled = true;
      };
    });

    await printButton(page).click();

    const printCalled = await page.evaluate(
      () => (window as unknown as { __printCalled: boolean }).__printCalled
    );
    expect(printCalled).toBe(true);
  });
});
