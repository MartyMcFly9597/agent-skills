---
name: shared-vue-testing-context
description: Apply shared Vue testing conventions when creating or reviewing component and integration tests.
user-invocable: false
---

# Skill: Shared Vue Testing Context

## Purpose

Provide repository-wide Vue testing conventions to be reused by testing and bug-fix skills.

## When to use

- Before any Vue test authoring or review.
- As a dependency context for Vue bug-fixing workflows.

## Context contract

- Use the consumer application's actual versions and test stack. Common examples include Vue 3, TypeScript, PrimeVue, Testing Library, and Playwright for end-to-end tests.
- Team expectations:
  - minimal diffs
  - black-box tests only
  - user-facing selectors first
  - avoid PrimeVue internals
- Prefer real interactions and observable outcomes over mocks that remove the behavior under test.
- For component/integration tests, use Testing Library's `render`; do not use `mount`.

## Preferred selector order

1. role
2. label text
3. placeholder text
4. visible text
5. stable test id when needed

## Output contract

- Any dependent skill should explicitly state it is following this context.
