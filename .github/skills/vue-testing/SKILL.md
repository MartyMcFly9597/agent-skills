---
name: vue-testing
description: Use when authoring or reviewing Vue component and integration tests, including UI regression tests, asynchronous interactions, and component-library boundaries.
user-invocable: false
---

# Vue Testing

## Required Context

Inspect the consuming application's Vue version, test harness, existing tests, plugins, and component library. Do not assume PrimeVue or any particular version is installed. Discover commands from that repository.

For new component/integration coverage, use `render` from `@testing-library/vue`, not `mount`. If Testing Library is absent, surface that prerequisite and agree on a scoped harness change; do not silently rewrite the existing test suite or substitute internal-state assertions.

## Authoring Procedure

1. State the observable scenario and choose its boundary: unit tests for isolated logic, component/integration tests for UI behavior, e2e when routing, browser behavior, or a full cross-page flow is essential.
2. Reuse the repository's render setup, real plugins, fixtures, and interaction helpers. Keep fixtures focused. Mock external boundaries when needed, but preserve the state transitions and response shapes implicated in the behavior.
3. Query by role and accessible name, then label, placeholder, visible text, and finally a stable test id when no suitable accessible query exists. Use `within` to scope repeated content. Where missing semantics are an accessibility defect, address them in scope rather than hiding the defect with a selector.
4. Exercise user interactions and assert visible outcomes. Cover loading, empty, disabled, validation, selection, dismissal, and error states only where relevant to the scenario.
5. Await interactions and use `findBy*` for elements that appear asynchronously. Use retrying assertions for eventual state and disappearance helpers for removal. Avoid fixed sleeps and assertions that merely confirm a mock was called instead of the user-visible result.
6. For teleported overlays, query the actual rendered document or accessible dialog, not only the component container. Follow harness cleanup conventions and await opening/closing transitions. Do not select component-library private DOM or CSS classes, including PrimeVue internals when present.
7. For defects, observe the regression test fail for the expected reason against unfixed behavior, then pass after the fix. For causally related reports, cover shared and distinct paths without duplicating unrelated cases.
8. Run the focused tests and relevant neighboring coverage. Report exact commands, outcomes, and any browser/e2e gaps.

## Concrete Boundary

For a save interaction, find the button with `getByRole('button', { name: 'Save' })`, interact through the repository's user-event helper, then await the visible saved state. Do not assert `wrapper.vm.saving`, invoke a private save method, or locate `.p-button` to prove the same behavior.

## Review Gate

- Reject private method/state assertions, broad snapshots used instead of behavior assertions, and fragile component-library selectors.
- Reject stubs or mocks that bypass the original failure path, timing, validation, or state dependency. A passing test that cannot detect the original defect is not regression coverage.
- Check that asynchronous assertions wait for the intended outcome, rather than passing on an initially absent element before the interaction completes.
- Check partial fixes and realistic related paths: a shared helper fix must protect relevant callers; separate causes need separate coverage.
- Report causal gaps and test fragility as findings with files and evidence. Do not require praise or claim tests ran without observed results.