---
name: bug-fix
description: Execute the next verified BUGFIX.md step using a reproducing test, minimal change, and regression checks. Use when an investigated defect is ready for implementation.
argument-hint: "Issue key or BUGFIX.md"
disable-model-invocation: true
---

# Bug Fix

## Purpose

Implement an already-investigated defect in small, test-first, verifiable steps recorded in `BUGFIX.md`.

## When to use

- A valid `BUGFIX.md` contains an approved root-cause analysis and unchecked fix steps.
- An existing `BUGFIX.md` needs validation before resuming.

## Required inputs

- `BUGFIX.md` with a confirmed root cause and testable fix plan.
- The application repository and its tests.
- Issue-tracker read access when available, or user-provided issue details for validation.

If `BUGFIX.md` is absent or invalid, stop and request the investigation workflow. Do not silently invent a replacement plan.

## Procedure

1. Read `BUGFIX.md` and validate that it matches the supplied issue details. Re-read the identified code path to confirm the stated cause.
2. Find the first unchecked `[ ]` step. Execute only that step in this run.
3. Check whether the step's `done_when` conditions are already satisfied. If all are clearly met, run its listed verification before marking it complete; otherwise make the smallest required change.
4. For a code fix, write a focused regression test that reproduces the reported behavior and verify that it fails for the expected reason before changing implementation code.
5. Apply the smallest safe change that addresses the confirmed root cause. Do not refactor unrelated code.
6. Run the exact step test and verification commands from `BUGFIX.md`, plus relevant existing regression tests. Discover commands from repository manifests or docs if the plan omitted them; record any adjustment.
7. Re-read `done_when`. Mark the step `[x]` only when implementation, regression coverage, and all required verification are complete. Record exact commands and results.
8. Prepare the completed step as a commit-ready increment. Commit only when permitted by the consumer repository's contribution workflow; keep changes in the correct repository.

## Output contract

- State which step and repository were handled.
- Summarize the reproducing test and minimal fix.
- List exact verification commands and results.
- State whether the step was marked complete and whether a commit was created.
- Report blockers or residual risk without claiming unverified success.

## Non-negotiable rules

- One incomplete step per run; do not skip steps.
- Test first: demonstrate the regression test failing before the fix.
- Never mark completion without fresh verification and satisfied `done_when` conditions.
- Avoid unrelated refactors and do not claim a tool/model restriction that the Copilot skill cannot enforce.
- Keep organization-specific endpoints, identifiers, customer data, and business-process details out of reusable examples and shared output.

## Related skills

- Use `bug-investigate` to prepare a confirmed root cause and fix plan; use `bug-verify` to review completed work.
