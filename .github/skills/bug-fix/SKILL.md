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

Read and follow [workflow-execution](../workflow-execution/SKILL.md), applying its context and step execution rules to `BUGFIX.md`.

1. Read `BUGFIX.md` and validate that it matches the supplied issue details. Re-read the identified code path to confirm the stated cause.
2. Choose the lowest suitable test boundary: unit for isolated logic, component/integration for UI behavior, or e2e when the full user flow is essential. For Vue changes, read and follow [vue-testing](../vue-testing/SKILL.md).
3. For a code fix, write a focused regression test that reproduces the reported behavior and verify that it fails for the expected reason before changing implementation code.
	On resume when implementation already exists, preserve current work. Use recorded observed red/green evidence or, with permission, replay the test against unfixed code in an isolated checkout and rerun against the fix. Label a retrospective replay honestly; it proves regression sensitivity, not original test-first chronology. Missing evidence blocks completion, not a reason to undo existing work.
4. Address the confirmed cause, not symptoms. Cover realistic related paths when the selected step changes a shared dependency; do not bundle independent defects into the step.
5. Complete the selected step under the shared verification, checkpoint, and reporting rules, including relevant existing regression tests.

## Output contract

- Use the shared step report, adding the reproducing failure, causal fix, and regression coverage.

## Non-negotiable rules

- Test first: demonstrate the regression test failing before the fix.
- A fix must address the confirmed cause rather than masking the symptom.

## Related skills

- Use `bug-investigate` to prepare a confirmed root cause and fix plan; use `bug-verify` to review completed work.
