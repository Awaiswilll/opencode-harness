---
name: checkout-idempotency-workflow
description: "Bounded, agent-routed workflow for preventing duplicate orders from retried checkout requests while preserving successful checkout and existing payment authorization behavior. Use for checkout retry, idempotency-key, and duplicate-order tasks."
origin: personal
---

# Checkout Idempotency Workflow

A reusable prompt and routing plan for bounded checkout-idempotency work. It keeps the
original evidence, review, and safety gates intact while making agent and skill usage
explicit and reproducible.

## When to Use

- A checkout endpoint can create more than one order when a request is retried.
- A task mentions idempotency keys, duplicate orders, or retry-safe order creation.
- Payment authorization behavior must be preserved while changing order creation.
- You need a review-first plan before any code edit is allowed.

## Goal

> Prevent retried checkout requests from creating more than one order while preserving
> successful checkout and existing payment authorization behavior.

## Evidence to Inspect

Treat the **product ticket as the source of expected customer behavior**. Flag conflicting
requirements instead of silently choosing one.

| Source | What to extract |
|---|---|
| Product ticket | Expected customer behavior, acceptance criteria |
| API documentation | Idempotency-key contract, retry/response semantics |
| Incident summary | Failure mode, affected flows, known regressions |
| Order-creation code | Where the order is written, current guards |
| Existing checkout tests | Coverage that exists and coverage that is missing |

## Agent and Skill Routing

Use the available agents and skills explicitly, not as a vague suggestion.

### Agents

| Phase | Agent | Purpose |
|---|---|---|
| Evidence gathering | `explore` | Locate and summarize ticket, docs, incident, code, and tests |
| Consolidation / planning | `planner` | Produce a bounded plan with evidence and open questions — **no edits** |
| Test-first behavior | `tdd-guide` | Define failing tests for same-key and different-key behavior |
| Payment safety | `security-reviewer` | Protect payment authorization and sensitive failure modes |
| Final diff review | `code-reviewer` | Mandatory after any implementation |
| Storage review (conditional) | `database-reviewer` | Only if a unique constraint or schema change is needed |
| UI checkout flow (conditional) | `e2e-runner` | Only if retry behavior must be verified through the UI |

### Skills

| Phase | Skill | Purpose |
|---|---|---|
| API contract | `api-design` | Idempotency-key semantics, responses, retry expectations |
| Payment safety | `security-review` | Preserve authorization behavior under retries |
| Test discipline | `tdd-workflow` (or `tdd`) | Red-green-refactor, coverage expectations |
| Implementation context | `backend-patterns` | Align with existing backend conventions |
| Pre-handoff | `verification-loop` | Confirm checks, risks, monitoring, rollback criteria |
| Storage (conditional) | `database-migrations` | Only if persistence/constraints change |
| UI tests (conditional) | `e2e-testing` | Only if browser-level checkout checks are required |

## Ready-to-Paste Prompt

```text
Goal: Prevent retried checkout requests from creating more than one order while preserving
successful checkout and existing payment authorization behavior.

Use available agents and skills explicitly. Start with the `explore` agent to inspect the
product ticket, API documentation, incident summary, order-creation code, and existing
checkout tests. Treat the product ticket as the source of expected customer behavior and
flag conflicting requirements. Use the `planner` agent to consolidate findings, supporting
evidence, unresolved questions, and rollout risks into a proposed implementation plan.
Use `api-design` guidance for idempotency-key semantics and `security-review` guidance plus
the `security-reviewer` agent for payment-authorization preservation. If the implementation
appears to require schema or storage changes, use the `database-reviewer` agent and
`database-migrations` guidance before proposing those changes.

Investigate requirements, missing test coverage, and rollout risks independently when
appropriate. Consolidate the findings, supporting evidence, and unresolved questions in the
main task before proposing an implementation plan.

Stop for review before editing. Ask for clarification if the requirements conflict,
necessary changes exceed the approved scope, or important evidence is unavailable.

Do not redesign checkout, modify unrelated retry handling, merge code, or deploy changes.

After a plan is approved, implement test-first with `tdd-guide` and `tdd-workflow`, then use
`code-reviewer` for the final diff and `verification-loop` before handoff. Add `e2e-runner`
and `e2e-testing` only if the retry behavior must be verified through a UI checkout flow.

The work is ready for review when repeated requests with the same idempotency key create one
order, requests with different keys continue to work, relevant checkout and regression tests
pass, and the final handoff includes observed results, remaining risks, monitoring criteria,
and a rollback condition.
```

## Review Gates

1. **Gate 1 — Evidence:** all five evidence sources inspected; conflicts surfaced.
2. **Gate 2 — Plan:** findings consolidated; plan contains scope, tests, risks, open questions.
3. **Gate 3 — Approval:** stop and wait for review before any file edit.
4. **Gate 4 — Clarification:** pause if requirements conflict, scope grows, or evidence is missing.
5. **Gate 5 — Verification:** tests pass, diff reviewed, handoff complete.

## Guardrails

- Do not redesign checkout.
- Do not modify unrelated retry handling.
- Do not merge code.
- Do not deploy changes.
- Do not treat the public ticket as optional — it defines expected customer behavior.

## Definition of Done

- Repeated requests with the **same idempotency key** create exactly **one order**.
- Requests with **different keys** continue to work.
- Relevant checkout and regression tests pass.
- Final handoff includes:
  - observed results,
  - remaining risks,
  - monitoring criteria,
  - a rollback condition.
