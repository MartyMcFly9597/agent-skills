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
4. Check tests for completed steps and regression coverage.
5. Confirm verification evidence is present and current.
6. Flag unsupported checklist completion.

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

## Source prompts

- `.codex/prompts/story/verify.md`
- `.codex/prompts/story-agent.md`
