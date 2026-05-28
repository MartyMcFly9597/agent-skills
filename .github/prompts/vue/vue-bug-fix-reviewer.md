# Vue Bug Fix Review Checker

Use this prompt to review a proposed bug fix and judge whether it is actually strong enough.

A `bugs.md` file contains the reported bug descriptions.

## Review goals

Check whether the proposed fix:
- addresses the real cause
- covers each reported bug
- considers shared regression patterns
- includes strong enough tests
- avoids brittle or implementation-coupled coverage

## Review process

1. read `bugs.md`
2. map each bug to the changed code
3. identify whether any bug was only partially addressed
4. assess whether the fix is too narrow
5. inspect the tests and determine whether they would have failed before the fix
6. check whether the tests are black-box and resilient

## Reject weak fixes

Call out issues such as:
- symptom-only fixes
- no regression tests
- tests that assert internals instead of behavior
- tests coupled to PrimeVue implementation DOM
- missing coverage for nearby related paths
- one bug fixed while another likely remains

## Testing standard

For Vue component/integration tests:
- prefer `render` from `@testing-library/vue`
- black-box only
- accessible selectors first
- no `mount`
- no fragile internal markup assertions unless deliberately exposed as stable contract

## Output style

Return concise bullet points grouped by severity:

- issue: must fix before merge
- concern: should fix or discuss
- praise: optional and minimal

Keep each point tight and specific.
