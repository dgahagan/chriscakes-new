# ChrisCakes Testing Guide

## Overview

This document provides comprehensive guidance for testing the ChrisCakes website using automated and manual testing approaches.

## Testing Infrastructure

### Tools & Frameworks

| Tool | Purpose | Documentation |
|------|---------|---------------|
| **Playwright** | Cross-browser E2E testing | https://playwright.dev |
| **@axe-core/playwright** | Accessibility testing (WCAG 2.1 AA) | https://github.com/dequelabs/axe-core-npm |
| **Chrome DevTools MCP** | Performance profiling (manual) | https://github.com/ChromeDevTools/chrome-devtools-mcp |

### MCP Servers (Optional - For AI-Assisted Testing)

- **Playwright MCP Server**: For AI-powered test generation and browser automation
  - Repository: https://github.com/microsoft/playwright-mcp
  - Usage: Can be configured in Claude Code for enhanced testing capabilities

- **Chrome DevTools MCP Server**: For AI-assisted performance analysis
  - Repository: https://github.com/ChromeDevTools/chrome-devtools-mcp
  - Usage: Enables AI to run performance traces and analyze results

---

## Running Tests

### Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Ensure server is running at http://localhost:3000**

### Test Commands

```bash
# Run all tests
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run specific test suites
npm run test:e2e          # End-to-end tests
npm run test:a11y         # Accessibility tests
npm run test:visual       # Visual regression tests

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

### Running Tests on Specific Browsers

```bash
# Run on Chromium only
npm test -- --project=chromium

# Run on Firefox only
npm test -- --project=firefox

# Run on WebKit (Safari) only
npm test -- --project=webkit

