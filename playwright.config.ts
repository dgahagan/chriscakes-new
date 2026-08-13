import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for ChrisCakes website testing
 *
 * Tests cross-browser compatibility, mobile responsiveness, and accessibility.
 *
 * Port: defaults to 3000, override with PLAYWRIGHT_PORT when something else
 * already owns that port on the host. The suite always starts its own server
 * (see `reuseExistingServer` below), so the port must be free.
 */
const PORT = process.env.PLAYWRIGHT_PORT || '3000';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/**
 * The parent environment, minus any undefined values, so it can be handed to
 * webServer.env (which requires defined string values) without dropping PATH
 * and friends that the build needs.
 */
const SAFE_PARENT_ENV: Record<string, string> = Object.fromEntries(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  )
);

export default defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: BASE_URL,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on retry
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers.
  //
  // Only chromium is installed in CI, so CI runs a minimal matrix
  // (chromium + one mobile emulation project). The full cross-browser /
  // breakpoint matrix remains available for local runs.
  projects: (
    [
      // Desktop browsers
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },

      // Mobile viewports
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] },
      },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
      },
      {
        name: 'Tablet',
        use: { ...devices['iPad Pro'] },
      },

      // Custom breakpoint testing
      {
        name: 'Mobile Small (320px)',
        use: {
          ...devices['Desktop Chrome'],
          viewport: { width: 320, height: 568 },
          isMobile: true,
          hasTouch: true,
        },
      },
      {
        name: 'Mobile Medium (375px)',
        use: {
          ...devices['Desktop Chrome'],
          viewport: { width: 375, height: 667 },
          isMobile: true,
          hasTouch: true,
        },
      },
      {
        name: 'Tablet Portrait (768px)',
        use: {
          ...devices['Desktop Chrome'],
          viewport: { width: 768, height: 1024 },
          isMobile: true,
          hasTouch: true,
        },
      },
      {
        name: 'Desktop Small (1024px)',
        use: {
          ...devices['Desktop Chrome'],
          viewport: { width: 1024, height: 768 },
        },
      },
      {
        name: 'Desktop Large (1440px)',
        use: {
          ...devices['Desktop Chrome'],
          viewport: { width: 1440, height: 900 },
        },
      },
    ] satisfies NonNullable<Parameters<typeof defineConfig>[0]['projects']>
  ).filter((project) =>
    process.env.CI ? ['chromium', 'Mobile Chrome'].includes(project.name) : true
  ),

  // Run the production build before starting the tests, since tests must
  // exercise the same build that ships (not `next dev`).
  // Never reuse an already-running server. Reusing one silently tests
  // whatever happens to own the port — a stale build, or an unrelated app —
  // which defeats the point of building first. A busy port now fails loudly
  // instead; set PLAYWRIGHT_PORT to move off it.
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180000,
    // The test server must never be able to deliver mail. tests/api/contact
    // deliberately drives submissions that clear every bot gate, and the
    // real key in .env.local plus contactFormRecipients in Sanity would send
    // those to the owner's actual inbox. Forcing an invalid key here makes
    // the safe behaviour automatic rather than something each run has to
    // remember to prefix — getting this wrong has already delivered real
    // mail twice on this project.
    env: {
      ...SAFE_PARENT_ENV,
      RESEND_API_KEY: 'e2e-invalid-key-never-send',
    },
  },
});
