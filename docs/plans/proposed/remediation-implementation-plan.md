# ChrisCakes Remediation — Implementation Plan

**Status: READY (2026-07-26)**

Execution plan for `docs/plans/proposed/remediation-plan.md` (the WHAT/WHY). The
Rules of Engagement normally live in `docs/guides/orchestration-playbook.md` —
**that file does not exist in this repo**, so a compact version is inlined below
and is authoritative for this run.

---

## Kickoff

A fresh Opus session should run this with:

```
/run-plan docs/plans/proposed/remediation-implementation-plan.md
```

If `/run-plan` is unavailable, read `docs/plans/proposed/remediation-plan.md`
(the design plan), the **Rules of Engagement** section below, and `CLAUDE.md`,
then execute the task graph in order — spawning a subagent of each task's model,
verifying the gate yourself, and committing after each green task.

**Note:** `run-plan.md` instructs the orchestrator to read
`docs/guides/orchestration-playbook.md`. That file is absent. Skip that step and
use the inlined rules here instead — do not invent a playbook or stall on it.

---

## Rules of Engagement (inlined)

**Verification gate** — the orchestrator runs these itself after every task. A
subagent's self-report is never the gate.

```bash
npm run lint          # ESLint — zero errors (zero tolerance, per CLAUDE.md)
npm run format:check  # Prettier — see amber-window note below
npm run build         # next build (webpack, not Turbopack) — must succeed
npm test              # Playwright — see Phase 6 gate contract below
```

