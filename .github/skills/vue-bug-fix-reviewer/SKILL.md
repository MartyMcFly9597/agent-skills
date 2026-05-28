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
2. Map each bug to changed code paths.
3. Detect symptom-only fixes and partial remediations.
4. Evaluate test quality and pre-fix failure plausibility.
5. Verify black-box testing style and selector stability.

## Output contract

- Return concise bullets under:
  - issue
  - concern
  - praise

## Non-negotiable rules

- Reject fragile, implementation-coupled tests.
- Reject fixes without durable regression coverage.

## Source prompt

- `.codex/prompts/vue/vue-bug-fix-reviewer.md`
