# Skill: Vue Testing Library Black-Box

## Purpose

Create resilient Vue tests using Testing Library from the user perspective.

## When to use

- Writing or improving Vue component or integration tests.

## Required inputs

- Vue 3 + TypeScript code under test.
- Existing test harness and dependencies.

## Procedure

1. Use `render` from `@testing-library/vue`.
2. Write behavior-oriented scenarios with accessible queries first.
3. Use `findBy*` for async UI behavior.
4. Use `within(...)` when scoping is needed.
5. Use `data-testid` only when no stable accessible selector exists.
6. Keep setup minimal and focused on observable behavior.

## Output contract

- Provide test updates that are concise, black-box, and stable under internal refactors.

## Non-negotiable rules

- No `mount`.
- No internal state or private method assertions.
- No brittle PrimeVue internal DOM coupling.

## Source prompt

- `.codex/prompts/vue/vue-testing-library-black-box.md`
