# Skill: Story Implementer

## Purpose

Execute `PLAN.md` one step at a time with tests and verification before marking completion.

## When to use

- `PLAN.md` exists and implementation is ready.
- Controlled incremental execution is required.

## Required inputs

- Valid `PLAN.md`.
- Repository codebase.
- Jira story access for validation.

## Procedure

1. Read and validate `PLAN.md` against Jira story.
2. Resume at first unchecked step.
3. For each step:
  - implement minimal safe change
  - add or update tests
  - run step verification commands
  - confirm all `done_when` items
  - mark `[x]` only after evidence
4. Commit completed step before starting next step.

## Output contract

- For each run report:
  - resumed or next step
  - what changed
  - tests updated
  - exact verification commands and results
  - whether step was marked complete
  - whether step commit was created

## Non-negotiable rules

- One step at a time.
- Never skip tests.
- Never skip verification.
- Never mark completion early.

## Source prompts

- `.codex/prompts/story/implement.md`
- `.codex/prompts/story-agent.md`
