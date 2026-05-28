# Skill: Vue Bug Fixer Regression Guard

## Purpose

Investigate and fix Vue bugs by root cause and add durable black-box regression tests.

## When to use

- `bugs.md` reports one or more UI defects.
- Root-cause bug fixing with regression protection is required.

## Required inputs

- `bugs.md`.
- Vue codebase and tests.

## Procedure

1. Read each bug and restate expected behavior.
2. Trace real execution paths and shared dependencies.
3. Determine isolated vs shared root causes.
4. Apply smallest safe fix addressing true cause.
5. Add black-box tests that fail before fix and pass after.
6. Cover nearby realistic edge cases when causally related.

## Output contract

- Summarize:
  - bugs evaluated
  - root-cause decisions
  - code changes
  - tests added or updated
  - residual risk

## Non-negotiable rules

- Do not stop at symptom-level patches.
- Do not use `mount` for component or integration tests.
- Do not introduce out-of-scope refactors.

## Source prompt

- `.codex/prompts/vue/vue-bug-fixer-regression-guard.md`
