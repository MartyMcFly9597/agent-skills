# Skill: PR Review

## Purpose

Perform focused pull request review on diff-only scope with severity-labeled findings.

## When to use

- User asks for a code review of current branch changes.
- Risk-focused review is needed before merge.

## Required inputs

- Git repository with a feature branch.
- Configured target branch; ask which branch to use if the repository does not identify one.

## Procedure

1. Compute the diff with `git diff <target-branch>...HEAD`.
2. Use the repository's configured target branch; ask the user if it is unclear.
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
