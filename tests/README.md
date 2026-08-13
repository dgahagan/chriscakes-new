# ChrisCakes Test Suite

Playwright end-to-end, API, and accessibility tests. This suite was rebuilt
from scratch in T23–T27; if you're looking at old screenshots or a `visual/`
directory in your memory of this repo, that's gone — see the historical note
at the bottom.

## Directory Structure

```
tests/
├── e2e/
│   ├── homepage.spec.ts    # Title/h1, heading order, images, landmarks,
│   │                       # mailto link, homepage CTA, meta description,
│   │                       # console-error check
│   ├── navigation.spec.ts  # Desktop nav list, mobile hamburger menu,
│   │                       # skip-to-content link, logo-to-home link
│   ├── menu.spec.ts        # Category filtering, search, sort, print button
│   ├── pages.spec.ts       # /fundraising, a sitemap-sourced [slug] page,
│   │                       # and the 404 page
│   └── contact.spec.ts     # Contact form UI: happy path (mocked), client
│                           # validation, honeypot field
├── api/
│   └── contact.spec.ts     # POST /api/contact: honeypot + fill-time bot
│                           # gates, field validation, malformed/oversized
│                           # bodies, wrong method, subject-line sanitization
├── accessibility/
│   └── wcag-compliance.spec.ts  # axe-core WCAG 2.1 AA scan of every page
│                                 # in SCANNED_PAGES, keyboard nav, mobile
│                                 # keyboard access, touch target size,
│                                 # heading hierarchy
├── helpers/
│   └── test-utils.ts        # navigateAndWait, checkTouchTargetSize,
│                             # checkImagesLoaded, waitForPageLoad
├── QUICK_START.md           # The short version — start here
└── README.md                 # This file
```

There is no `tests/visual/` directory and no `test:visual` npm script —
both were removed in T23. Screenshot/visual-regression testing is not part
of this suite.

## Running the suite

The suite builds and starts its own production server — you do **not** run
`npm run dev` first. `playwright.config.ts`'s `webServer.command` is
`npm run build && npm run start -- --port ${PORT}`, and
`reuseExistingServer` is `false`, so whatever port it wants must be free
when the run starts.

```bash
# Full 11-project matrix (all browsers/breakpoints) — requires all
# Playwright browsers installed (see below)
npm test

# The realistic local command: only chromium is normally installed on a
# dev box, and the port is usually free on 3100, not 3000
PLAYWRIGHT_PORT=3100 npx playwright test --project=chromium --project="Mobile Chrome"
```

**Port**: defaults to 3000 (override with `PLAYWRIGHT_PORT`). On a dev box
where something else already owns 3000, set `PLAYWRIGHT_PORT` to a free
port — a busy port now fails loudly (address already in use) instead of
silently testing whatever app happens to already be listening there.

**Browser matrix**: `playwright.config.ts` defines 11 projects (chromium,
firefox, webkit, Mobile Chrome, Mobile Safari, Tablet, plus five custom
breakpoint projects on Desktop Chrome). When `CI` is set, the project list
is filtered down to exactly `chromium` and `Mobile Chrome` — that's what
CI actually runs. `Mobile Chrome` is Pixel 5 emulation on the chromium
engine, not a separate browser download, so it works with a chromium-only
install. Running the full 11-project matrix locally requires
`npx playwright install` first (firefox and webkit are not installed by
default).

Other npm scripts (from `package.json`):

```bash
npm run test:e2e     # tests/e2e only
npm run test:a11y    # tests/accessibility only
npm run test:headed  # headed browser
npm run test:ui      # interactive UI mode
npm run test:debug   # Playwright Inspector, step-by-step
npm run test:report  # open the last HTML report
```

**These shortcuts carry no port or project overrides**, so on a dev box where
port 3000 is taken or firefox/webkit aren't installed, they fail for the two
reasons above. Add the overrides when you need them, e.g.

```bash
PLAYWRIGHT_PORT=3100 npx playwright test tests/e2e \
  --project=chromium --project="Mobile Chrome"
```

