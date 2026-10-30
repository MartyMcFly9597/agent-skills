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

1. Restate the report: reproduction steps, expected behavior, actual behavior, and relevant environment or application area.
2. Trace the behavior through the actual code and tests. Read the relevant code; do not infer a root cause from symptoms alone.
3. Confirm the smallest root cause and classify it where useful (logic, state/reactivity, timing/race, or data flow). Cite repository-relative files and line locations in `BUGFIX.md`.
4. Review relevant unit/component tests and, when available and appropriate, end-to-end tests. Explain why existing coverage did not catch the defect.
5. Identify regression risks and choose unit, component, end-to-end, or combined coverage based on the behavior and the consumer project's test stack.
6. Create or update `BUGFIX.md` with the following structure:

```markdown
# BUGFIX

## Bug

<summary>

## Bug ID

<stable issue identifier, if available>

## Steps to Reproduce

1. ...

## Expected Behaviour

...

## Actual Behaviour

...

## Root Cause

<confirmed code-path explanation with repository-relative file references>

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

7. Keep each fix step small, testable, and independently verifiable. Include exact commands discovered from the repository's manifests or documentation; do not invent commands.
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
- Keep organization-specific endpoints, identifiers, customer data, and business-process details out of reusable examples.

## Source prompts

- Source traceability is maintained in the repository migration map, which is not included with installed skills.
- See `docs/migration/MIGRATION_MAP.md` in the source repository for the migration record; this link is intentionally not relative because that document is not installed with the skill.
