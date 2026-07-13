# Skill: Story Verifier

## Purpose

Gate story completion by validating plan integrity, implementation quality, test strength, and verification evidence.

## When to use

- A planned story has been implemented and needs objective validation.
- Completed checklist items need audit.

## Required inputs

- `PLAN.md`.
- Jira story details.
- Code and tests in repository.
- Verification logs or rerunnable commands.

## Procedure

1. Validate `PLAN.md` exists and matches Jira story.
2. Confirm each completed step has clear `goal`, `files`, `tests`, `verify`, `done_when`.
3. Audit code changes against story scope and patterns.
4. Check unit tests for completed SPA steps and regression coverage.
5. Check e2e tests exist for user-facing acceptance criteria.
6. Verify e2e branch exists and matches SPA branch name.
7. Confirm verification evidence is present and current.
8. Flag unsupported checklist completion.

## Output contract

- Group concise findings by severity:
  - issue: must fix
  - concern: should fix or discuss
  - nitpick: minor
  - suggestion: improvement
  - verified: good

## Non-negotiable rules

- Do not pass without verification evidence.
- Do not trust checklist completion without code and test proof.
- Do not pass user-facing stories without e2e coverage.

## Source prompts

- `.codex/prompts/story/verify.md`
- `.codex/prompts/story-agent.md`
