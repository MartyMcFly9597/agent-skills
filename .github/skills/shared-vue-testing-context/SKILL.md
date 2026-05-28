# Skill: Shared Vue Testing Context

## Purpose

Provide repository-wide Vue testing conventions to be reused by testing and bug-fix skills.

## When to use

- Before any Vue test authoring or review.
- As a dependency context for Vue bug-fixing workflows.

## Context contract

- Stack:
  - Vue 3
  - TypeScript
  - PrimeVue
  - Testing Library
  - Playwright for E2E
- Team expectations:
  - minimal diffs
  - black-box tests only
  - user-facing selectors first
  - avoid PrimeVue internals

## Preferred selector order

1. role
2. label text
3. placeholder text
4. visible text
5. stable test id when needed

## Output contract

- Any dependent skill should explicitly state it is following this context.

## Source prompt

- `.codex/prompts/vue/vue-testing-shared-context.md`
