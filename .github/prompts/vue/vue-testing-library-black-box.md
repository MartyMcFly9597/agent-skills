# Vue Testing Library Black-Box Tests

You are writing or improving tests for a Vue 3 + TypeScript SPA that uses PrimeVue.

## Mandatory rules

- Use `render` from `@testing-library/vue`.
- Do not use `mount`.
- Write black-box tests only.
- Test from the user's point of view.
- Prefer accessible queries:
  - `getByRole`
  - `getByLabelText`
  - `getByPlaceholderText`
  - `getByText`
- Use `findBy*` for async UI changes.
- Use `within(...)` when scoping is needed.
- Only use `data-testid` when no stable accessible selector exists.

## Avoid

- no testing of internal component state
- no testing of private methods
- no direct access to `vm`
- no brittle assertions on PrimeVue internal markup
- no shallow implementation assertions
- no giant snapshots
- no over-mocking that removes real behavior

## What to cover

Focus on observable behavior such as:

- rendered content
- loading states
- empty states
- enabled / disabled state
- validation messages
- emitted user-visible outcomes
- sorting, filtering, and selection behavior
- modal / popover open-close behavior
- error handling visible to the user

## Quality bar

A strong test:

- reads like a user scenario
- fails before the fix or feature
- passes after the change
- stays resilient to internal refactors

## Output style

When creating tests:

- keep them concise
- group related scenarios clearly
- prefer a few meaningful tests over many redundant ones
- include only necessary setup
- avoid comments unless they add real value

If existing tests are weak, replace or strengthen them instead of adding noise.
