# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChrisCakes website modernization project transforming a legacy .NET/HTML site into a modern Next.js + Sanity CMS platform. The goal is to enable non-technical restaurant owners to independently manage menu items, prices, images, and content without developer intervention.

**Current Status**: Phase 6 (Remediation) in progress on branch `feat/remediation` — CI, the Playwright test suite, security hardening, and CMS-drift fixes are landing task-by-task. See `IMPLEMENTATION_PLAN.md`'s Phase 6 entry for a summary.

## Repository Structure

```
chriscakes/
├── app/                     # Next.js App Router pages
├── components/              # React components
├── lib/                     # Utilities and Sanity client
├── sanity/                  # Sanity schemas and configuration
├── scripts/                 # One-time content migration scripts (see below)
├── tests/                   # Playwright suite (e2e, accessibility, api)
├── public/                  # Static assets
├── reference/               # Design resources and legacy site archives
│   └── CONTENT_AUDIT.md    # Content inventory from original site
├── user-guides/             # Non-technical user documentation
├── docs/plans/               # Design and implementation plan documents
├── IMPLEMENTATION_PLAN.md   # Detailed roadmap with progress tracking
├── PROJECT_DESCRIPTION.md   # Original project requirements
├── README.md               # Project overview and quick start
├── SETUP.md                # Comprehensive setup and deployment guide
└── CLAUDE.md               # This file
```

**Important**: This is a standard Next.js project structure. All development work occurs in the root directory.

## Development Commands

All commands are run from the repository root:

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (webpack, ~5-7s)
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint (must pass with zero errors)
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without modifying

# Content Management (one-time migration scripts — see note below)
npm run import        # Legacy catalogue import (scripts/import-content.ts)
npm run import:all    # Seed menu categories/items + site settings (scripts/import-all-content.ts)
npm run import:more   # Seed fundraising category/items, FAQs, testimonials (scripts/import-additional-content.ts)

