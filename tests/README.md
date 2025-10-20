# ChrisCakes Test Suite

## Directory Structure

```
tests/
├── e2e/                    # End-to-end functional tests
│   ├── homepage.spec.ts    # Homepage functionality
│   ├── menu.spec.ts        # Menu page and filtering
│   └── navigation.spec.ts  # Site-wide navigation
├── accessibility/          # WCAG 2.1 AA compliance tests
│   └── wcag-compliance.spec.ts
├── visual/                 # Visual regression tests
│   └── screenshots.spec.ts
├── helpers/                # Test utilities
│   └── test-utils.ts      # Shared test functions
└── README.md              # This file
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific suite
npm run test:e2e       # E2E tests only
npm run test:a11y      # Accessibility tests only
npm run test:visual    # Visual regression only
```

## Test Suites

### E2E Tests (`e2e/`)

Functional tests covering:
- Page loading and navigation
- Menu filtering and search
- Mobile menu functionality
- Form submissions
- Cross-browser compatibility

**Browsers tested:**
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile viewports (iPhone, Pixel, iPad)

### Accessibility Tests (`accessibility/`)

WCAG 2.1 AA compliance using axe-core:
- Color contrast
- Keyboard navigation
- Screen reader compatibility
- Touch target sizes (mobile)
- Image alt text
- Heading hierarchy
- ARIA labels and roles

### Visual Regression Tests (`visual/`)

Screenshot comparison tests:
- Desktop layouts (1440x900)
- Mobile layouts (375x667)
- Tablet layouts (768x1024)
- Component snapshots (header, footer, filters)

**First run**: Creates baseline screenshots
**Subsequent runs**: Compares against baselines

To update baselines after intentional changes:
```bash
npm test -- --update-snapshots
```

## Test Helpers

### `test-utils.ts`

Shared utility functions:

```typescript
// Navigate and wait for page load
await navigateAndWait(page, '/menu');

// Check touch target size (WCAG compliance)
await checkTouchTargetSize(page, 'button');

// Test mobile menu
await testMobileMenu(page);

// Check images loaded
await checkImagesLoaded(page);

// Verify navigation links
await checkNavigationLinks(page, ['Home', 'Menu', 'About']);
```

## Writing New Tests

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';
import { navigateAndWait } from '../helpers/test-utils';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await navigateAndWait(page, '/my-page');

    const button = page.getByRole('button', { name: 'Click me' });
    await expect(button).toBeVisible();
    await button.click();

    const result = page.getByText('Success!');
    await expect(result).toBeVisible();
  });
});
```

### Example Accessibility Test

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('my page should not have a11y violations', async ({ page }) => {
  await page.goto('/my-page');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Example Visual Test

```typescript
import { test, expect } from '@playwright/test';

test('my component should match baseline', async ({ page }) => {
  await page.goto('/my-page');

  const component = page.locator('.my-component');
  await expect(component).toHaveScreenshot('my-component.png');
});
```

## Debugging Tests

### UI Mode (Recommended)

```bash
npm run test:ui
```

Interactive mode with:
- Test explorer
- Time travel debugging
- Watch mode
- Screenshots and videos

### Debug Mode

```bash
npm run test:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Headed Mode

```bash
npm run test:headed
```

See the browser while tests run.

## CI/CD Integration

Tests are designed to run in CI environments:

```bash
# Set CI environment variable
export CI=true

# Install with dependencies
npx playwright install --with-deps

# Run tests
npm test
```

Tests will automatically:
- Retry failed tests (2x on CI)
- Run serially on CI
- Generate HTML reports
- Capture screenshots/videos on failure

## Performance Targets

Tests verify these metrics:

| Metric | Target |
|--------|--------|
| Page Load | <3s |
| FCP | <1.8s |
| LCP | <2.5s |
| TTI | <3.5s |
| CLS | <0.1 |
| Lighthouse Performance | >90 |
| Lighthouse Accessibility | >90 |

## Troubleshooting

### Tests fail with timeouts
- Ensure dev server is running (`npm run dev`)
- Check `http://localhost:3000` is accessible
- Increase timeout in `playwright.config.ts` if needed

### Browser not found
```bash
npx playwright install
```

### Visual tests fail unexpectedly
- Check if you made intentional design changes
- Update baselines: `npm test -- --update-snapshots`
- Run on same OS (screenshots vary by platform)

### Accessibility violations
- Review detailed report: `npm run test:report`
- Check axe-core docs for specific violation
- Fix in component and re-run

## Resources

- [Playwright Docs](https://playwright.dev)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)

---

*For comprehensive testing guide, see [TESTING_GUIDE.md](../TESTING_GUIDE.md)*
