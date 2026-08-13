# Quick Start - Running Tests

## The one command to run

The suite builds and starts its own production server — don't run
`npm run dev` first, and don't start anything on the port yourself.

```bash
PLAYWRIGHT_PORT=3100 npx playwright test --project=chromium --project="Mobile Chrome"
```

Why this exact command:

- **`PLAYWRIGHT_PORT=3100`** — the config always launches its own server
  (`reuseExistingServer: false`) on port 3000 by default. If something else
  already owns 3000 on your machine, override it so the run fails loudly
  on a busy port instead of silently testing the wrong app.
- **`--project=chromium --project="Mobile Chrome"`** — the config defines
  11 projects (all browsers + breakpoints), but only chromium is normally
  installed on a dev box. A bare `npm test` will try to launch Firefox and
  WebKit and fail if they aren't installed. `Mobile Chrome` is Pixel 5
  emulation on chromium, not a separate browser, so it works without extra
  installs. This pair is also what CI runs.

## Run the full matrix

Requires all Playwright browsers installed first:

```bash
npx playwright install
PLAYWRIGHT_PORT=3100 npm test
```

## Run a subset

The `npm run test:e2e` / `npm run test:a11y` shortcuts exist, but they carry
no port or project overrides — so they hit both problems above on a typical
dev box. Prefer the explicit form:

```bash
PLAYWRIGHT_PORT=3100 npx playwright test tests/e2e \
  --project=chromium --project="Mobile Chrome"
PLAYWRIGHT_PORT=3100 npx playwright test tests/accessibility \
  --project=chromium --project="Mobile Chrome"
PLAYWRIGHT_PORT=3100 npx playwright test tests/e2e/homepage.spec.ts \
  --project=chromium
PLAYWRIGHT_PORT=3100 npx playwright test -g "should load homepage" \
  --project=chromium
```

## Debug

```bash
npm run test:ui       # interactive UI mode (recommended)
npm run test:debug    # Playwright Inspector, step-by-step
npm run test:headed   # see the browser
npm run test:report   # open the last HTML report
```

## Common issues

**"Browser not found" / firefox or webkit fails to launch**
→ `npx playwright install` (or just use `--project=chromium --project="Mobile Chrome"`)

**Port already in use**
→ Set `PLAYWRIGHT_PORT` to a free port; the suite always starts its own
server and never reuses one already running.

## More detail

For the full directory layout, what each spec covers, the email-safety
rule around `RESEND_API_KEY`, and conventions for writing new tests
(nav-locator scoping, content-tolerant assertions, no `waitForTimeout`,
contact-API rate-limit isolation), see [`README.md`](./README.md).

Historical (pre-T23 suite, no longer current):
[`../docs/archive/TESTING_GUIDE.md`](../docs/archive/TESTING_GUIDE.md).