# Testing (Playwright — see note below)
npm test              # Full 11-project matrix (desktop/mobile/tablet x browsers)
npm run test:e2e      # E2E specs only (tests/e2e)
npm run test:a11y     # Accessibility specs only (tests/accessibility)
npm run test:ui       # Playwright UI mode
npm run test:debug    # Playwright debug mode
npm run test:report   # Open the last HTML report
```

**Import scripts are one-time migration tooling, not routine commands.** `import`, `import:all`, and `import:more` all refuse to run without `--yes`, print the target Sanity project and dataset before writing anything, and are safe to re-run against a populated dataset: they use `createIfNotExists` plus a populated-dataset guard, so once real content exists they write nothing and only print a divergence report. `scripts/import-page-content.ts` (no npm alias — run directly with `npx tsx scripts/import-page-content.ts --yes`) follows the same safe pattern for the 8 static content pages.

**Three other scripts are NOT safe to re-run**: `scripts/add-videos-to-pages.ts`, `scripts/update-remaining-pages-with-images.ts`, and `scripts/upload-images-and-update-pages.ts` still call `createOrReplace` on live page documents with no `--yes` guard — running them will silently overwrite owner-edited page content. Read the script before running any of these.

**Local test note**: only Chromium is typically installed on a dev box, so run `npx playwright test --project=chromium --project="Mobile Chrome"` locally rather than the bare `npm test`, which targets all 11 configured projects (including Firefox/WebKit) and will fail if those browsers aren't installed. `playwright.config.ts` forces an invalid `RESEND_API_KEY` for the test server, so no local or CI test run can send real email.

**Build Requirements**: Production builds must complete successfully with zero errors. Linting errors are blocking and must be fixed before committing.

## Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router (not Pages Router)
- **CMS**: Sanity.io (project ID: 0fl6fs6u)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict mode)
- **Deployment**: Vercel
- **Image Optimization**: Next.js Image component + Sanity CDN

### Key Architectural Decisions

1. **App Router Structure**: Uses Next.js App Router (not Pages Router). All pages are in `app/` directory with route folders containing `page.tsx` files.

2. **Server vs Client Components**:
   - Default to Server Components for data fetching (pages, static content)
   - Use Client Components only when necessary (Header with hamburger menu, MenuDisplay with filtering)
   - Always add `'use client'` directive at top of Client Components

3. **Data Fetching Pattern**:
   - Server Components fetch data directly via `client.fetch()` from `lib/sanity.ts`
   - Use GROQ queries defined in `lib/queries.ts`
   - Incremental Static Regeneration (ISR) with 60-second revalidation for all Sanity data
   - Example: `const items = await client.fetch(menuItemsQuery, {}, { next: { revalidate: 60 } })`

4. **Component Organization**:
   - `components/layout/` - Header, Footer (Header is Client Component for mobile menu)
   - `components/menu/` - MenuItem, CategoryFilter, MenuDisplay (last two are Client Components)
   - `components/common/` - Shared utilities (currently minimal)

5. **Image Handling**:
   - Always use Next.js `<Image>` component (never `<img>` tags)
   - Sanity images must be processed through `urlFor()` helper from `lib/sanity.ts`
   - CDN domain `cdn.sanity.io` is configured in `next.config.ts`

6. **Styling Conventions**:
   - Tailwind CSS v4 (uses `@import` syntax in `globals.css`)
   - Brand colors: Crimson red (#dc143c), dark navigation (#2d2d2d)
   - Mobile-first responsive design with hamburger menu at smaller breakpoints

### Content Schema Architecture

Located in `sanity/schemas/`:

- **menuCategory.ts** - Menu categories (Breakfast, Lunch, Dinner, etc.)
  - Fields: title, slug, description, order, image

- **menuItem.ts** - Individual menu items
  - Fields: name, slug, description, price, image, category (reference), available, featured, allergens, order

- **page.ts** - Dynamic pages (About, Services, etc.)
  - Fields: title, slug, sections (array of `textSection` / `twoColumnSection` / `highlightBox` / `ctaSection` / `videoSection`), seo

- **siteSettings.ts** - Global site configuration (singleton)
  - Fields: title, description, phone, email, address, hours, socialMedia, logo

- **testimonial.ts** - Customer testimonials
  - Fields: quote, author, authorTitle, image, featured, order

- **faq.ts** - Frequently asked questions
  - Fields: question, answer, category, order

All schemas use `order` field for manual sorting in Sanity Studio.

## Common Development Patterns

### Adding a New Page

1. Create route folder: `app/new-page/`
2. Create `page.tsx` as Server Component
3. Fetch data if needed using Sanity client
4. Export metadata for SEO
5. Update Header navigation if needed

Example:
```typescript
import { client } from '@/lib/sanity';
import { pageBySlugQuery } from '@/lib/queries';

export const metadata = {
  title: 'Page Title - ChrisCakes',
};

