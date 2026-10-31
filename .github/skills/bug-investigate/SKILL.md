---
name: bug-investigate
description: Investigate a reported software defect, confirm its root cause, identify test gaps, and prepare a BUGFIX.md plan. Use when a defect needs analysis before code changes.
argument-hint: "Issue key or bug details"
disable-model-invocation: true
---

# Bug Investigation

## Purpose

Analyze a reported defect and prepare a focused, evidence-based fix plan without changing implementation code.

## When to use

- A defect needs root-cause analysis before anyone changes code.
- Existing `BUGFIX.md` needs validation or updating against a new report.

## Required inputs

- An issue-tracker item, supplied through an available integration, or bug details pasted by the user.
- The application repository and relevant tests.
- Optional existing `BUGFIX.md`.
- Optional separate end-to-end repository, if the consumer project uses one.

If the report or repository is not available, ask for it. Never fabricate issue details, reproduction steps, or access to a tracker.

## Procedure

Read and follow [workflow-execution](../workflow-execution/SKILL.md), applying its context and planning contract. Do not execute its implementation phase during investigation.

1. Restate the report: reproduction steps, expected behavior, actual behavior, and relevant environment or application area.
2. Trace the behavior through the actual code and tests. Read the relevant code; do not infer a root cause from symptoms alone.
3. Confirm the smallest root cause and classify it where useful (logic, state/reactivity, timing/race, or data flow). Cite repository-relative files and line locations in `BUGFIX.md`.
  For multiple reports, trace shared helpers, recent changes, and state/data dependencies. Distinguish shared causes from independent defects and plan shared or separate regression coverage accordingly.
4. Review relevant unit/component tests and, when available and appropriate, end-to-end tests. Explain why existing coverage did not catch the defect.
5. Identify regression risks and choose unit, component, end-to-end, or combined coverage based on the behavior and the consumer project's test stack.
  For Vue component coverage, read and follow [vue-testing](../vue-testing/SKILL.md) before finalizing the fix plan; record test-harness prerequisites.
6. Create or update `BUGFIX.md` with the following structure:

```markdown
# BUGFIX

## Bug

<summary>

## Bug ID

<stable issue identifier, if available>

## Created

<timestamp>

## Steps to Reproduce

1. ...

## Expected Behaviour

...

## Actual Behaviour

...

## Root Cause

<confirmed code-path explanation with repository-relative file references>

## Application Context

- repository and stack:
- applicable app-family / technology skills (paths, or none):
- repository-specific constraints:

## Existing Test Coverage

- unit/component tests:
- end-to-end tests:
- gap analysis:

## Regression Risks

- ...

## Fix Plan

- [ ] Step 1: <title>
  - goal:
  - files:
  - tests:
  - verify:
  - done_when:
```

7. Apply the shared planning contract to each fix step and preserve valid progress when resuming.
8. If an issue tracker or separate end-to-end repository is unavailable, state that limitation and use user-provided details or current-repository tests as appropriate.

## Output contract

- Save `BUGFIX.md`.
- Summarize the report, confirmed root-cause evidence, test gap, proposed fix scope, and remaining uncertainty.
- State explicitly that no implementation changes were made.

## Non-negotiable rules

- Investigation only; do not implement a fix.
- Confirm the root cause by tracing code, not guessing.
- Assess relevant test gaps.
- Each proposed fix step must include a test that would reproduce the original defect.

## Related skills

- Use `bug-fix` to execute the resulting fix plan and `bug-verify` to review completed work.
