---
name: story-planner
description: Create or safely resume a small, testable PLAN.md for a software story. Use before implementation when a story needs scope analysis, regression planning, and test coverage planning.
argument-hint: "Story key or URL, or paste the story"
disable-model-invocation: true
---

# Story Planner

## Purpose

Create or update `PLAN.md` with a safe, incremental, regression-aware plan. Planning only: do not implement code.

## When to use

- A story needs an implementation plan before coding.
- An existing `PLAN.md` needs validation or refinement.

## Required inputs

- Story summary, description, and acceptance criteria from an available issue-tracker integration, or pasted by the user.
- The current application repository.
- Optional existing `PLAN.md`.
- Optional separate e2e repository if the consumer project has one.

If story details or repository context are missing, ask for them. Never fabricate issue data, test commands, or repository availability.

## Procedure

1. Understand user-visible behavior, acceptance criteria, edge cases, constraints, and ambiguities. Create a stable story identifier from the supplied story content without copying confidential material into this reusable skill.
2. Inspect relevant application code, tests, mocks, and repository scripts. Identify reusable behavior, affected modules, coupling, and regression risks.
3. If a separate e2e repository exists, inspect relevant specs, page objects, fixtures, and naming patterns. Otherwise record that no separate e2e repository is configured.
4. If `PLAN.md` exists, validate it against the current story. Preserve valid completed `[x]` steps and valid unchecked `[ ]` steps. Update only where new findings require it. If it is invalid for this story, replace it and explain why.
5. Create or update `PLAN.md` using this structure:

```markdown
# PLAN

## Story

<summary>

## Story ID

<stable fingerprint of supplied story content>

## Created

<timestamp>

## Updated

<timestamp>

## Assumptions / Ambiguities

- ...

## Impacted Areas

- ...

## Regression Risks

- ...

## In-Scope Issues Worth Addressing

- ...

## E2E Test Strategy

- existing coverage:
- new specs needed:
- page objects / helpers needed:
- e2e repo branch (if a separate e2e repo is used): feature/<story-id>-<slug>

## Plan

- [ ] Step 1: <title>
  - goal:
  - files:
  - tests:
  - verify:
  - done_when:

- [ ] Step N (E2E): <title>
  - goal:
  - repo: e2e
  - files:
  - tests:
  - verify:
  - done_when:
```

A step may include an optional `model:` hint only when the user has specified an available model. The hint is informational; this skill cannot enforce it.

6. Keep steps small, testable, independently executable where practical, and commit-ready. Every step has concrete `tests`, `verify`, and objective `done_when` criteria. Order work to verify behavior early and reduce regression risk.
7. For user-facing behavior changes, plan a dedicated e2e step when an e2e environment is available. Put it after the corresponding implementation step. If e2e cannot be run or no separate repo exists, state the gap and reason.
8. Discover test and verification commands from the consumer repository's manifests or docs. Write commands that can be run as-is; do not copy source-project commands unless confirmed present in the consumer repository.
9. Include complexity (`small | medium | large`), rationale, and suggested execution (`single-context` or `multi-context`). Large work should be grouped into independently executable phases.
10. Save `PLAN.md` and summarize story understanding, risks, impacted areas, plan, e2e coverage, and whether work was resumed or started fresh.

## Output contract

- Save or update `PLAN.md`.
- Provide a concise planning summary and call out unresolved prerequisites or missing test environments.

## Non-negotiable rules

- Planning only; no implementation code changes.
- Preserve valid progress when resuming.
- No large or vague steps; every step needs explicit tests, verification, and `done_when`.
- Consider e2e coverage for user-facing behavior and document when it is unavailable.
- Keep examples generic and never copy organization-specific identifiers, URLs, business operations, or confidential story details into reusable skill content.

## Source prompts

- Source traceability is maintained in the repository migration map, which is not included with installed skills.
