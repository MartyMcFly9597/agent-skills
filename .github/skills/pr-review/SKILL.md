---
name: pr-review
description: Review a pull request diff for correctness, regression risk, and missing tests. Use when reviewing proposed changes before merge.
argument-hint: "Pull request or target branch"
disable-model-invocation: true
---

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
6. When behavior changed, check whether tests were added or updated. If no meaningful issues exist, still identify at least one residual risk, edge case, or test gap.
7. Write results to `reviews/pr-review-<branch>-<timestamp>.md`, creating the directory if needed. Use a `YYYYMMDD-HHmm` timestamp and overwrite an existing report for the same branch and timestamp.

Each finding is a short bullet starting with `file:line - short label:`. Prefer one sentence and no more than two short sentences. Include a one-line code example only when it clarifies the finding. Do not review unrelated files, offer style-only feedback, or fill the report with praise.

Use a reviewer distinct from the author when the environment makes one available. Model selection and tool availability are controlled by the environment; this skill cannot enforce them.

## Output contract

- Return only:
  - output path
  - counts by section
- The report contains only non-empty sections from this format:

```markdown
# PR Review - <branch>

## Issues
- ISSUE: `file:line - short label:` finding

## Concerns
- CONCERN: `file:line - short label:` finding

## Nitpicks
- NITPICK: `file:line - short label:` finding

## Suggestions
- SUGGESTION: `file:line - short label:` finding

## Praise
- PRAISE: `file:line - short label:` finding
```

## Non-negotiable rules

- Do not review unrelated files.
- Do not generate filler comments.
- Call out missing behavior coverage when behavior changes.
- Write the review to disk before reporting its path and section counts.
