# Shared Vue Testing Context

Use this context when working on tests in this repository.

## Stack

- Vue 3
- TypeScript
- PrimeVue
- Testing Library for component/integration tests
- Playwright for E2E

## Team preferences

- minimal diffs
- black-box tests only
- `render` from `@testing-library/vue`
- user-facing selectors first
- avoid PrimeVue internal DOM coupling
- test behavior, not implementation details

## Preferred selector order

1. role
2. label text
3. placeholder text
4. visible text
5. stable test id only when needed

## General expectations

- understand existing patterns before changing them
- do not introduce large refactors for a small test task
- keep tests maintainable and readable
- prioritize regression protection over volume