export default async function NewPage() {
  const data = await client.fetch(
    pageBySlugQuery,
    { slug: 'page-slug' },
    { next: { revalidate: 60 } }
  );

  return <div>Page content</div>;
}
```

### Creating a New Component

1. Determine if it needs to be a Client Component (state, events, browser APIs)
2. If Client Component, add `'use client'` at top
3. For Sanity images, import and use `urlFor()` helper
4. For images, always use Next.js `<Image>` with proper width/height
5. Apply Tailwind classes for styling
6. Export TypeScript interfaces for props

### Adding a New Sanity Schema

1. Create schema file in `sanity/schemas/`
2. Define using Sanity schema format
3. Import and add to `schemas/index.ts`
4. Create corresponding GROQ query in `lib/queries.ts`
5. Add TypeScript interface in component that uses the data
6. Studio will automatically update (no restart needed)

## Important Constraints

### TypeScript Rules
- No `any` types - use proper interfaces or `unknown`
- Define interfaces for all Sanity data structures
- Props must be typed explicitly

### React/Next.js Rules
- No `<img>` tags - always use Next.js `<Image>` component
- Escape quotes in JSX text with HTML entities (&quot; &apos; etc.)
- Mark components with interactive features as Client Components
- Server Components cannot use hooks or event handlers

### Build Rules
- All ESLint errors must be fixed (zero tolerance)
- Production builds must complete successfully
- No webpack/build warnings about missing files
- Turbopack is intentionally NOT used (removed from scripts)

### Sanity Rules
- Project ID is public; read from `NEXT_PUBLIC_SANITY_PROJECT_ID` everywhere in code (see Tech Stack above for the current value) — never hardcoded in a `.ts`/`.tsx` file
- API token (`SANITY_API_TOKEN`) is private, used only by the one-time scripts in `scripts/`, and must be in `.env.local` — the app itself (`lib/sanity.ts`) is token-free and never reads it
- Never commit `.env.local` to git
- CORS configuration requires manual authentication
- Dataset is `production` (not `development`)

## Known Issues and Workarounds

1. **CORS Configuration**: Requires manual Sanity authentication that cannot be automated. When deploying to production, must manually add production domain to Sanity CORS settings.

2. **Turbopack**: Intentionally disabled in build scripts (was causing failures). Use standard webpack build.

3. **Mobile Menu**: Header must be a Client Component to manage hamburger menu state. This is by design.

4. **Prettier formatting debt**: `npm run format:check` currently fails against a batch of pre-existing files, tracked for a dedicated repo-wide formatting sweep. This is a known, owner-accepted red CI check (decision recorded 2026-08-12), not a regression — don't fix it piecemeal inside unrelated commits.

## Testing & Deployment

### Pre-deployment Checklist
- CI (`.github/workflows/ci.yml`) must be green on the PR: it runs lint, build, and Playwright (chromium + Mobile Chrome) on every pull request and push to `master`
- Run `npm run build` - must succeed with zero errors
- Run `npm run lint` - must pass with zero errors
- Run `npm run format:check` - has known pre-existing failures (see Known Issues above); don't block on it until the repo-wide format sweep lands
- Test locally with `npm run start` after build
- Verify mobile responsiveness (hamburger menu works)
- Test menu filtering (all/category switching)

### Vercel Deployment
- See `SETUP.md` for comprehensive deployment guide
- Environment variables must be configured in Vercel dashboard
- Must include: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `RESEND_API_KEY` (contact form returns a 500 without it), `RESEND_FROM_EMAIL` (falls back to `onboarding@resend.dev` if unset — fine for testing, not for production)
- `SANITY_API_TOKEN` is **not** needed on Vercel — the deployed app never reads it; it's only used locally by the `scripts/` migration tooling
- Production URL must be added to Sanity CORS settings
- **Root Directory**: Set to `./` (default) in Vercel project settings

## File Locations Reference

- **Sanity Client**: `lib/sanity.ts` - Client configuration and `urlFor()` helper
- **GROQ Queries**: `lib/queries.ts` - All data queries
- **Schemas**: `sanity/schemas/` - Content type definitions
- **Import Scripts**: `scripts/` - Content migration tools
- **Global Styles**: `app/globals.css` - Tailwind imports and custom CSS
- **Next Config**: `next.config.ts` - Build and image optimization config
- **Environment**: `.env.local` (gitignored) - Sanity credentials

## Sanity Studio

Access at `/studio` route in browser. Configured via `app/studio/page.tsx`. Studio embeds directly in Next.js app (not separate deployment).

## Documentation Files

Read these files for context:
- **IMPLEMENTATION_PLAN.md** - Complete project phases and progress
- **reference/CONTENT_AUDIT.md** - Original site content inventory
- **SETUP.md** - Setup instructions and deployment guide
- **README.md** - Project overview and quick start
- **user-guides/** - Non-technical documentation for site managers
