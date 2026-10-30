---
name: story-implementer
description: Execute the next incomplete PLAN.md story step with focused tests and verification. Use when an approved plan is ready for implementation or needs a careful resume.
argument-hint: "Story key or PLAN.md"
disable-model-invocation: true
---

# Story Implementer

## Purpose

Execute a valid `PLAN.md` one step at a time, with tests and verification before completion.

## When to use

- A story has a valid `PLAN.md` and implementation is ready to begin.
- Controlled incremental execution or a safe resume is required.

## Required inputs

- Valid `PLAN.md`.
- Current application repository.
- Story details from an available issue-tracker integration, or pasted by the user, when needed to validate plan scope.
- Optional separate e2e repository when a step declares `repo: e2e`.

## Procedure

1. Read and validate `PLAN.md` against the supplied story details. Do not recreate it unless it is missing or clearly invalid.
2. If the plan recommends multi-context execution, perform only one step in this run and rely on the plan for context.
3. Find the first unchecked `[ ]` step. Read its `goal`, `files`, `tests`, `verify`, and `done_when` fields and inspect the current code to determine whether it is already satisfied.
4. If `repo: e2e` is specified, work in the separate e2e repository; otherwise work in the current application repository. Confirm the correct feature branch in each repo. If the base branch is unknown, inspect repository docs or ask the user.
5. For a frontend change, inspect an existing screen or component in the same area. Follow established layout, shared classes/tokens, component patterns, and accessibility semantics.
6. Make the smallest safe change for this step. Add or update tests for its new behavior and relevant regression risks. For bug-fix work, write and observe a reproducing test fail before the implementation change.
7. Run every listed test and verification command. Discover actual commands from the consumer repository if the plan is incomplete; do not invent commands. If verification fails, diagnose and repair this step, then rerun the same checks.
8. Re-read `done_when`. Mark `[x]` only after implementation, tests, and all required verification are complete. Record exact commands and results.
9. Commit a completed step only when the consumer repository's contribution workflow permits it. Commit in the repo where the files changed; never commit e2e files in the application repo or vice versa.
10. Stop after the current incomplete step. Report the step, repo, changes, tests, exact verification results, completion status, and commit status.

## Output contract

- One step per invocation.
- Report only observed verification results; state failures or unavailable prerequisites clearly.
- Do not claim a model or tool restriction was enforced by this skill. An optional `model:` field in `PLAN.md` is informational; model availability is controlled outside the skill.

## Non-negotiable rules

- Never skip a plan step or tests.
- Never mark `[x]` before every `done_when` condition is verifiably met.
- Never proceed to the next step before the current step is tested and verified.
- Avoid unrelated refactors.
- Keep examples and shared output free of organization identifiers, private endpoints, customer data, and business-specific operational details.

## Source prompts

- Source traceability is maintained in the repository migration map, which is not included with installed skills.
