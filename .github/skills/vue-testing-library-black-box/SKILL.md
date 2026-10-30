---
name: vue-testing-library-black-box
description: Write resilient Vue component tests with Testing Library using accessible selectors and observable behavior.
argument-hint: "Component or behavior to test"
disable-model-invocation: true
---

# Skill: Vue Testing Library Black-Box

## Purpose

Create resilient Vue tests using Testing Library from the user perspective.

## When to use

- Writing or improving Vue component or integration tests.

## Required inputs

- Vue 3 + TypeScript code under test.
- Existing test harness and dependencies.

## Procedure

1. Use `render` from `@testing-library/vue`; do not use `mount`.
2. Write a concise user scenario that observes rendered content, loading/empty states, enabled/disabled state, validation messages, visible outcomes, sorting/filtering/selection, modal behavior, and visible error handling as relevant.
3. Prefer selectors in this order: role, label, placeholder, visible text, then a stable test id only when no accessible selector exists.
4. Use `findBy*` for async UI behavior and `within(...)` when scoping queries.
5. Keep setup minimal; avoid large snapshots, over-mocking, internal state/private-method assertions, and implementation-coupled selectors.

## Output contract

- Provide test updates that are concise, black-box, and stable under internal refactors.
- For regression fixes, verify the new test fails against the unfixed behavior before applying the fix, then passes afterward.

## Non-negotiable rules

- No `mount`.
- No internal state or private method assertions.
- No brittle PrimeVue internal DOM coupling.
- Tests must protect observable behavior and remain resilient to internal refactors.
