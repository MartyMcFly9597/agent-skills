# Skill: Story Planner

## Purpose

Create or update `PLAN.md` for a Jira story with small, testable, committable steps.

## When to use

- A story needs implementation planning before coding.
- Existing `PLAN.md` must be validated or refined.

## Required inputs

- Jira story accessible through MCP.
- Repository codebase.
- Optional existing `PLAN.md`.

## Procedure

1. Retrieve story details from Jira.
2. Inspect affected code paths and tests.
3. Validate existing `PLAN.md` against current story and codebase.
4. Preserve valid completed steps.
5. Create or refine incremental steps with explicit `tests`, `verify`, and `done_when`.
6. Save plan to `PLAN.md`.

## Output contract

- Provide concise summary:
  - story understanding
  - key risks
  - impacted areas
  - plan overview
  - whether resumed or rebuilt

## Non-negotiable rules

- No implementation code changes.
- No large or vague steps.
- No missing verification commands.

## Source prompts

- `.codex/prompts/story/plan.md`
- `.codex/prompts/story-agent.md`
