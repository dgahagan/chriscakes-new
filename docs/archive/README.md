# Archived Documentation

This directory contains documentation files that describe features or procedures that have been superseded or removed as part of the remediation work.

These files are archived on **2026-08-12** as part of the remediation work planned on 2026-07-26. The full history of each file is preserved in git (`git log --follow -- <filename>`) to maintain traceability of why these features existed and when they were removed.

## Archived Files

### SOCIAL_MEDIA_INTEGRATION.md

Documents the UGC gallery, review widgets, click-to-tweet links, Pinterest board embeds, and Instagram feed widgets that were configurable in Sanity Studio. These components and their schema fields were deleted in T5 because they were configured in Sanity but rendered nowhere in the frontend.

**Note:** Social media _links_ (ShareButtons component) remain on four pages; only embedded _feeds and widgets_ were removed.

**Superseded by:** The current social media strategy documented in `CLAUDE.md` (no embedded feeds); `docs/plans/implemented/remediation-implementation-plan.md` (T5 deletion rationale).

### SOCIAL_MEDIA_STATUS.md

Status tracking document for the social media integration features above, describing implementation progress of the UGC gallery, review widgets, and embedded feeds.

**Superseded by:** `docs/plans/implemented/remediation-implementation-plan.md` (status of all remediation tasks).

### PHASE5_TESTING_SUMMARY.md

Describes the Phase 5 test suite, including the visual regression test suite, baselines, and test execution procedures. This suite was deleted in T23 because the visual regression baselines never existed.

**Superseded by:** `docs/plans/implemented/remediation-implementation-plan.md` (testing strategy); `.github/workflows/ci.yml` (current CI testing).

### TESTING_GUIDE.md

Documents the pre-rewrite Playwright test suite, test file locations, and the `test:visual` npm script (both deleted). The Playwright suite was completely rewritten from scratch in T23–T27 to match the refactored codebase.

**Superseded by:** `CLAUDE.md` (development commands and testing procedures); `docs/plans/implemented/remediation-implementation-plan.md` (why tests were rewritten); `.github/workflows/ci.yml` (current CI workflow as of T28).

## Finding Current Information

- **Development commands and conventions:** See `CLAUDE.md`
- **Why the remediation was done (design plan):** See `docs/plans/implemented/remediation-plan.md`
- **What was actually changed, task by task (execution log):** See `docs/plans/implemented/remediation-implementation-plan.md`
- **Project setup and deployment:** See `SETUP.md`

## History

To view the complete history of an archived file (commits, changes, deletion context):

```bash
git log --follow -- docs/archive/<filename>
git show <commit>:docs/archive/<filename>
```