- **One task = one commit.** Use the task's stated conventional commit message.
  No `Co-Authored-By` lines (user's global rule).
- **Never commit red.** On failure, send the diff back to a same-model subagent
  or fix trivia yourself.
- **`opus` tasks: do them yourself**, don't delegate.
- **Tick the Progress Tracker** with the code commit's short SHA, commit that
  separately, and push. The tracker is the resume point for a future session.
- **Stop and ask** on genuine design ambiguity, unmeetable acceptance criteria,
  or a real product bug. A mechanical consequence of an in-scope change (fixing
  an import broken by a deletion) is not new scope — make it, keep green, note
  it in the commit.

### Gate exceptions, stated up front

1. **`npm run format:check` will fail repo-wide from the first commit until
   T31.** The repo carries ~77 files of pre-existing Prettier debt, and the
   design plan deliberately defers the sweep to last so it lands as its own
   reviewable commit. **Until T31, `format:check` is not part of the gate —
   substitute `npx prettier --check <files touched by this task>`.** At T31 the
   full repo-wide check becomes gating and must stay green.

2. **`npm test` is amber across Phase 6 (T23–T26).** The suite is being rebuilt;
   between the infrastructure reset and the final spec rewrite, unrewritten
   specs are expected to fail. **Within Phase 6 the gate is lint + build + the
   spec files that task touched passing.** At **T27** the full `npm test` must
   be green, and it is gating for every task after that. Before Phase 6, `npm
   test` is not gating at all (the suite is known-broken on `master` — that is
   the problem being fixed).

---

## Scope & branch

**Branch:** `feat/remediation` (cut from `master`).

Everything in the design plan is active — Workstreams A through H, covering the
full Critical/High/Medium/Low set from `CODE_REVIEW.md`.

### Deferred / out of scope

| Item | Reason |
|---|---|
| Turnstile, Upstash, or any external anti-spam service | Owner decision — honeypot + hardening only (design plan, Non-Goals) |
| Visual regression testing | Owner decision — `tests/visual/` is deleted, not repaired |
| Visual redesign or new features | Remediation only |
| Hosting/deployment architecture changes | Stays Vercel + embedded Studio |

---

## Prerequisites — ✅ COMPLETE (verified 2026-07-26)

### Scratch Sanity dataset — done

T11 and T21 have acceptance criteria that mutate content ("unpublish the
services document and expect a 404", "run `import:all` twice and expect zero
duplicates"). These **must not** run against `production`.

**`staging` exists and is seeded from production.** Verified counts:

| | production | staging |
|---|---|---|
| pages | 9 | 9 |
| menuItems | 67 | 67 |
| menuCategories | 6 | 6 |
| siteSettings | 1 published + 1 draft | 1 published + 1 draft |

<details>
<summary>Commands used, for reference / re-seeding</summary>

```bash
npx sanity login
npx sanity dataset create staging --visibility public
npx sanity dataset export production ./staging-seed.tar.gz
npx sanity dataset import ./staging-seed.tar.gz staging
rm ./staging-seed.tar.gz
```
</details>

Point a run at it by overriding one env var — no code change needed:

```bash
NEXT_PUBLIC_SANITY_DATASET=staging npm run dev
NEXT_PUBLIC_SANITY_DATASET=staging npm run import:all -- --yes
```

Notes:
- **Never** set `NEXT_PUBLIC_SANITY_DATASET=staging` in Vercel — local override
  only.
- `staging` is a **point-in-time copy**, not a mirror. It will drift from
  production as content is edited. Re-seed if a task needs current content.
- The CLI reads `sanity.cli.ts` for the project ID, so no extra flags are needed.

---

## Corrections to the design plan (verified against the codebase)

The design plan hedged on two points. Both are now settled by inspection:

1. **`ShareButtons.tsx` is NOT unused — it stays.** It is imported by
   `app/menu/page.tsx`, `app/services/page.tsx`, `app/fundraising/page.tsx`, and
   `app/[slug]/page.tsx`. The design plan's "delete `ShareButtons.tsx` if unused"
   resolves to *keep*. Its `next-share` dependency also stays. Only the
   *embedded feed / widget* components are deleted.

2. **`menuCategoriesQuery`'s `order` projection is used** — the query sorts by
   `order asc`, and the field is projected. Drop only `image` (never rendered);
   keep `order`.

Also confirmed dead by grep, with zero importers outside themselves:
`sanity/structure.ts`, `sanity/schemaTypes/*`, `sanity/lib/{client,image,live}.ts`,
`sanity/env.ts`, `check-sanity-social.js`, and the `axe-playwright` package (the
a11y suite imports `@axe-core/playwright`).

---

## Task graph

Model policy: `opus` for orchestration-grade, design-sensitive, and final
integration work; `sonnet` for bulk implementation and test authoring; `haiku`
for mechanical edits and deletions.

`∥` marks a task as **parallel-safe** with the sibling named — its file set is
disjoint from that sibling's.

---

### Phase 0 — Plan housekeeping

#### T0 — Relocate plan docs into `docs/plans/proposed/` · `haiku`

Move the design plan to where `/run-plan`'s graduation step expects it, and get
the currently-untracked remediation artifacts under version control.

**⚠ `DESIGN_PLAN.md` and `CODE_REVIEW.md` are UNTRACKED** (verified 2026-07-26 —
they have never been committed). `git mv` **fails on untracked files**. Use a
plain `mv` followed by `git add`, and do not claim history preservation — there
is no history to preserve.

- **Do:**
  ```bash
  mkdir -p docs/plans/proposed docs/plans/implemented
  mv DESIGN_PLAN.md docs/plans/proposed/remediation-plan.md
  touch docs/plans/implemented/.gitkeep
  git add docs/ CODE_REVIEW.md
  ```
  Then repo-wide grep and fix any reference to `DESIGN_PLAN.md`.
- **Files:** `DESIGN_PLAN.md` → `docs/plans/proposed/remediation-plan.md`;
  `docs/plans/implemented/.gitkeep` (new); `CODE_REVIEW.md` (add to git, stays
  at root); `docs/plans/proposed/remediation-implementation-plan.md` (this file,
  add to git).
- **Accept:** `git ls-files docs/` lists both plans plus the `.gitkeep`;
  `git ls-files CODE_REVIEW.md` is non-empty;
  `grep -rn "DESIGN_PLAN.md" --exclude-dir=node_modules --exclude-dir=.git .`
  returns nothing; build unaffected.
- **Commit:** `docs: track remediation plans under docs/plans/proposed`
- **Deps:** none.
- **✅ DONE — commit `04cf3ab`.** `.claude/commands/` is tracked;
  `.claude/settings.local.json` is gitignored as a machine-local override.
  Branch `feat/remediation` was cut from `master` at `48236c6`.
  **Baseline recorded at T0:** `npm run lint` 0 errors / 2 known warnings
  (`test-utils.ts` unused vars — T23 clears them); `npm run build` green,
  17 static pages. `npm test` is known-red and is Workstream A's subject.

---

### Phase 1 — Data layer foundation (Workstream G)

Runs first: C, E, and B all build on a single client and the corrected schema.

#### T1 — Delete `sanity init` boilerplate and dead components · `haiku` · ∥ T2

Pure deletion. Every target was verified to have zero importers.

- **Files (delete):** `sanity/structure.ts`, `sanity/schemaTypes/` (all 5 files),
  `sanity/lib/{client.ts,image.ts,live.ts}`, `sanity/env.ts`,
  `check-sanity-social.js`, `components/common/Button.tsx`,
  `components/common/Card.tsx`, `components/common/Loading.tsx`,
  `components/portable-text/PortableTextComponents.tsx`.
- **Accept:** `npm run build` green; `npm run lint` green; grep confirms no
  remaining import of any deleted path.
- **Commit:** `chore: delete unused sanity boilerplate and dead components`
- **Deps:** T0.
- **Note:** this deletion removes 3 of the 4 sources of `crimson-*` class names
  (`Button`, `Card`, `Loading`); T12 finishes the sweep.

#### T2 — One Sanity client, token-free, env-driven project ID · `sonnet` · ∥ T1

- **Files:** `lib/sanity.ts`, `sanity.config.ts`, `.env.local.example`.
- **Do:** drop `token` from the app client (public dataset reads need none);
  set `useCdn: false` (correct pairing with ISR — removes stacked-TTL
  staleness); export a shared `apiVersion` constant; `sanity.config.ts` reads
  `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` instead of the
  hardcoded `'0fl6fs6u'` / `'production'`.
- **Accept:** `grep -rn "SANITY_API_TOKEN" app components lib` returns nothing;
  exactly one `createClient` and one `urlFor` remain in app code; `npm run build`
  green; `/studio` loads locally; the contact page and homepage still render
  Sanity data (proves the dataset is public-read without a token).
- **Commit:** `refactor(sanity): consolidate on one token-free client`
- **Deps:** T0.
- **⚠ Verify during execution:** confirm no file under `scripts/` imports
  `@/lib/sanity`. Any that does must construct its own token-bearing client
  locally — the write token must never be reachable from app code.

#### T3 — Query and schema corrections · `sonnet`

- **Files:** `lib/queries.ts`, `sanity/schemas/menuItem.ts`.
- **Do:**
  - `available == true` → `available != false` (tolerant of undefined) in
    `menuItemsQuery`, `menuItemsByCategoryQuery`, `featuredMenuItemsQuery`.
  - `allPagesQuery`: add `defined(slug.current)` and an explicit order.
  - `siteSettingsQuery`: **add the `analytics` projection** (the root cause of
    GA never loading — see cross-task note below).
  - `menuCategoriesQuery`: drop the `image` projection; **keep `order`** (used
    for sorting).
  - Delete never-imported queries, **except** `menuItemsByCategoryQuery`, which
    T8 adopts for the fundraising page.
  - `menuItem.price`: `Rule.required().min(0)` → `Rule.min(0)` — "call for
    pricing" is a legitimate state the frontend already renders.
- **Accept:** every export in `lib/queries.ts` has an importer (verify by grep);
  `npm run build` green; menu page renders; Studio accepts a `menuItem` saved
  with no price.
- **Commit:** `fix(sanity): correct query projections and make price optional`
- **Deps:** T1, T2.

#### T4 — JSON-LD helper cleanup · `sonnet`

- **Files:** `lib/schema.ts`, `app/page.tsx` (import fix only).
- **Do:** `generateRestaurantSchema` reads `address`/`email`/`phone` from
  settings, using the current hardcoded values only as fallbacks; **delete
  `generateAggregateRatingSchema` entirely** (no `rating` field exists on the
  testimonial schema — it can only ever fabricate a rating).
- **Accept:** `npm run build` green; homepage JSON-LD contains the CMS phone and
  email; no `AggregateRating` block is emitted.
- **Commit:** `fix(seo): source restaurant schema from settings, drop fabricated rating`
- **Deps:** T3.
- **⚠ Cross-task:** deleting the export breaks `app/page.tsx:11`. Fix that import
  **in this same commit** — the build is otherwise red.

---

### Phase 2 — Settings & CMS drift (Workstream C)

#### T5 — Delete dead social features · `sonnet`

Every one of these is configurable in Studio and rendered nowhere.

- **Files (delete):** `components/common/UGCGallery.tsx`, `ReviewWidgets.tsx`,
  `ClickToTweet.tsx`, `PinButton.tsx`, `PinnableImage.tsx`,
  `PinterestBoardWidget.tsx`, `InstagramFeed.tsx`.
- **Files (edit):** `sanity/schemas/siteSettings.ts` — remove the `ugcGallery`,
  `reviewWidgets`, `clickToTweet`, and `pinterestBoards` fields, plus
  `socialMedia.instagramWidget` and `shareButtons.pinterestEnabled` (the latter
  drove `PinButton`, now deleted); `app/page.tsx` — remove the `InstagramFeed`
  import and usage.
- **Keep:** `ShareButtons.tsx` and the rest of `shareButtons` — actively used on
  four pages (see Corrections above).
- **Accept:** `npm run build` green; `npm run lint` green; every field remaining
  in `siteSettings.ts` is projected by a query **and** rendered somewhere;
  homepage renders without the Instagram section.
- **Commit:** `feat(cms): remove unrendered social embed features`
- **Deps:** T4.

#### T6 — Google Analytics end-to-end fix · `opus`

Four separate defects that only work as one unit. Design-sensitive (double
pageview / static-prerender interaction) — do this yourself.

- **Files:** `components/common/GoogleAnalytics.tsx`, `app/layout.tsx`.
- **Do:**
  - Wrap `<GoogleAnalytics>` in `<Suspense>` (required — `useSearchParams`
    under static prerendering).
  - Rewrite the component to a single `gtag('config')` source of truth: the
    inline script configs with `send_page_view: false`; the effect sends
    pageviews on route change with a correctly joined `pathname + '?' + qs`
    (omit the `?` when the query string is empty — today it concatenates
    `/menu` + `foo=bar` into `/menufoo=bar`).
  - Validate the CMS-sourced ID against `/^G-[A-Z0-9]+$/` before rendering
    anything.
  - Add explicit `{ next: { revalidate: 60 } }` to the layout's settings fetch.
- **Accept:** with `analytics.enabled` on and a valid ID in Studio, gtag loads
  and exactly **one** pageview fires per navigation (verify in the network
  panel); with a malformed ID, nothing renders; `npm run build` green with no
  `useSearchParams` prerender error.
- **Commit:** `fix(analytics): make Google Analytics actually load and fire once per route`
- **Deps:** T5.
- **⚠ Cross-task:** T3 added the `analytics` projection, so from T3 onward
  `settings.analytics` is populated and the **broken** component becomes
  reachable. It stays inert only because `analytics.enabled` defaults to
  `false`. Do not enable analytics in Studio between T3 and T6.

#### T7 — CMS-driven header/footer + contact page social shape · `sonnet`

- **Files:** `app/layout.tsx`, `components/layout/Header.tsx`,
  `components/layout/Footer.tsx`, `app/contact/page.tsx`.
- **Do:**
  - Layout passes `phone`/`email`/`address` from the settings it already
    fetches down to `Header` and `Footer` as props, replacing the hardcoded
    `989-802-0755` / `chriscakesmi@sbcglobal.net` / `P.O. Box 431 Clare MI`.
  - **Remove `Footer`'s own `siteSettingsQuery` fetch** — it currently
    duplicates the layout's. Footer becomes a props-driven component.
  - Footer quick links: `/about` → the real routes `/how-to-book` and
    `/day-of-event`.
  - Contact page: rewrite the "Follow Us" block against the real
    `socialMedia.platforms[]` array — the current code reads
    `settings.socialMedia.facebook` / `.instagram` / `.twitter`, a flat shape
    that does not exist in the schema, so the block never renders.
  - Contact page `revalidate: 3600` → `60` (project-wide ISR rule).
- **Accept:** editing phone/email in Studio updates header, footer, **and**
  contact page; exactly one `siteSettings` fetch happens per request in the
  layout path; with `socialMedia.platforms` **absent**, all three render cleanly
  with no social block and no crash; after adding one enabled platform in the
  **staging** dataset, the contact page and footer both render its link;
  `npm run build` green.
- **Commit:** `feat(cms): drive header, footer, and contact socials from settings`
- **Deps:** T6 (both touch `app/layout.tsx` — must serialize).
- **⚠ There is no social data to render.** A production query on 2026-07-26
  confirmed `socialMedia.platforms` is **undefined** on `siteSettings` — so the
  footer's icon row has never rendered either, and the "rewrite against the real
  shape" change is currently unobservable. Verify the empty case against
  `production` and the populated case by adding a throwaway platform entry in
  `staging`. Do **not** invent social URLs in `production` to make a test pass.

#### T8 — Fundraising page corrections · `sonnet`

- **Files:** `app/fundraising/page.tsx`.
- **Do:** filter the extracted subtitle section out before passing `sections` to
  `SectionRenderer` (today it renders twice — once as the subtitle, once in the
  section list); delete the hardcoded `item.name === 'Hot Dog Bash'` branch;
  render each item's real `price`, falling back to "Call for pricing!" when
  absent (matching T3's schema change); replace the inline near-duplicate GROQ
  with `menuItemsByCategoryQuery`; add explicit `revalidate` to the
  `siteSettingsQuery` fetch on line 112.
- **Accept:** no section renders twice on `/fundraising`; an item with a price
  shows it; an item without shows "Call for pricing!"; no menu item name is
  hardcoded in the component; `npm run build` green.
- **Commit:** `fix(fundraising): stop duplicating sections and hardcoding item names`
- **Deps:** T5.

#### T9 — `siteSettings` singleton enforcement in Studio · `sonnet`

- **Files:** `sanity.config.ts` (custom `structureTool` resolver).
- **Do:** pin Site Settings to the document ID **`siteSettings`** and remove the
  type from the "create new" list.
- **The canonical ID is confirmed.** A production query on 2026-07-26 returned
  exactly two documents — `siteSettings` (published) and `drafts.siteSettings`
  (its unpublished draft, with identical field values in the sampled fields).
  That is the normal published/draft pair, **not** two competing settings
  documents. Pin to `siteSettings`; the draft follows automatically.
- **Accept:** Studio shows exactly one Site Settings entry, opening document
  `siteSettings` directly; no UI path creates a second one; the site renders the
  same settings values before and after (pinning must not silently switch which
  document is live); `npm run build` green; `/studio` loads.
- **Commit:** `feat(studio): enforce siteSettings as a singleton`
- **Deps:** T2 (both touch `sanity.config.ts`).

#### T10 — Delete the `test-dynamic-page` document · `opus`

**⚠ Mutates the production Sanity dataset. Already confirmed by the owner
(2026-07-26) — delete it. Do not stop to re-ask.**

- **Files:** `scripts/delete-test-document.ts` (new, one-off) — or perform the
  deletion manually in Studio and commit nothing.
- **Do:** delete the leftover fixture from `production`. **Target confirmed
  2026-07-26** — exactly one match, `_id: abe5021f-0a3a-4b99-b3b3-797895b6c756`,
  title "Test Dynamic Page". Re-run the query to confirm the ID still matches
  one document before deleting, and delete its `drafts.` counterpart if one
  exists.
- **Accept:** `*[_type == "page" && slug.current == "test-dynamic-page"]`
  returns empty; `count(*[_type=="page"])` drops from 9 to 8 and no other
  document is affected; `/test-dynamic-page` returns 404 (which requires T11's
  `notFound()` handling to be in place for a clean result).
- **Commit:** `chore(content): remove leftover test-dynamic-page document`
- **Deps:** T9.

---

### Phase 3 — Frontend correctness & accessibility (Workstream F)

#### T11 — Missing-document resilience + branded 404 · `sonnet`

- **Files:** `app/services/page.tsx`, `app/fundraising/page.tsx`,
  `app/not-found.tsx` (new).
- **Do:** both pages currently 500 when their CMS document is missing —
  `getPageData()` returns `null` and `page.seo` / `page.title` throw. Adopt the
  `app/[slug]/page.tsx` pattern: null-check and call `notFound()`, in **both**
  `generateMetadata` **and** the page body. Add a branded `not-found.tsx`.
- **Accept:** unpublishing the `services` document in a scratch dataset yields a
  styled 404, not a 500; the same for `fundraising`; an unknown `[slug]` renders
  the branded 404; `npm run build` green.
- **Commit:** `fix(pages): return 404 instead of 500 when a CMS document is missing`
- **Deps:** T8 (both touch `app/fundraising/page.tsx`).

#### T12 — Nonexistent-palette class sweep · `haiku` · ∥ T13

Tailwind has no `crimson-*` scale — every one of these classes is a no-op, which
is why the skip link is invisible on focus.

- **Files:** `components/common/SkipToContent.tsx`, `components/menu/MenuDisplay.tsx`.
- **Do:** replace `crimson-*` with the real brand values (`#dc143c` and a darker
  ring), e.g. `focus:bg-[#dc143c]`.
- **Accept:** `grep -rn "crimson-" app components lib` returns **zero** hits
  (T1 removed the other three sources); pressing Tab on any page shows a visible
  red skip link; the menu search input shows a visible focus ring.
- **Commit:** `fix(a11y): replace nonexistent crimson-* classes with real values`
- **Deps:** T11.

#### T13 — Interactive-component accessibility · `sonnet` · ∥ T12

The Phase-5 tests were asserting these and failing — the tests were right, the
markup was wrong.

- **Files:** `components/layout/Header.tsx`, `components/menu/CategoryFilter.tsx`,
  `components/contact/ContactForm.tsx`.
- **Do:**
  - Header: `aria-expanded` + `aria-controls` on the hamburger; Escape closes
    the menu; focus returns to the button on close; `aria-current="page"` on the
    active nav link (via `usePathname` — Header is already a Client Component).
    A full focus trap is deliberately out of scope for a nav panel.
  - CategoryFilter: `aria-pressed` on every filter button; touch targets ≥44px
    (currently `px-4 py-2` ≈ 36px tall — a real WCAG 2.5.5 defect).
  - ContactForm: `role="status"` / `aria-live="polite"` on the result message,
    and move focus to it on completion.
- **Accept:** axe reports no new violations; the hamburger's `aria-expanded`
  tracks state; Escape closes the mobile menu and returns focus; every category
  button measures ≥44×44px; the submit result is announced.
- **Commit:** `fix(a11y): add aria state and touch targets to interactive components`
- **Deps:** T11.

#### T14 — Rendering correctness and image sizing · `sonnet`

- **Files:** `components/sections/PortableTextRenderer.tsx`,
  `components/sections/VideoSection.tsx`,
  `components/sections/TwoColumnSection.tsx`,
  `components/menu/MenuItemCard.tsx`.
- **Do:**
  - PortableText link mark: guard `if (!value?.href) return children` — a link
    annotation saved without a URL currently crashes the page. Fix the
    external-link detection to match.
  - VideoSection: replace the positional regex with `URL` + `searchParams`
    parsing so `watch?feature=share&v=ID` resolves.
  - Cap image widths: `urlFor(...).width(1200).url()` in `TwoColumnSection` and
    `PortableTextRenderer`.
  - Add a `sizes` prop to every `fill` image (`MenuItemCard.tsx:24` and any
    others found).
  - Add `data-testid="menu-item"` to `MenuItemCard` — the stable hook T25's
    tests need.
- **Accept:** a link mark with no href renders its text without crashing; a
  `?feature=share&v=` YouTube URL embeds correctly; no `fill` image lacks
  `sizes`; `npm run build` emits no image warnings.
- **Commit:** `fix(components): guard portable text links, parse video URLs, size images`
- **Deps:** T13.

#### T15 — Data-fetch, sort, and directive cleanup · `sonnet`

- **Files:** `app/page.tsx`, `components/menu/MenuDisplay.tsx`,
  `components/common/SocialCTA.tsx`, plus any remaining fetch missing
  `revalidate`.
- **Do:**
  - Homepage: convert the three sequential `await`s (`getMenuItems`,
    `getTestimonials`, `getSiteSettings`) to a single `Promise.all` — they are
    independent and currently waterfall; fix the `h2` → `h4` heading skip.
  - MenuDisplay: "Price (Low to High)" currently coerces a missing price to `0`,
    sorting call-for-pricing items to the **top**. Sort them to the **end** in
    both directions.
  - Remove the unnecessary `'use client'` from `SocialCTA`.
  - Sweep every remaining Sanity fetch for an explicit
    `{ next: { revalidate: 60 } }`.
- **Accept:** homepage issues its three Sanity fetches concurrently; heading
  order is `h1 → h2 → h3` with no skip; an item with no price sorts last under
  "Price (Low to High)"; `grep -rn "client.fetch" app components` shows every
  call passing `revalidate`.
- **Commit:** `perf(frontend): parallelize homepage fetches and fix sort and ISR gaps`
- **Deps:** T12, T14 (touches `MenuDisplay.tsx` after T12 and `app/page.tsx`
  after T5).

---

### Phase 4 — Endpoint & security hardening (Workstreams D + E)

**Ordering deviation, deliberate:** the design plan's graph puts E before F. This
plan moves the **CSP/header task (T20) to the end of this phase** instead,
because the inline-script surface CSP must permit is not final until GA (T6) and
SchemaMarkup (T17) have both landed. Writing CSP earlier guarantees a rewrite.

#### T16 — Contact endpoint hardening · `opus`

Design-sensitive: the silent-success semantics are the whole point (a bot that
learns it was caught adapts), and the timing gate must not punish slow humans.

- **Files:** `app/api/contact/route.ts`, `components/contact/ContactForm.tsx`.
- **Do:**
  - **Honeypot:** a visually-hidden `website` field (CSS-hidden, `tabIndex={-1}`,
    `autoComplete="off"`, `aria-hidden`). Non-empty ⇒ reject, but **return the
    normal 200 success response** and send no email.
  - **Minimum fill time — opaque, client-stamped** (owner decision, 2026-07-26):
    the form records `Date.now()` on mount and submits it as a hidden field; the
    server rejects anything under ~3s elapsed with the same silent-success
    response. Treat a missing, non-numeric, `NaN`, or future-dated value as a
    rejection too. **No new secret and no token endpoint** — a server-signed
    stamp cannot work here, because the contact page is ISR-cached at
    `revalidate: 60`, so a stamp baked into the HTML would be shared across
    every visitor in the window and already stale on arrival. This gate is
    forgeable by design; it exists to catch bots that POST the endpoint without
    ever rendering the form. The honeypot remains the primary gate.
  - **Trusted IP:** use `x-vercel-forwarded-for` / the **rightmost**
    `x-forwarded-for` entry — the current code takes the leftmost, which is
    fully client-controlled and therefore trivially spoofed. Keep the in-memory
    limiter as documented best-effort defense-in-depth, with a max-size cap and
    periodic pruning so the `Map` cannot grow unbounded.
  - **Input validation:** every field type-checked as a string, trimmed, and
    length-capped (name ≤100, email ≤254 + regex, message ≤5000); strip
    `[\r\n]` from anything interpolated into the subject line (currently
    `body.contactName` and `body.eventStartDate` go in raw — a header-injection
    vector); coerce booleans explicitly; reject payloads over a total size cap.
  - **Same-origin check:** verify `origin`/`referer` host against the deployment
    host **when present**; absent headers are allowed (honeypot + timing are the
    primary gate).
- **Accept:** a `curl` POST with instant timing or a filled honeypot sends **no**
  email but receives a success response; normal form use is unaffected; a
  `contactName` containing `\r\nBcc:` arrives as one sanitized subject line;
  oversized and wrong-typed fields are rejected; **no new environment variable
  is introduced** (verify `.env.local.example` is unchanged).
- **Commit:** `feat(security): harden contact endpoint with honeypot and validation`
- **Deps:** T13 (both touch `ContactForm.tsx`), T2.
- **⚠ Watch for a false positive:** the 3s floor must be measured from form
  *mount*, not from page load, and must not fire for someone using a password
  manager or autofill to complete the form quickly. If T26's tests show a
  legitimate fast path tripping it, lower the floor rather than removing the
  honeypot.

#### T17 — JSON-LD server rendering and XSS fix · `sonnet`

- **Files:** `components/common/SchemaMarkup.tsx`.
- **Do:** the component uses `next/script` with `strategy="afterInteractive"`, so
  structured data is absent from the initial HTML that crawlers read — the SEO
  value is zero. Render inline in the server component via
  `<script type="application/ld+json">` with
  `JSON.stringify(data).replace(/</g, '\\u003c')`, which is both present at
  first paint and escape-proof against CMS content containing `</script>`.
- **Accept:** `curl http://localhost:3000 | grep 'application/ld+json'` shows the
  full payload; a page title containing `</script><script>` renders escaped and
  executes nothing; `npm run build` green.
- **Commit:** `fix(seo): render JSON-LD server-side with escaped output`
- **Deps:** T16.

#### T18 — robots + sitemap · `sonnet` · ∥ T19

- **Files:** `app/robots.ts` (new), `app/sitemap.ts` (new).
- **Do:** `robots.ts` disallows `/studio` and `/api/`; `sitemap.ts` emits the
  static routes plus every published `[slug]` page from Sanity (reuse
  `allPagesQuery`, which T3 made slug-safe and ordered).
- **Accept:** `/robots.txt` and `/sitemap.xml` both serve; the sitemap lists
  every published page and no drafts; `npm run build` green.
- **Commit:** `feat(seo): add robots.txt and dynamic sitemap`
- **Deps:** T17.

#### T19 — Dependency vulnerability remediation · `sonnet` · ∥ T18

Baseline as of 2026-07-26: **42 vulnerabilities (1 critical, 26 high, 13
moderate, 2 low)**; 40 of them in the production tree.

- **Files:** `package.json`, `package-lock.json`.
- **Do:** run `npm audit fix` (non-breaking only). For anything remaining,
  evaluate `sanity` / `next-sanity` minor upgrades. Also **remove the unused
  `axe-playwright` dependency** — the a11y suite imports `@axe-core/playwright`,
  which is a different package and stays.
- **Accept:** `npm audit --omit=dev` shows no critical/high, **or** each
  residual is documented in the commit body with why it is unfixable and what
  the exposure is; `npm run build` green; **`/studio` loads and saves a
  document** (Sanity is the fragile dependency here — smoke-test it manually
  before committing).
- **Commit:** `chore(deps): resolve audit advisories and drop unused axe-playwright`
- **Deps:** T17.
- **⚠ Cross-task:** if a bump changes Sanity's structure API, T9's singleton
  resolver may need adjusting. Verify it still works as part of the Studio
  smoke test. Roll back individual bumps that break Studio and document them.

#### T20 — Security headers and CSP · `opus`

The riskiest task in the plan — CSP breaks silently and Studio is the fragile
consumer. Do this yourself, verify interactively, and be willing to scope down.

- **Files:** `next.config.ts`.
- **Do:**
  - `headers()`: `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`
    (Studio runs same-origin, so DENY should be safe — verify, and carve out
    `/studio` only if it actually breaks).
  - A real CSP (not Report-Only): `default-src 'self'`, plus `cdn.sanity.io`
    (img), Google Analytics hosts (script/connect), YouTube (frame, for
    `VideoSection`), and whatever inline-script allowance Next.js requires.
    Scope a relaxed policy to `/studio` by path if needed.
  - Scope `images.remotePatterns` to `pathname: '/images/<projectId>/**'`,
    sourcing the project ID from the env var at config time so it cannot drift.
- **Accept:** every header present on all routes (verify with `curl -I`); **every
  page renders and every interaction works with CSP active** — homepage, menu
  filtering/search/sort/print, contact form submit, a page with a YouTube embed,
  and `/studio` (load, edit, save); zero CSP violations in the browser console;
  Sanity images still load.
- **Commit:** `feat(security): add security headers, CSP, and scoped image patterns`
- **Deps:** T6, T17, T18, T19 — needs the final script/frame surface.

---

### Phase 5 — Import script safety (Workstream B)

Independent of A/C/D/F; scheduled here so it lands before the tests are written.

#### T21 — Defang the import scripts · `sonnet`

These are **one-time migration tools**, not routine commands — the content is
already live. The goal is to make them harmless, not perfect.

- **Files:** `scripts/import-all-content.ts`, `scripts/import-content.ts`.
- **Do:**
  - Update the `siteSettings` payloads to the **current** schema shape
    (`socialMedia.platforms[]`, include `contactFormRecipients`) and switch
    `createOrReplace` → `createIfNotExists` so a live document is never
    overwritten. Today `npm run import:all` destroys real site settings.
  - Switch every `client.create()` to a deterministic `_id`
    (e.g. `menuItem-<slug>`) with `createIfNotExists`, so re-runs are no-ops
    instead of duplicating the whole catalog.
  - Stop writing `price: null` — omit the field (T3 made it optional).
  - Add a top-of-script guard: refuse to run without `--yes`, and print the
    target project and dataset **before** writing anything.
- **Accept:** running `import:all` twice against a **scratch dataset** produces
  zero duplicates and leaves a pre-existing `siteSettings` document byte-identical;
  running without `--yes` aborts with a clear message and writes nothing.
- **Commit:** `fix(scripts): make content imports idempotent and non-destructive`
- **Deps:** T3.
- **✅ The `staging` dataset exists and is seeded** (verified 2026-07-26). Run
  acceptance there: `NEXT_PUBLIC_SANITY_DATASET=staging npm run import:all -- --yes`,
  twice. Baseline before the first run is 9 pages / 67 menu items / 6 categories
  / 1 published `siteSettings`; all four counts must be **unchanged** after both
  runs. **Never** point this script at `production`.

#### T22 — Fix swallowed import errors · `haiku`

- **Files:** `scripts/import-page-content.ts`.
- **Do:** the script catches per-page errors and still reports success. Track
  failures, report them accurately, and `process.exit(1)` when any occurred.
- **Accept:** a forced failure on one page produces a non-zero exit and names the
  failed page; an all-success run exits 0.
- **Commit:** `fix(scripts): report and exit non-zero on page import failures`
- **Deps:** T21.

---

### Phase 6 — Test suite rebuild and CI (Workstream A)

Tests are written against the **fixed** site, which is why this phase runs last.
Re-read the **amber-window gate contract** in the Rules of Engagement before
starting: `npm test` is not fully gating until T27.

#### T23 — Test infrastructure reset · `sonnet`

- **Files:** delete `tests/visual/`; edit `package.json` (drop `test:visual`),
  `playwright.config.ts`, `tests/helpers/test-utils.ts`.
- **Do:**
  - Delete the visual regression suite entirely (owner decision — baselines
    never existed).
  - `playwright.config.ts`: `webServer.command` becomes `npm run build && npm run start`
    (tests must run against the production build, not `next dev`); in CI, run
    **chromium + one mobile project only**; the full 11-project matrix stays
    available locally.
  - `test-utils.ts`: delete `calculateContrastRatio` (a hand-rolled
    reimplementation of what axe already checks) and the unused helpers
    (`checkConsoleErrors`, `isInViewport`, and anything else with no surviving
    caller). Keep and repair only what the rewritten specs will use. This also
    clears the 2 outstanding ESLint unused-var warnings.
- **Accept:** `tests/visual/` gone; `npm run test:visual` no longer exists;
  `npm run lint` reports **zero warnings**; `npx playwright test --list` runs
  without import errors.
- **Commit:** `test: reset playwright infrastructure and drop visual suite`
- **Deps:** T20, T22.

#### T24 — Rewrite navigation and homepage specs · `sonnet`

- **Files:** `tests/e2e/navigation.spec.ts`, `tests/e2e/homepage.spec.ts`.
- **Do:** target the **real** nav link names (`On the Flip Side`, `Menus`,
  `Contact Us`) with `exact: true` or navigation-scoped locators to avoid
  strict-mode multi-matches; assert **structure over values** — a `tel:` link
  exists, rather than the literal `989-802-0755`, so owner edits in the CMS do
  not break tests; restrict full click-through to desktop projects and give
  mobile a dedicated hamburger-menu flow test (open, navigate, close, Escape,
  focus return — the behavior T13 added); assert `aria-current="page"` on the
  active link; **zero `waitForTimeout`** — condition-based waits only.
- **Accept:** both specs green on chromium **and** a mobile project; no
  `waitForTimeout` in either file; no assertion depends on CMS-editable text.
- **Commit:** `test: rewrite navigation and homepage specs against real markup`
- **Deps:** T23.

#### T25 — Rewrite menu spec and add page smoke tests · `sonnet`

- **Files:** `tests/e2e/menu.spec.ts`, `tests/e2e/pages.spec.ts` (new).
- **Do:** menu spec targets `data-testid="menu-item"` (added in T14) and
  `aria-pressed` on filters (T13); cover **search, sort, and the print button**
  — currently untested; assert shapes ("at least one category button", "the menu
  grid renders"), never item counts or specific category names. New `pages.spec.ts`
  covers `/fundraising`, a `[slug]` page whose slug is **fetched dynamically**
  from the first published page rather than hardcoded, and an unknown slug
  returning 404 (depends on T11).
- **Accept:** all specs green; passing with a scratch dataset containing
  different content than production proves content-tolerance; unknown slug
  asserts a 404 status, not just absent text.
- **Commit:** `test: rewrite menu spec and add page smoke coverage`
- **Deps:** T24.

#### T26 — Contact form and API coverage · `sonnet`

The largest gap in the current suite — the contact form has **zero** coverage.

- **Files:** `tests/e2e/contact.spec.ts` (new), `tests/api/contact.spec.ts` (new).
- **Do:**
  - E2E: fill/submit happy path with the API mocked via `page.route()`;
    client-side validation errors; the honeypot field is present **and**
    hidden from both sighted users and the tab order.
  - API-level, using `request` fixtures with Resend mocked or absent: validation
    rejections, honeypot rejection **returning 200 with no email sent**, the
    sub-3s timing rejection, non-POST method restriction, and subject-line
    newline sanitization.
- **Accept:** every rejection path from T16 has a test; the honeypot test
  asserts a 200 response *and* that no send occurred; specs green.
- **Commit:** `test: add contact form and API endpoint coverage`
- **Deps:** T25.

#### T27 — Accessibility spec rewrite and full-suite green · `opus`

Final integration — the point where the whole suite must actually pass.

- **Files:** `tests/accessibility/wcag-compliance.spec.ts`.
- **Do:** drop the hand-rolled contrast check (axe covers it); replace
  `activeElement` truthiness assertions — which pass on `<body>` and therefore
  prove nothing — with assertions that focus moved to a **specific** element;
  keep the touch-target check at 44px (T13 fixed the markup rather than
  weakening the test); rewrite the console-error test to register its listener
  **before** navigation, or delete it.
- **Accept:** **`npm test` fully green on a fresh checkout against the production
  build** — this is the phase's real gate; `grep -rn "waitForTimeout" tests`
  returns nothing; no test references CMS-editable literal content.
- **Commit:** `test: rewrite accessibility spec and restore a green suite`
- **Deps:** T26.
- **Note:** from this task onward, `npm test` is gating for every remaining task.

#### T28 — CI workflow · `sonnet`

- **Files:** `.github/workflows/ci.yml` (new).
- **Do:** run on PR and push to `master`: install → `lint` → `format:check` →
  `build` → Playwright (chromium + one mobile project). Cache npm and Playwright
  browsers. Tests run against `next build && next start`.
- **Accept:** the workflow passes on a real PR from this branch; total runtime is
  reasonable (the browser cache is doing its job); a deliberately introduced
  lint error fails the run.
- **Commit:** `ci: add lint, build, and playwright workflow`
- **Deps:** T27.
- **⚠ Note:** `format:check` in CI will fail until **T31** (the format sweep)
  lands. Either hold the PR open until T31, or expect that one red check and
  clear it at T31 — state which in the commit body.

---

### Phase 7 — Hygiene (Workstream H)

#### T29 — Documentation update · `sonnet`

- **Files:** `CLAUDE.md`, `IMPLEMENTATION_PLAN.md`, `SETUP.md`.
- **Do:**
  - `CLAUDE.md`: correct the project ID to **`0fl6fs6u` in exactly one place**
    (line 187 currently documents the stale `9t9xlmvm`); reframe `import:all` as
    a one-time migration that is now safe to re-run and will not touch existing
    documents; remove the deleted social features; update the test commands
    (`test:visual` is gone); add CI to the pre-deployment checklist.
  - `IMPLEMENTATION_PLAN.md`: add a "Phase 6: Remediation" entry recording this
    work.
  - `SETUP.md`: same import-script reframing.
- **Accept:** `grep -rln "9t9xlmvm" --exclude-dir=node_modules --exclude-dir=.git .`
  returns **only** `CODE_REVIEW.md` and `docs/plans/proposed/remediation-plan.md`,
  which quote the stale ID deliberately as the defect being fixed — no live doc
  or source file carries it; `CLAUDE.md` presents `import:all` as a one-time
  migration; the test-command list no longer mentions `test:visual`; the
  pre-deployment checklist names CI.
- **Commit:** `docs: update project docs for remediation changes`
- **Deps:** T28.
- **Note:** the four superseded docs still reference deleted features at this
  point — that is expected. T30 archives them; do not try to fix them here.

#### T30 — Archive superseded documentation · `haiku`

Four root-level docs describe features and a test suite this work deletes.
Leaving them in place would mislead the next reader worse than deleting them —
archive rather than delete, so the history of *why* those features existed
stays reachable.

- **Files (move via `git mv` into `docs/archive/`):**
  - `SOCIAL_MEDIA_INTEGRATION.md` (54KB — documents the UGC gallery, review
    widgets, click-to-tweet, and Pinterest boards deleted in T5)
  - `SOCIAL_MEDIA_STATUS.md` (status of the same deleted features)
  - `PHASE5_TESTING_SUMMARY.md` (describes the visual suite deleted in T23)
  - `TESTING_GUIDE.md` (documents the pre-rewrite suite and `test:visual`)
- **Do:** create `docs/archive/`; `git mv` each file in (history preserved);
  add `docs/archive/README.md` naming each file, the date archived
  (2026-07-26), and one line on what superseded it. Then repo-wide grep for
  references to the old paths and update them — `README.md` and `CLAUDE.md` are
  the likely referrers.
- **Accept:** all four files live under `docs/archive/` with history intact
  (`git log --follow`); `grep -rn "SOCIAL_MEDIA_INTEGRATION\|SOCIAL_MEDIA_STATUS\|PHASE5_TESTING_SUMMARY\|TESTING_GUIDE" --exclude-dir=node_modules --exclude-dir=docs .`
  returns nothing; the gate is green (these are docs — the build is unaffected).
- **Commit:** `docs: archive documentation superseded by remediation`
- **Deps:** T29.
- **Note:** `CODE_REVIEW.md` stays at the repo root — it is the live input to
  the design plan, not superseded by it.

#### T31 — Repo-wide format sweep · `haiku`

Deliberately last-but-one and **strictly its own commit** — mixing a 77-file
reformat with logic changes destroys reviewability. Runs after T30 so the
archived docs are formatted in place too (or excluded via `.prettierignore` —
whichever keeps the diff honest).

- **Files:** whatever `npm run format` touches. **No hand edits.**
- **Do:** run `npm run format`. Nothing else.
- **Accept:** `npm run format:check` green **repo-wide** (it becomes gating from
  here on); `npm run lint` green with zero warnings; `npm run build` green;
  `npm test` green; `git show --stat` shows formatting-only changes.
- **Commit:** `style: apply prettier formatting across the repo`
- **Deps:** T30.

#### T32 — Graduate the plan documents · `opus`

- **Files:** `docs/plans/proposed/remediation-plan.md` and
  `docs/plans/proposed/remediation-implementation-plan.md` → `docs/plans/implemented/`.
- **Do:** mark the design plan `Status: IMPLEMENTED (<date>)`; `git mv` both
  files; fix any reference to their old paths (repo-wide grep).
- **Accept:** both files live under `docs/plans/implemented/`; no dangling path
  reference; the full gate is green; report status and propose next steps (open
  a PR — **confirm with the human before merging to `master`**).
- **Commit:** `docs: graduate remediation plans to implemented`
- **Deps:** T31.

---

## Cross-task consequences the orchestrator must reconcile

1. **T3 arms a broken component.** Adding the `analytics` projection makes
   `settings.analytics` populated, so the defective `GoogleAnalytics` component
   becomes reachable — inert only because `analytics.enabled` defaults to
   `false`. **Do not enable analytics in Studio between T3 and T6.**
2. **Deletions break imports in the same breath.** T4 (`generateAggregateRatingSchema`)
   and T5 (`InstagramFeed`) both remove things `app/page.tsx` imports. Each must
   fix that import in its own commit or the build is red.
3. **`app/page.tsx` is touched by three tasks** (T4, T5, T15) and
   `app/layout.tsx` by two (T6, T7). These are serialized on purpose — none of
   those pairs is parallel-safe.
4. **T2 removes the token from the app client.** This is only safe if the
   dataset is public-read. The contact API route (`app/api/contact/route.ts`)
   reads `siteSettings` through that client — verify it still resolves before
   committing.
5. **T3's optional `price` unblocks T21** (the import scripts currently write
   `price: null` against a required field) and requires `MenuItemCard` /
   `MenuDisplay` to handle `undefined` — T15 covers the sort side.
6. **CSP (T20) is scheduled after GA (T6) and SchemaMarkup (T17)** because both
   determine the inline-script surface the policy must allow. This inverts the
   design plan's E-before-F edge, deliberately.
7. **`npm audit fix` (T19) may move Sanity**, which can disturb T9's custom
   structure resolver. The Studio smoke test in T19's acceptance must include
   opening the Site Settings singleton.
8. **T23 switches Playwright to a production build**, so every subsequent local
   test run pays a full `next build`. Expect noticeably slower iteration from
   Phase 6 onward.
9. **T13's a11y markup is what T24–T26 assert.** If T13 lands with different
   attribute names than planned, the test tasks must follow the markup, not the
   plan text.
10. **CI (T28) runs `format:check`, which is red until T31.** Hold the PR or
    accept one red check; state the choice in T28's commit body.
11. **The `staging` dataset is a full copy of production as of 2026-07-26**
    (9 pages, 67 menu items, 6 categories). It does **not** track later
    production edits. T10 deletes `test-dynamic-page` from production only —
    `staging` keeps its copy, so a `staging` run will still see 9 pages. Do not
    treat that divergence as a failure.

---

## Owner decisions (settled 2026-07-26)

| Question | Decision | Where it landed |
|---|---|---|
| Delete `test-dynamic-page` from production? | **Yes — delete it.** No mid-run confirmation needed. | T10 |
| Scratch Sanity dataset available? | **Created and seeded** — `staging`, verified 2026-07-26. | Prerequisites; T11, T21 |
| T16 fill-time stamp: signed or opaque? | **Opaque, client-stamped.** No new secret, no token endpoint; ISR stays intact. Forgeable by design — the honeypot is the primary gate. | T16 |
| Fate of the four superseded docs? | **Archive** into `docs/archive/`, not delete. | T30 |
| Missing `docs/guides/orchestration-playbook.md`? | **Inline the rules** in this plan. | Rules of Engagement |

### Still worth knowing at kickoff

- **`/run-plan` will try to read `docs/guides/orchestration-playbook.md` and
  fail** — the file genuinely does not exist. The Kickoff section tells it to
  skip that step and use the inlined rules. You may need to say so directly if
  it stalls.
- **`socialMedia.platforms` is undefined in production.** The footer's social
  icon row has therefore never rendered, and T7's contact-page rewrite is
  unobservable until someone adds a platform in Studio. Verify the empty case
  against production, the populated case in `staging`. See T7.
- **`DESIGN_PLAN.md` and `CODE_REVIEW.md` are untracked** — T0 uses `mv` +
  `git add`, not `git mv`. `.claude/` is untracked too; T0 asks what to do with
  it.
- **One decision is deliberately deferred to T20:** whether `X-Frame-Options:
  DENY` and a strict CSP break the embedded Studio. The plan says try DENY
  first and carve out `/studio` only if it actually breaks — that is a
  verify-then-decide, not an unknown blocking kickoff.

---

## ✅ RESOLVED — route-shadowing bug found during execution (2026-07-27, at T8)

**Fixed in `946979f`** (owner decision: exclude reserved slugs). `[slug]`'s
`generateStaticParams` now filters out `fundraising` and `services`, so the
dedicated routes render. T8's acceptance was then verified end-to-end and
**T11 is unblocked**. Original writeup below for the record.



**`/fundraising` and `/services` are dead routes.** The CMS contains `page`
documents with slugs `fundraising` and `services`. `app/[slug]/page.tsx`'s
`generateStaticParams` reads `allPagesQuery` and therefore prerenders both,
writing to the same output paths as the dedicated `app/fundraising/page.tsx`
and `app/services/page.tsx` routes. The `[slug]` renderer wins, so the
dedicated pages never render.

Evidence: a sentinel menu item hardcoded into `app/fundraising/page.tsx`'s
item list does not appear in `.next/server/app/fundraising.html`, and neither
does a `console.log` in its data fetcher. The served page is `[slug]`'s
markup — `<h1>{page.title}</h1>` plus `SectionRenderer`, with no menu items.
Confirmed present **before** T8 (verified by rebuilding the pre-T8 file), so it
is pre-existing, not caused by this work.

Published page slugs: `test-dynamic-page`, `about`, `day-of-event`,
**`fundraising`**, `fundraising-tips`, `how-to-book`, `invoice-payment`,
**`services`**, `volunteers`.

**Impact on the plan:** T8 is committed and correct but unverifiable in the
running app. **T11 is blocked** — it adds `notFound()` handling to those two
pages, which cannot be exercised while they are shadowed. Awaiting an owner
decision on the fix.

---

## Progress Tracker

**Phase 0 — Plan housekeeping**

- [x] T0 — Relocate plan docs into `docs/plans/proposed/` (`haiku`) — `04cf3ab`

**Phase 1 — Data layer foundation (G)**

- [x] T1 — Delete sanity boilerplate and dead components (`haiku`) ∥ T2 — `512c10b`
- [x] T2 — One token-free, env-driven Sanity client (`sonnet`) ∥ T1 — `a2d07f2`
- [x] T3 — Query and schema corrections (`sonnet`) — `90699dc`
- [x] T4 — JSON-LD helper cleanup (`sonnet`) — `f1a2a8b`

**Phase 2 — Settings & CMS drift (C)**

- [x] T5 — Delete dead social features (`sonnet`) — `68d4388` (note: `siteSettings.logo` remains projected-but-unrendered; outside T5's delete-list, retained deliberately)
- [x] T6 — Google Analytics end-to-end fix (`opus`) — `8874806` (validator extracted to new `lib/analytics.ts`; verified on `staging`)
- [x] T7 — CMS-driven header/footer + contact socials (`sonnet`) — `67c9165`
- [x] T8 — Fundraising page corrections (`sonnet`) — `609a26b`; route-shadowing blocker fixed in `946979f`, acceptance then verified in full
- [x] T9 — `siteSettings` singleton enforcement (`sonnet`) — `867fbf6` ⚠ Studio DOM unverified (login cannot be automated — see commit body); needs one manual look in a logged-in browser
- [x] T10 — Delete `test-dynamic-page` document (`opus`) — script `f706e60`, executed 2026-08-12. Deleted `abe5021f-0a3a-4b99-b3b3-797895b6c756` ("Test Dynamic Page") from `production`; `count(*[_type=="page"])` 9 → 8; `/test-dynamic-page` returns 404 while `/about`, `/fundraising`, `/services` still 200. **Note:** a clean rebuild (`rm -rf .next`) is required after content deletions — Next's fetch cache otherwise keeps prerendering the removed slug.

**Phase 3 — Frontend correctness & a11y (F)**

- [x] T11 — Missing-document resilience + branded 404 (`sonnet`) — `b8823ad`
- [x] T12 — Nonexistent-palette class sweep (`haiku`) ∥ T13 — `734a551` (also carries gate-required Prettier reformatting of `MenuDisplay.tsx`)
- [x] T13 — Interactive-component accessibility (`sonnet`) ∥ T12 — `651928e` (mobile panel is now always-mounted and toggled with `hidden` so `aria-controls` always resolves; verified Escape/focus-return/`aria-current` interactively)
- [x] T14 — Rendering correctness and image sizing (`sonnet`) — `a0ec740`. Scope note: also added `sizes` to the four `fill` images in `app/page.tsx` (not in T14's stated file list, but required by its "no `fill` image lacks `sizes`" acceptance); nothing else in that file was touched, so T15 still owns it. The YouTube id keeps a `^[a-zA-Z0-9_-]+$` check so the `URL`-based rewrite does not loosen the old regex's guarantee.
- [ ] T15 — Data-fetch, sort, and directive cleanup (`sonnet`)

**Phase 4 — Endpoint & security hardening (D + E)**

- [ ] T16 — Contact endpoint hardening (`opus`)
- [ ] T17 — JSON-LD server rendering and XSS fix (`sonnet`)
- [ ] T18 — robots + sitemap (`sonnet`) ∥ T19
- [ ] T19 — Dependency vulnerability remediation (`sonnet`) ∥ T18
- [ ] T20 — Security headers and CSP (`opus`)

**Phase 5 — Import script safety (B)**

- [ ] T21 — Defang the import scripts (`sonnet`)
- [ ] T22 — Fix swallowed import errors (`haiku`)

**Phase 6 — Test suite rebuild and CI (A)**

- [ ] T23 — Test infrastructure reset (`sonnet`)
- [ ] T24 — Rewrite navigation and homepage specs (`sonnet`)
- [ ] T25 — Rewrite menu spec and add page smoke tests (`sonnet`)
- [ ] T26 — Contact form and API coverage (`sonnet`)
- [ ] T27 — Accessibility spec rewrite and full-suite green (`opus`)
- [ ] T28 — CI workflow (`sonnet`)

**Phase 7 — Hygiene (H)**

- [ ] T29 — Documentation update (`sonnet`)
- [ ] T30 — Archive superseded documentation (`haiku`)
- [ ] T31 — Repo-wide format sweep (`haiku`)
- [ ] T32 — Graduate the plan documents (`opus`)

**Done when:** all 33 boxes are ticked; `npm run lint`, `npm run format:check`,
`npm run build`, and `npm test` are all green on a fresh checkout of
`feat/remediation`; the CI workflow is green on a real PR; `/studio` loads,
edits, and saves with CSP active; `grep -rn "9t9xlmvm\|crimson-\|waitForTimeout"`
over `app/ components/ lib/ sanity/ scripts/ tests/` returns nothing (the plan
and review docs quote the stale ID intentionally); the four superseded docs are archived
under `docs/archive/`; and both plan documents have graduated to
`docs/plans/implemented/`.
