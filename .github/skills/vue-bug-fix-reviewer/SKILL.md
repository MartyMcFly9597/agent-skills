---
name: vue-bug-fix-reviewer
description: Independently assess whether a proposed Vue bug fix is causal, complete, and regression-safe. Use when a Vue fix is ready for review.
disable-model-invocation: true
---

# Vue Bug Fix Reviewer

Review the consuming repository's Vue bug report and proposed changes independently. This role is separate from the Jira `BUGFIX.md` verification phase.

Follow the consuming repository's instructions and [vue-testing](../vue-testing/SKILL.md).

## Review Procedure

1. Read the bug report and enumerate the expected behaviors.
2. Map each behavior to the changed code paths and determine whether the fix addresses the root cause rather than a symptom.
3. Check for partial remediations, unintended scope, and realistic related paths affected by the same cause.
4. Assess whether regression tests exercise observable behavior, would fail before the fix, and cover the relevant causal paths.
5. Check selector stability, asynchronous assertions, and adherence to the repository's black-box testing conventions.

## Report

Return concise findings under `issue`, `concern`, and `praise`. Do not approve a fragile test or a fix without durable regression coverage.