# ChrisCakes Code Review

**Date:** 2026-07-26
**Scope:** Full project review — frontend (`app/`, `components/`), data/CMS layer (`lib/`, `sanity/`, `scripts/`), security & configuration, testing & tooling
**Method:** Four parallel review passes (frontend, data layer, security, testing), findings verified against source before inclusion, plus baseline build/lint/format checks

---

## Executive Summary

The core architecture is solid: correct App Router usage, a clean server/client component split, parameterized GROQ queries with no injection surface, strict TypeScript with zero `any`, good per-page SEO metadata, and clean secrets hygiene (no credentials ever committed). The production build succeeds and ESLint passes.

However, the project is **not ready for handoff to a non-technical owner**, which is its stated goal. The most serious problems cluster around four themes:

1. **The Playwright test suite is largely broken** — at least six tests fail unconditionally against the real markup, visual baselines don't exist so `npm test` cannot pass, several assertions are vacuous, and there is no CI. The suite appears written against an imagined version of the site.
2. **Schema/query/component drift** — Google Analytics can never load (the query doesn't fetch the field), the contact page reads a social-media shape that no longer exists, and four Studio-configurable features (UGC gallery, review widgets, click-to-tweet, Pinterest boards) are authored in schemas and components but never queried or rendered. The owner can configure things in Studio that silently do nothing.
3. **The import scripts are destructive** — `npm run import:all` (still documented as a current command) overwrites live site settings with a stale schema shape, wiping contact-form recipients and social config, and duplicates the entire menu/FAQ/testimonial catalog on every re-run.
4. **Contact endpoint abuse-resistance and site hardening are weak** — the rate limiter is trivially bypassable and per-lambda, there are no security headers/CSP anywhere, and CMS-sourced embed code is injected unsanitized.

Additionally, the production dependency graph carries **1 critical and 25 high** npm audit findings (mostly via the Sanity Studio toolchain), and a `test-dynamic-page` document is being published as a real page in production builds.

**Baseline checks (run 2026-07-26):**

| Check                  | Result                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| `npm run build`        | ✅ Succeeds — 17 routes                                                      |
| `npm run lint`         | ✅ 0 errors, 2 warnings (unused vars in `tests/helpers/test-utils.ts:75-76`) |
| `npm run format:check` | ❌ 77 files fail Prettier                                                    |
| `npm audit --omit=dev` | ❌ 1 critical, 25 high (Sanity toolchain: `tar`, `ws`, Babel plugin)         |
| CI                     | ❌ None — no `.github/workflows/`, tests never run automatically             |

---

## Critical / High Findings

### H1. Google Analytics is broken four independent ways

- `lib/queries.ts:57-68` + `app/layout.tsx:17-46` — `siteSettingsQuery` never projects the `analytics` field, but the layout reads `settings.analytics.googleAnalyticsId`. **GA never loads, even when configured in Studio.**
- `components/common/GoogleAnalytics.tsx:13` — Uses `useSearchParams()` in the root layout with no `<Suspense>` boundary. Currently masked because GA never loads (see above); the day the query is fixed and the owner enables GA, **static prerendering of every page fails** with Next.js's suspense-bailout error.
- `components/common/GoogleAnalytics.tsx:15-43` — Inline script and `useEffect` both fire `gtag('config')` on initial load (duplicated pageviews), and `page_path: pathname + searchParams.toString()` omits the `?` separator, producing paths like `/menucat=abc`.
- `components/common/GoogleAnalytics.tsx:28,38` — CMS-sourced GA ID is string-interpolated into an inline script; a malicious value from Sanity escapes into arbitrary JS. Validate against `/^G-[A-Z0-9]+$/`.

### H2. Import scripts destroy live content (`scripts/`)

- `scripts/import-all-content.ts:337-343,391`, `scripts/import-content.ts:134-139,168` — Both `createOrReplace` the `siteSettings` document with a **legacy flat `socialMedia` shape** that no longer matches the schema, and omit `contactFormRecipients`, `shareButtons`, `analytics`. Running the documented `npm run import:all` wipes the owner's live settings and breaks contact-form routing, with no guard or confirmation.
- `scripts/import-content.ts:148-160`, `import-all-content.ts:355-381`, `import-additional-content.ts:147-186` — Items created with `client.create()` (no deterministic `_id` / `createIfNotExists`); **every re-run duplicates the entire menu, FAQ, and testimonial catalog.**
- Multiple scripts write `price: null` while `sanity/schemas/menuItem.ts:34` declares `Rule.required().min(0)` — imported "call for pricing" items carry permanent Studio validation errors and can't be republished without a price.

### H3. Test suite fails against the real site (`tests/`)

- `tests/e2e/homepage.spec.ts:29` — Asserts footer contains `/248/`; the real footer shows `989-802-0755` / Clare, MI. **Always fails.**
- `tests/e2e/homepage.spec.ts:19`, `tests/e2e/navigation.spec.ts:15` — Expect a link named "About"; the header labels it "On the Flip Side". **Always fails.**
- `tests/e2e/navigation.spec.ts:10` — `getByRole('link', { name: 'Menu' })` substring-matches multiple header/footer links → strict-mode violation. Same for "Contact".
- `tests/e2e/navigation.spec.ts:59-62` — Asserts `aria-current="page"`, which `Header.tsx` never sets. **Always fails.**
- `tests/e2e/menu.spec.ts:18` — Waits for `article, [role="article"], .menu-item`; none exist (`MenuItemCard` renders plain `div`s). **Always fails.**
- `tests/e2e/menu.spec.ts:49-55,74` — Active-state class checks target `bg-crimson`/`active` (real class is `bg-[#dc143c]`); the "All" button matcher `/^all$/i` can never match "All Categories" → **permanently vacuous test**.
- `tests/visual/screenshots.spec.ts` — **No baseline snapshots exist anywhere**; every `toHaveScreenshot` fails on a fresh checkout, so the default `npm test` is guaranteed red. Full-page screenshots of live Sanity content with no masking means any owner content edit invalidates all baselines anyway.
- `tests/helpers/test-utils.ts:74-81` — `calculateContrastRatio` returns a hardcoded `4.5`; any check built on it can never fail.
- `tests/accessibility/wcag-compliance.spec.ts:80,98` — `document.activeElement` is never null, so both keyboard-navigation assertions are vacuous.
- **Zero coverage for the contact form** — the site's only conversion path (`ContactForm.tsx` + `app/api/contact/route.ts`) has no fill/submit, validation, or API test.
- **No CI** — `playwright.config.ts` has `process.env.CI` branches but no workflow exists to use them.

### H4. Contact API is scriptable and its rate limiting doesn't hold (`app/api/contact/route.ts`)

- Lines 31-34 — Rate-limit key uses the **leftmost** `x-forwarded-for` entry, which is client-supplied on Vercel; a bot rotates fake XFF values to bypass the 3/hour cap and floods the owner's inbox through the Resend account.
- Lines 5-8 — In-memory `Map` rate limiting is per-lambda-instance; concurrent requests hit fresh instances with empty maps. Needs a shared store (Upstash/Vercel KV) to be real.
- No honeypot, CAPTCHA/Turnstile, or origin check anywhere in `ContactForm.tsx` / the route — a single `curl` POST triggers N emails (one per configured recipient).

### H5. Route pages 500 instead of 404 when CMS documents are removed

- `app/services/page.tsx:64-67,142` and `app/fundraising/page.tsx:70-73` — `generateMetadata()` and page bodies dereference `page.seo` / `page.title` / `page.sections` with no null check and no `notFound()` fallback. Deleting or re-slugging the `services` or `fundraising` document in Studio — the exact non-technical-owner scenario this project targets — crashes the route. (`app/[slug]/page.tsx` handles this correctly.)

### H6. Skip-to-content link is invisible when focused

- `components/common/SkipToContent.tsx:5` — Uses undefined classes `focus:bg-crimson-500` / `focus:ring-crimson-600` (no `crimson` palette exists in Tailwind v4 config or `globals.css`; confirmed absent from built CSS). A keyboard user tabbing to it sees white text on a white page — the accessibility feature is effectively broken.

### H7. Production dependency vulnerabilities

- `npm audit --omit=dev`: 40 vulnerabilities including `tar <=7.5.20` (**critical**) and `ws 8.0.0–8.20.1` (high), pulled in mostly via the `sanity`/`next-sanity` Studio toolchain. Next.js itself is patched (15.5.12, covers CVE-2025-66478). Run `npm audit fix` and re-verify the Studio.

---

## Medium Findings

### Content/CMS drift (breaks the "owner edits without a developer" goal)

- `app/contact/page.tsx:135-173` — "Follow Us" block reads `settings.socialMedia.facebook/instagram/twitter`, but the schema defines `socialMedia.platforms[]`. The section always renders an empty heading; 40 lines of dead branch.
- `sanity/schemas/siteSettings.ts:352-583` — `ugcGallery`, `reviewWidgets`, `clickToTweet`, `pinterestBoards` are fully authored in the schema (components exist too) but are **never queried and never rendered**. The owner can configure them in Studio and nothing happens.
- `components/layout/Footer.tsx:120-135` — "How to Book an Event" and "Day of Event Information" both link to `/about`; the header uses the real routes `/how-to-book` and `/day-of-event`.
- `components/layout/Header.tsx:109-118`, `Footer.tsx:150-162` — Phone/email hardcoded in header and footer while the contact page pulls the same data from Sanity; CMS edits won't propagate.
- `app/fundraising/page.tsx:181-187` — Hardcoded `item.name === 'Hot Dog Bash'` check and hardcoded "Call for pricing!"; renaming the item in Sanity silently drops the Coney-sauce upcharge line.
- `app/fundraising/page.tsx:116-133,197` — First text section is extracted as the header subtitle, then `SectionRenderer` renders **all** sections again — the same paragraph appears twice on the page.
- A `test-dynamic-page` Sanity document is live and gets published as a real page (`/test-dynamic-page`) in production builds. Delete it from the dataset.

### Security hardening

- `next.config.ts:3-15` — No security headers anywhere (no `headers()`, `middleware.ts`, or `vercel.json`): missing CSP, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`. The whole site including `/studio` can be iframed.
- `components/common/InstagramFeed.tsx:26`, `UGCGallery.tsx:57` — CMS-sourced `embedCode` injected via `dangerouslySetInnerHTML` with zero sanitization: any Studio account (or leaked write token) achieves persistent stored XSS, with no CSP backstop. Doubly broken: `<script>` tags inserted this way never execute, so a real Instagram embed renders as an unstyled blockquote anyway. Sanitize or allowlist embed hosts — or drop the feature (it's currently unrendered anyway).
- `components/common/SchemaMarkup.tsx:21-27` — JSON-LD injected client-side only (`next/script` with `afterInteractive`), so structured data is absent from initial HTML for non-JS crawlers; and `JSON.stringify` doesn't escape `<`, so CMS text containing `</script>` can break out of the tag (stored-XSS vector). Render inline in the server component and escape `<` as `<`.
- `lib/sanity.ts:10` — The privileged write token is attached to the shared client used for all public reads, and that module is imported (via `MenuItemCard` → `'use client'` `MenuDisplay`) into the client bundle. No leak today (non-`NEXT_PUBLIC` env compiles to `undefined`), but this is one refactor away from shipping the token. Public reads need no token; the unused token-free client in `sanity/lib/` already exists.
- `next.config.ts:8-13` — `remotePatterns` allows all of `cdn.sanity.io` without a `pathname: '/images/<projectId>/**'` scope; anyone can proxy arbitrary Sanity images through your `/_next/image` optimizer.
- No `robots.txt` / `sitemap` in any form — `/studio` and `/api/contact` are crawlable; no sitemap for SEO.

### Data layer

- Singleton not enforced for `siteSettings` (`sanity.config.ts:15` uses default `structureTool()`); Studio users can create multiple settings docs while the query takes `[0]` unordered — edits can appear to "not take effect".
- `lib/sanity.ts:9` — `useCdn: true` stacks CDN TTL on top of 60s ISR; content updates take noticeably longer than 60s to appear. The project's own boilerplate (`sanity/lib/client.ts:9`) says to use `false` with ISR.
- `sanity.config.ts:10` hardcodes project ID `0fl6fs6u` while every other client reads `NEXT_PUBLIC_SANITY_PROJECT_ID`; `check-sanity-social.js:4` hardcodes the **stale** ID `9t9xlmvm`; `CLAUDE.md` documents both IDs in different sections. Standardize on the env var and fix the docs.
- `lib/schema.ts:145-164` — `generateAggregateRatingSchema` depends on a `testimonial.rating` field that doesn't exist in any schema or query (always returns `null`); if added later it would default missing ratings to 5 (fabricated reviews) and emit a non-nested `AggregateRating` Google won't honor.
- `lib/schema.ts:66-75` — Restaurant JSON-LD hardcodes the postal address (ignores `settings.address`) and falls back to `info@chriscakesofmi.com` while imported settings use `chriscakesmi@sbcglobal.net`.

### Frontend

- `components/sections/PortableTextRenderer.tsx:25` — `value.href.startsWith('/')` throws when a link annotation has no `href` (an editor can save a link mark mid-edit) → 500 on any page containing it.
- `components/layout/Header.tsx:60-64` — Hamburger button lacks `aria-expanded`/`aria-controls`; open menu has no Escape-to-close or focus containment.
- Missing `sizes` on all `fill` images (`MenuItemCard.tsx:21-26`, `app/page.tsx:286-317`, `TwoColumnSection.tsx:34-39`), and `TwoColumnSection`/`PortableTextRenderer` call `urlFor(image).url()` with no `.width()` — a 5 MB CMS upload ships at original resolution.
- `app/page.tsx:133-135` — Three sequential `await`s on the highest-traffic page (fetch waterfall); every other page uses `Promise.all`.
- ~1,600 lines of dead components with zero imports: `Button`, `Card`, `Loading`, `ClickToTweet`, `PinButton`, `PinnableImage`, `PinterestBoardWidget`, `ReviewWidgets`, `UGCGallery`, and a second divergent PortableText set in `components/portable-text/`. Plus unused `sanity init` blog boilerplate (`sanity/structure.ts`, `sanity/schemaTypes/`, `sanity/lib/`) containing a competing `client`/`urlFor` with different settings.
- Touch targets: `CategoryFilter` buttons (`px-4 py-2 text-sm`) are ~36px tall, under the 44px the a11y test asserts — the test is arguably catching a real defect.

---

## Low Findings

- `app/api/contact/route.ts:156` — Form values interpolated into the email subject with no newline stripping or length cap; strip `[\r\n]` and cap length.
- `app/api/contact/route.ts:87-104` — No type/length validation; non-string JSON values render as `[object Object]` in emails.
- `lib/queries.ts:14` — `available == true` excludes docs where the field is undefined (API-created/duplicated items silently vanish); `available != false` is tolerant.
- `lib/queries.ts:100-104` — `allPagesQuery` (feeds `generateStaticParams`) lacks `defined(slug.current)`; a slugless page document breaks the build.
- `lib/queries.ts:31,43,116,124` — Four exported queries are never imported; `app/fundraising/page.tsx:61` re-declares a near-duplicate inline with a hardcoded slug (query drift).
- `lib/sanity.ts:8` vs `sanity/env.ts:2` — Two different default `apiVersion`s (`2024-01-01` vs `2025-10-08`).
- `components/menu/MenuDisplay.tsx:68-72` — Missing prices sort as `0`, floating "Call for pricing!" items to the top of "Price (Low to High)".
- `components/menu/CategoryFilter.tsx:22-44` — Active filter conveyed only by color; no `aria-pressed`.
- `components/contact/ContactForm.tsx:453-463` — Submit status div lacks `role="alert"`/`aria-live`; screen-reader users get no feedback.
- `components/sections/VideoSection.tsx:18` — YouTube regex requires `v=` immediately after `?`; `watch?feature=share&v=ID` silently drops the video section.
- Unnecessary `'use client'` on presentational components (`SocialCTA`, `InstagramFeed`, `UGCGallery`).
- `app/page.tsx:243` — Heading hierarchy skips `h2` → `h4`.
- ISR inconsistency: layout fetch has no revalidate option; contact page uses `3600` — both deviate from the documented 60s rule.
- `scripts/import-page-content.ts:148-153` — Per-page errors are swallowed; script exits 0 with "All pages imported successfully!" after partial failure.
- `package.json:49` — `axe-playwright` installed but never imported (specs use `@axe-core/playwright`).
- Pervasive `waitForTimeout` across all test specs instead of condition-based waits (~30s+ dead time per project, masks races).
- 77 files fail `npm run format:check` — the pre-deployment checklist in CLAUDE.md is currently unmet.

---

## Strengths

- **Architecture:** Correct App Router structure; disciplined server/client component split (data fetched server-side, interactivity isolated in `MenuDisplay` with proper `useMemo`); consistent ISR strategy on page routes.
- **Type safety:** Zero `any` types anywhere; explicit prop interfaces throughout; Sanity data defensively optional-chained in most render paths.
- **Query hygiene:** All GROQ queries with dynamic input use bound parameters — no injection surface anywhere.
- **Secrets:** No credentials ever committed (verified against full git history); `.env*` gitignored; token read exclusively from `process.env` and never in the client bundle today.
- **SEO:** Thorough per-page metadata — unique titles/descriptions, OpenGraph, Twitter cards, JSON-LD generation.
- **Accessibility investment:** Real axe/WCAG 2.1 A/AA enforcement in tests (`expect(violations).toEqual([])`), focus-visible outlines, reduced-motion support, and print styles in `globals.css`.
- **Contact route structure:** Server-controlled recipients (never from the request — no open-relay risk), generic error responses with details only in server logs, POST-only.
- **Test infrastructure:** Well-structured `playwright.config.ts` (config-driven baseURL, CI-aware settings, trace/screenshot on failure) and a broad 3-browser + 6-viewport device matrix.

---

## Recommended Priority Order

1. **Fix the test suite against the real markup and commit visual baselines** (or temporarily remove the visual suite from `npm test`) — until this is done, the tests provide negative value: a red suite that trains everyone to ignore it. Add a GitHub Actions workflow.
2. **Fix or fence the import scripts** (H2) — at minimum add a confirmation prompt and switch to `createIfNotExists`/deterministic IDs; today one documented command destroys live content.
3. **Fix the settings drift cluster** (H1, contact-page socialMedia, unrendered features) — decide per feature: wire it up or delete the schema fields so Studio doesn't offer dead knobs.
4. **Harden the contact endpoint** (H4): trusted-IP rate limiting via a shared store, plus a honeypot or Turnstile.
5. **Add security headers/CSP and fix the XSS vectors** (SchemaMarkup escaping, embed-code sanitization, GA ID validation).
6. **Fix the 500-instead-of-404 pages, SkipToContent styling, and PortableText link crash** (H5, H6) — small, high-impact correctness fixes.
7. **Run `npm audit fix`** and re-verify the Studio still works (H7).
8. **Delete dead code** (~1,600 lines of unused components, sanity boilerplate, `test-dynamic-page` document) and run `npm run format` to clear the 77-file Prettier debt.
