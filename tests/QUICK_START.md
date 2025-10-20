# Quick Start - Running Tests

## Prerequisites

```bash
# 1. Start development server (in one terminal)
npm run dev

# 2. Verify server is running at http://localhost:3000
```

## Run All Tests

```bash
# Run all tests (headless)
npm test

# Run with browser visible
npm run test:headed

# Run with interactive UI (recommended for first time)
npm run test:ui
```

## Run Specific Test Suites

```bash
npm run test:e2e       # End-to-end tests
npm run test:a11y      # Accessibility tests
npm run test:visual    # Visual regression tests
```

## Run Specific Browsers

```bash
# Chrome only
npm test -- --project=chromium

# Firefox only
npm test -- --project=firefox

# Safari (WebKit) only
npm test -- --project=webkit

# Mobile only
npm test -- --project="Mobile Chrome"
```

## View Results

```bash
# Open HTML report in browser
npm run test:report
```

## Debug Failed Tests

```bash
# Debug mode (step through tests)
npm run test:debug

# Run single test file
npm test tests/e2e/homepage.spec.ts

# Run single test by name
npm test -- -g "should load homepage"
```

## Update Visual Baselines

```bash
# After making intentional UI changes
npm run test:visual -- --update-snapshots
```

## Common Issues

**Tests fail with "page not found"**
→ Start dev server: `npm run dev`

**Browser not found**
→ Install browsers: `npx playwright install`

**Visual tests fail after UI changes**
→ Update baselines: `npm test -- --update-snapshots`

## Next Steps

1. Run `npm test` to see current status
2. Fix any failures
3. View report: `npm run test:report`
4. Read full guide: `../TESTING_GUIDE.md`

---

**Need Help?** See `README.md` or `../TESTING_GUIDE.md`
