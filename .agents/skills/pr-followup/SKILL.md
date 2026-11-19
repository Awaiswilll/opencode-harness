---
name: pr-followup
description: "Repo-local workflow for PR review feedback: read the current diff, review-comments.md, PR_STATUS.md, and applicable repo guidance; group feedback by theme, risk, and code-change need; propose the smallest safe response plan; wait for approval; make only approved scoped changes; run relevant validation; return an evidence-backed handoff."
origin: personal
---

# PR Follow-up

A review-first workflow for turning reviewer feedback into a minimal, traceable response.
No file is edited until the response plan is approved.

## When to Use

- New review comments need to be addressed on an open PR.
- `PR_STATUS.md` shows requested changes or blocked checks.
- A reviewer asks for clarification, a code change, or both.
- You need a handoff that proves what was done and what was deliberately not done.

## Step 1 — Read Context Before Acting

Do **not** edit anything in this step. Read:

| Source | What to extract |
|---|---|
| Current diff | `git status`, `git diff`, and the PR base diff — what is actually changed |
| `review-comments.md` | Every reviewer request and its exact intent |
| `PR_STATUS.md` | Current PR state, check results, blockers, agreed scope |
| Applicable repo guidance | Active instruction chain: global guidance, `AGENTS.md` / `AGENTS.override.md` from repo root to working directory, `CODEOWNERS`, and relevant local skills |

If a named file is missing or unreadable, record it as an evidence gap and ask for it.
Do not infer its contents or proceed as if it were reviewed.

## Step 2 — Group Feedback

Group every request without deciding unilaterally to change code.

| # | Reviewer request | Theme | Risk (why) | Code change required? |
|---|---|---|---|---|
| 1 | … | correctness / security / scope / tests / docs / style | high / medium / low — reason | yes / no (reply only) / needs clarification |

Rules:

- Keep the reviewer's intent intact; do not rewrite it into something easier.
- Mark a request **needs clarification** if it is ambiguous, conflicts with another request,
  or would expand the reviewed scope.
- Risk must include a short reason, not just a label.

## Step 3 — Propose the Smallest Safe Response Plan

Prefer the smallest action that satisfies the request:

1. A written answer if clarification is enough — no code change.
2. One minimal patch per theme, touching only reviewed surfaces.
3. A clarification question if the request cannot be satisfied safely.

The plan must state:

- each request and the proposed response,
- exact files intended for edit,
- validation commands to be run,
- external actions that will **not** be taken.

**Stop here and wait for explicit approval before editing.** If requirements conflict,
scope grows beyond reviewed surfaces, or evidence is unavailable, ask instead of acting.

## Step 4 — Make Only Approved Changes

- Edit only files listed in the approved plan.
- Keep application edits scoped to the surfaces that were reviewed.
- No unrelated refactors, formatting sweeps, dependency or lockfile changes unless approved.
- Preserve protected existing behavior.
- If a safe fix requires touching an unreviewed surface, stop and ask for approval.

## Step 5 — Run Relevant Validation

- Discover the repository's validation commands from its guidance and config
  (for example `AGENTS.md`, `package.json`, `Makefile`, or CI config). Do not assume a command exists.
- Run the checks that are relevant to the changed surfaces.
- Record each command with its **observed** result: pass/fail, counts, and errors.
- If a command cannot run, say why. Never report a check as passed without observed output.
- Review the final diff (`git diff --stat` and `git diff`) before handoff.

## Step 6 — Return the Handoff

The handoff must contain all of the following:

1. **Reviewer requests** — each request, how it was addressed, and its status.
2. **Files changed** — exact paths, and why each was touched.
3. **Checks run** — command, observed result, and notes.
4. **Risks** — remaining risks, unverified assumptions, and limitations.
5. **External actions not taken** — explicitly list what was avoided, such as:
   push, PR comment posted, CI rerun, merge, deploy, or scope expansion.
6. **Remaining questions** — anything requiring a human decision.

## Guardrails

- No edits before the response plan is approved.
- No changes outside the reviewed surfaces.
- No push, PR comment, merge, or deploy without explicit instruction.
- No invented context for missing files or evidence.
- No claim of success without observed validation output.
