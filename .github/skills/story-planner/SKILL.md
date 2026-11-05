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

Read and follow [workflow-execution](../workflow-execution/SKILL.md), applying its context and planning contract. Do not execute its implementation phase while planning.

1. Understand user-visible behavior, acceptance criteria, edge cases, constraints, and ambiguities. Create a stable story identifier from the supplied story content without copying confidential material into this reusable skill.
2. Inspect relevant application code, tests, mocks, fixtures, types, configuration, and repository scripts. Identify behavior to reuse, affected modules, coupling, fragile areas, regression risks, and missing coverage.
  For planned Vue component coverage, read and follow [vue-testing](../vue-testing/SKILL.md) before selecting tests and commands. Record missing harness prerequisites rather than promising unavailable coverage.
3. Highlight in-scope patterns that could materially affect the planned change. Recommend improvements when they reduce risk, but avoid unrelated refactors.
4. If a separate e2e repository exists, inspect relevant specs, page objects, fixtures, and naming patterns. Otherwise record that no separate e2e repository is configured.
5. Apply the shared planning contract to any existing `PLAN.md`, matching it to the supplied story and current code.
6. Create or update `PLAN.md` using this structure:

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

## Application Context

- repository and stack:
- applicable app-family / technology skills (paths, or none):
- repository-specific constraints:

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

A step may include an optional `model:` hint only when the user has specified an available model. The hint is informational; this skill cannot enforce it. Prefer the least-complex available model that can perform the task reliably. Escalate only after a concrete reasoning or verification need appears, and return to the ordinary choice for later steps.

7. Use the shared step fields. Order work to verify behavior early and reduce regression risk.
8. For user-facing behavior changes, plan a dedicated e2e step when an e2e environment is available, whether in the application repository or a separate one. Specify reusable page objects and fixtures, place it after the corresponding implementation step, and follow repository branch conventions. Use `repo: e2e` only for a separate repository; identify application-local e2e files as application work. If e2e cannot be run, state the gap and reason. Absence of a separate repository alone is not a coverage gap.
9. Record repository-specific commands and prerequisites under the shared planning contract.
10. Include complexity (`small | medium | large`), rationale, and suggested execution (`single-context` or `multi-context`). Large work should be grouped into independently executable phases.
11. Save `PLAN.md` and summarize story understanding, risks, impacted areas, plan, e2e coverage, and whether work was resumed or started fresh.

## Output contract

- Save or update `PLAN.md`.
- Provide a concise planning summary and call out unresolved prerequisites or missing test environments.

## Non-negotiable rules

- Planning only; no implementation code changes.
- Consider e2e coverage for user-facing behavior and document when it is unavailable.

## Related skills

- Use `story-implementer` to execute the plan and `story-verifier` to review completion evidence.
