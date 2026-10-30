---
name: vue-bug-fixer-regression-guard
description: Investigate and fix Vue defects with root-cause analysis and durable black-box regression tests.
argument-hint: "Bug report or bugs.md"
disable-model-invocation: true
---

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
3. Assess whether reports share a root cause, recent change, state/data dependency, or test-coverage gap; decide whether coverage should be shared or separate.
4. Determine isolated versus shared root causes and the observable behavior each regression test must protect.
5. Choose the lowest suitable test level: unit for isolated logic, component/integration for UI behavior, or end-to-end when the full user flow is required.
6. Apply the smallest safe fix addressing the confirmed cause.
7. Add black-box tests that fail before the fix and pass after, covering nearby realistic edge cases when causally related.

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
- Follow `shared-vue-testing-context` and `vue-testing-library-black-box` for Vue test conventions.