There is no `test:visual` script.

## Email safety — read this before touching `playwright.config.ts`

`playwright.config.ts` forces `webServer.env.RESEND_API_KEY` to an invalid
value (`'e2e-invalid-key-never-send'`) unconditionally, overriding whatever
is in `.env.local`. This exists because `tests/api/contact.spec.ts`
deliberately drives submissions that clear every bot gate (honeypot,
fill-time, validation) to test the endpoint's later behavior, and a real
`RESEND_API_KEY` plus `contactFormRecipients` configured in Sanity has
already caused **real email to be delivered to the owner's inbox — twice**
— before this guard existed.

**Do not remove or weaken this override.** If you need to test real email
delivery, do it manually outside this suite, never by changing
`webServer.env`.

To verify no run sent mail, check the endpoint's success-path log line
never appears:

```bash
grep -c "Email sent successfully" <playwright-output>
# must be 0
```

## Conventions for writing new tests

These are hard-won; breaking them is the most common way to introduce a
flaky or misleading test in this repo.

- **Scope nav locators to one container.** Every nav link exists twice in
  the DOM at once: the mobile `#mobile-menu` panel is always mounted
  (toggled via the `hidden` class, not conditionally rendered, so
  `aria-controls` always resolves) and the desktop list is always mounted
  too. A bare `page.getByRole('link', { name: 'Menus' })` matches both and
  fails Playwright's strict mode. Scope to `desktopNav(page)` or
  `mobileMenu(page)` first — see `tests/e2e/navigation.spec.ts` for the
  pattern.

- **Assert shapes, not CMS content.** Menu items, category names, page
  copy, contact details — all of it is owner-editable in Sanity and can
  change at any time. Tests assert structural/behavioral shape instead:
  "at least one category button renders," "the grid is non-empty,"
  "search narrows the result count." Category filters are located by
  `button[aria-pressed]` rather than by label text, and
  `tests/e2e/pages.spec.ts` sources its `[slug]` test target from
  `/sitemap.xml` at runtime rather than hardcoding a slug. Follow this
  pattern for new content-adjacent tests.

- **No `waitForTimeout`.** The suite has zero uses of it. Use
  condition-based waits (`expect(...).toPass()`, `waitForURL`,
  `toBeVisible`, etc.) instead — a fixed sleep is either too short (flaky)
  or too long (slow) and hides the actual condition you care about.

- **Contact API tests need a unique `X-Forwarded-For` per request.** The
  `/api/contact` rate limiter allows ~3 requests/hour per resolved client
  IP, and every request from a local/CI test run resolves to `'unknown'`
  without an explicit header. `tests/api/contact.spec.ts` sends a
  `X-Forwarded-For` derived from Playwright's own `testInfo.testId` on
  every request so tests never share a rate-limit budget. Any new contact
  API test must do the same or it will get spurious 429s once the suite
  has enough tests in the file.

- **Contact form UI tests must not reach the real endpoint.**
  `tests/e2e/contact.spec.ts` mocks `**/api/contact` via `page.route()`
  for its happy-path test, and its other tests never trigger a submission
  at all. Server-side rejection-path coverage belongs in
  `tests/api/contact.spec.ts`, which is safe to hit directly because every
  case it covers returns before an email send is attempted (the one
  exception, subject-line sanitization, is safe only because of the
  `RESEND_API_KEY` override above).

## CI

`.github/workflows/ci.yml` runs on every PR and on push to `master`: lint,
`format:check`, build, then Playwright (chromium + Mobile Chrome only,
via `npm test` with `CI` set). As of this writing, `format:check` is a
known-red step pending the repo-wide format sweep (T31) and it halts the
job before the build/test steps run — so a currently-red CI run doesn't by
itself mean the test suite is broken; check what step actually failed.

## Historical reference

For the pre-T23 suite (`visual/` directory, `npm run dev`-based workflow,
different helper API), see
[TESTING_GUIDE.md](../docs/archive/TESTING_GUIDE.md) — archived, not
current, kept for history only.