# Run on mobile viewports
npm test -- --project="Mobile Chrome"
npm test -- --project="Mobile Safari"
npm test -- --project="Tablet"
```

---

## Test Suites

### 1. E2E Tests (`tests/e2e/`)

**Homepage Tests** (`homepage.spec.ts`):
- Page loads successfully
- Header navigation displays
- Footer with contact information
- Images load without errors
- No console errors
- Hero section with CTA
- Proper meta tags for SEO
- Mobile responsiveness

**Menu Page Tests** (`menu.spec.ts`):
- Page loads successfully
- Menu categories display
- Menu items display
- Category filtering works
- Menu item details visible
- "All" filter shows all items
- Menu item images load
- Mobile responsiveness

**Navigation Tests** (`navigation.spec.ts`):
- Navigation between all main pages
- Mobile menu functionality
- Logo link to homepage
- Active page highlighting
- Accessible navigation landmarks
- Skip to content link

### 2. Accessibility Tests (`tests/accessibility/`)

**WCAG 2.1 AA Compliance** (`wcag-compliance.spec.ts`):

- **Automated Accessibility Scans**:
  - Homepage compliance
  - Menu page compliance
  - About page compliance
  - Services page compliance
  - Contact page compliance

- **Keyboard Navigation**:
  - Full keyboard navigation support
  - Skip to content link functionality
  - Mobile menu keyboard accessibility

- **Touch Target Sizes** (Mobile):
  - Navigation buttons (minimum 44x44px)
  - Menu category filters (minimum 44x44px)

- **Image Alt Text**:
  - All images have alt attributes
  - Meaningful images have descriptive alt text

- **Heading Hierarchy**:
  - Exactly one h1 per page
  - No skipped heading levels
  - Proper nesting (h1 → h2 → h3)

- **Color Contrast**:
  - Sufficient contrast ratios (4.5:1 minimum)
  - WCAG AA compliance

### 3. Visual Regression Tests (`tests/visual/`)

**Desktop Snapshots** (1440x900):
- Homepage baseline
- Menu page baseline
- About page baseline
- Services page baseline
- Contact page baseline

**Mobile Snapshots** (375x667):
- Homepage mobile baseline
- Menu page mobile baseline
- Mobile menu open state
- About page mobile baseline

**Tablet Snapshots** (768x1024):
- Homepage tablet baseline
- Menu page tablet baseline

**Component Snapshots**:
- Header navigation
- Footer
- Menu category filters

---

## Manual Testing Checklist

### Cross-Browser Testing

Test on the following browsers:

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest - macOS/iOS)
- [ ] **Edge** (latest)

### Mobile Device Testing

Test on real devices if possible:

- [ ] **iPhone** (Safari)
- [ ] **Android** (Chrome)
- [ ] **iPad** (Safari)

### Performance Testing

#### Using Chrome DevTools (Manual)

1. **Run Lighthouse Audit**:
   - Open Chrome DevTools (F12)
   - Navigate to "Lighthouse" tab
   - Select "Performance", "Accessibility", "Best Practices", "SEO"
   - Click "Analyze page load"
   - Verify scores >90 for all metrics

2. **Record Performance Trace**:
   - Open Chrome DevTools (F12)
   - Navigate to "Performance" tab
   - Click record (⚫)
   - Reload page
   - Stop recording
   - Analyze FCP, LCP, TTI, CLS metrics

3. **Network Analysis**:
   - Open Chrome DevTools (F12)
   - Navigate to "Network" tab
   - Reload page
   - Check total payload size
   - Verify ISR caching (subsequent loads should be faster)
   - Check image optimization (WebP format)

#### Performance Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **FCP** | <1.8s | First Contentful Paint |
| **LCP** | <2.5s | Largest Contentful Paint |
| **TTI** | <3.5s | Time to Interactive |
| **CLS** | <0.1 | Cumulative Layout Shift |
| **Page Load** | <3s | Total page load time |
| **Lighthouse Performance** | >90 | Overall performance score |
| **Lighthouse Accessibility** | >90 | Accessibility score |
| **Lighthouse Best Practices** | >90 | Best practices score |
| **Lighthouse SEO** | >90 | SEO score |

### Sanity Studio Testing

#### CRUD Operations

1. **Create New Menu Item**:
   - [ ] Navigate to `/studio`
   - [ ] Click "Menu Items" → "Create"
   - [ ] Fill in all fields (name, description, price, category, image)
   - [ ] Click "Publish"
   - [ ] Verify item appears on `/menu` within 60 seconds

2. **Update Menu Item**:
   - [ ] Edit existing menu item
   - [ ] Change price
   - [ ] Click "Publish"
   - [ ] Verify change appears on `/menu` within 60 seconds

3. **Delete Menu Item**:
   - [ ] Delete a menu item
   - [ ] Verify item removed from `/menu` within 60 seconds

4. **Upload Image**:
   - [ ] Upload new image to menu item
   - [ ] Verify image displays correctly
   - [ ] Check image is optimized (WebP format)

5. **Reorder Sections** (Dynamic Pages):
   - [ ] Open a dynamic page (e.g., About, Services)
   - [ ] Drag and drop sections to reorder
   - [ ] Click "Publish"
   - [ ] Verify new order on frontend within 60 seconds

#### ISR (Incremental Static Regeneration) Testing

1. Make content change in Sanity Studio
2. Wait up to 60 seconds
3. Hard refresh page (Ctrl+Shift+R / Cmd+Shift+R)
4. Verify change is visible

---

## Test Results & Reporting

### Viewing Test Reports

After running tests:

```bash
npm run test:report
```

This opens an HTML report in your browser showing:
- Test pass/fail status
- Screenshots of failures
- Video recordings of test runs
- Detailed error logs

### CI/CD Integration

Tests can be integrated into GitHub Actions or other CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Troubleshooting

### Common Issues

**1. Tests fail with "page not found"**
- Solution: Ensure `npm run dev` is running before tests
- Check that `http://localhost:3000` is accessible

**2. Browser binaries not found**
- Solution: Run `npx playwright install`

**3. Visual regression tests fail after intentional changes**
- Solution: Update baselines with `npm test -- --update-snapshots`

**4. Accessibility tests fail**
- Solution: Review axe-core violations in test report
- Fix issues in components (contrast, alt text, ARIA labels)

**5. ISR not updating**
- Solution: Check Sanity API token in `.env.local`
- Verify 60-second revalidation in page code
- Clear browser cache and hard refresh

### Getting Help

- Playwright Docs: https://playwright.dev/docs/intro
- axe-core Rules: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- Next.js ISR: https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration

---

## Success Criteria

All tests pass when:

- ✅ All E2E tests pass across Chrome, Firefox, Safari, Edge
- ✅ All mobile viewport tests pass with no layout issues
- ✅ Zero accessibility violations (WCAG 2.1 AA)
- ✅ Lighthouse scores >90 for Performance, Accessibility, Best Practices, SEO
- ✅ Page load time <3 seconds on average connection
- ✅ ISR updates content within 60 seconds
- ✅ Visual regression tests show no unintended changes
- ✅ Owner can successfully update content via Sanity Studio

---

## Next Steps

1. **Run initial test suite**: `npm test`
2. **Review failures**: `npm run test:report`
3. **Fix issues** identified in tests
4. **Run performance audits** using Chrome DevTools
5. **Conduct manual UAT** with site owners
6. **Document any edge cases** discovered during testing

---

*Last Updated: 2025-10-19*
