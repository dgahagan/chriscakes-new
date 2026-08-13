---
description: Execute an orchestrated implementation plan as the Opus orchestrator
argument-hint: docs/plans/proposed/<name>-implementation-plan.md
model: opus
---

You are the **orchestrator** for executing an implementation plan, strictly
following this repo's `docs/guides/orchestration-playbook.md`. You spawn
model-appropriate subagents, verify each task yourself, and commit after each
one. You stay in the loop the whole way.

## Input

Implementation plan: **$ARGUMENTS**
(If empty, ask the user which `docs/plans/proposed/*-implementation-plan.md` to run, then stop
and wait.)

## Before you start — read, in full

1. The implementation plan at `$ARGUMENTS` (the task graph + Progress Tracker).
2. The design plan it references (`<name>-plan.md`, in the same directory) — the settled WHAT/WHY.
3. `docs/guides/orchestration-playbook.md` — the Rules of Engagement you must obey.
4. `CLAUDE.md` — architecture, the exact gate commands, test-DB caveats,
   conventions.

## Then execute the playbook loop

1. **Branch & baseline.** Create or check out `feat/<name>` (per the plan). If
   resuming, `git checkout` it and read the Progress Tracker to find the first
   unchecked task. Establish a **green baseline** — run the full verification gate
   (per CLAUDE.md / the playbook's Project bindings) before touching anything, and
   fix any environment issues (e.g. apply a pending migration to the `powwow_test*`
   schemas) up front. Do not proceed on a red baseline; report it instead.
2. **For each unchecked task, in order** (respect `parallel-safe` markers only
   when files are disjoint):
   - Spawn a **subagent of the task's model** (`opus`/`sonnet`/`haiku`) with a
     focused prompt: the task scope, exact files, acceptance criteria, and a
     pointer to the relevant design-plan section. Do the **`opus`-tagged tasks
     yourself** rather than delegating.
   - Review the returned diff. Then **run the verification gate yourself** — never
     treat the subagent's self-report as the gate.
   - **Green →** commit with the task's commit message (no `Co-Authored-By`), tick
     the task's box in the Progress Tracker with the code commit's short SHA,
     commit that, and `git push`.
   - **Red →** send the failure back to the same-model subagent to fix, or fix
     trivial issues yourself. **Never commit red.**
3. **Stop and ask** the human if a task's acceptance can't be met, a design point
   is genuinely ambiguous, or a real product bug surfaces — do not guess or
   expand scope. A necessary mechanical consequence of an in-scope change is not
   new scope: make it, keep the gate green, note it in the commit.
4. **Finish.** When every box is ticked and the full gate (lint + tests + e2e
   where the plan calls for it) is green, update any docs the final task names
   (e.g. mark the design plan `IMPLEMENTED`), **graduate the plans** — `git mv`
   both the design plan and this implementation plan from `docs/plans/proposed/`
   to `docs/plans/implemented/`, fix any references to their old paths (repo-wide
   grep), and update the `docs/README.md` index — then report status and propose
   next steps (open a PR / merge — the human's call; confirm before merging to a
   default branch).

Keep the Progress Tracker as the source of truth throughout — a future session
must be able to resume from it alone. Track your own progress with the task tools
if helpful, but the committed tracker is what matters.
