---
name: vue-bug-fixer-regression-guard
description: Investigate and fix Vue defects by root cause, with durable black-box regression tests. Use when a Vue bug report needs a causal fix and regression protection.
disable-model-invocation: true
---

# Vue Bug Fixer Regression Guard

Use this Vue-specific workflow for the consuming repository's bug report and Vue codebase. It is separate from the Jira `BUGFIX.md` investigation, implementation, and verification phases.

Follow the consuming repository's instructions and [vue-testing](../vue-testing/SKILL.md).

## Procedure

1. Read each reported defect and restate its expected user-visible behavior.
2. Trace the relevant Vue execution paths and shared dependencies to identify the root cause.
3. Decide whether the cause is isolated or shared, and identify the smallest useful regression boundary.
4. Add or update black-box tests that fail for the reported behavior before changing implementation code. Use Testing Library rendering for component and integration tests; do not use `mount` for those tests.
5. Apply the smallest safe change that addresses the cause, then run the regression tests and relevant neighboring checks.
6. Cover realistic related paths when they share the cause; avoid unrelated refactors.

## Report

Summarize the defects evaluated, root-cause decisions, code changes, tests and verification, and residual risks.