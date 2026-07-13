# Skill: PR Review

## Purpose

Perform focused pull request review on diff-only scope with severity-labeled findings.

## When to use

- User asks for a code review of current branch changes.
- Risk-focused review is needed before merge.

## Required inputs

- Git repository with a feature branch.
- Baseline branch: `develop` or `origin/develop`.

## Procedure

1. Compute diff with `git diff develop...HEAD`.
2. If `develop` is unavailable, fetch and use `origin/develop...HEAD`.
3. Review only changed files and nearby context required for risk analysis.
4. Prioritize correctness, regression risk, test gaps, maintainability.
5. Classify findings as `ISSUE`, `CONCERN`, `NITPICK`, `SUGGESTION`, `PRAISE`.
6. Write results to `reviews/pr-review-<branch>-<timestamp>.md`.

## Output contract

- Return only:
  - output path
  - counts by section

## Non-negotiable rules

- Do not review unrelated files.
- Do not generate filler comments.
- Call out missing behavior coverage when behavior changes.

## Source prompt

- `.github/prompts/pr-review.md`
