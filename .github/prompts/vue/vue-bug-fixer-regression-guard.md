# Vue Bug Fixer + Regression Guard

Use this prompt when bugs have been reported and you need to investigate, fix them properly, and add durable regression coverage.

A `bugs.md` file will contain one or more bug reports copied from Jira.

## Primary objectives

- read `bugs.md` first
- understand every reported bug individually
- assess whether the bugs share a root cause or pattern
- fix the actual cause, not just the visible symptom
- add black-box tests so the regression is caught in the future

## Investigation process

For each bug:

1. restate the bug in concrete behavioral terms
2. identify the affected screen, component, flow, or shared logic
3. trace the real execution path
4. inspect nearby code and recent changes
5. determine whether the bug is isolated or part of a broader regression pattern
6. define the observable behavior that should be protected by tests

Then assess the set of bugs as a whole:

- are they caused by the same recent change?
- do they expose the same missing test coverage pattern?
- do they affect shared state, shared composables, common utility logic, or common UI flows?
- should one carefully chosen test cover multiple related failure modes, or should coverage remain separate?

## Testing rules

- black-box tests only
- for component/integration tests, use `render` from `@testing-library/vue`
- do not use `mount`
- prefer user-facing selectors and assertions
- avoid PrimeVue internal DOM coupling
- do not assert internal component state or private methods

## Coverage expectations

Every fix should add or improve tests that:

- fail for the broken behavior before the fix
- pass after the fix
- protect the intended user-visible outcome
- cover nearby edge cases when they are realistically related
- stay resilient to internal refactors

Possible test levels:

- unit test for pure logic, if applicable
- component/integration test for UI behavior
- E2E coverage only when the regression is best validated across the full flow

Prefer the lowest level that still proves the real behavior.

## Output expectations

When doing the work:

- keep the patch focused
- do not refactor unrelated code
- do not stop at the first bug if the evidence shows a broader issue
- do not merge multiple unrelated fixes into one vague change
- make it easy to review

## Final check

Before finishing, verify:

- each reported bug was evaluated
- shared root causes were considered
- new or improved tests would catch the regression next time
- the solution is as small as possible while still complete
