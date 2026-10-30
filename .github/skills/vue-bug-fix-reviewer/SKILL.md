---
name: vue-bug-fix-reviewer
description: Review Vue bug fixes for causal correctness, complete coverage, and regression-safe black-box tests.
argument-hint: "BUGFIX.md or bug report"
disable-model-invocation: true
---

# Skill: Vue Bug Fix Reviewer

## Purpose

Assess whether a proposed Vue bug fix is complete, causal, and regression-safe.

## When to use

- `bugs.md` exists and a fix is ready for review.

## Required inputs

- `bugs.md`.
- Proposed code and test changes.

## Procedure

1. Read `bugs.md` and enumerate bug expectations.
2. Map each bug to the changed code paths and detect partial remediations.
3. Check whether each change addresses root cause rather than symptoms and whether related shared regression patterns remain.
4. Evaluate test quality, pre-fix failure plausibility, and coverage of realistic related paths.
5. Verify black-box testing style, selector stability, and coupling to PrimeVue internals.

## Output contract

- Return concise bullets under:
  - issue
  - concern
  - praise

## Non-negotiable rules

- Reject fragile, implementation-coupled tests.
- Reject fixes without durable regression coverage.
- Follow `shared-vue-testing-context` and `vue-testing-library-black-box` for Vue test conventions.
