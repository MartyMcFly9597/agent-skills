---
name: bug-verify
description: Independently assess whether a bug fix addresses its confirmed root cause, includes a reproducing regression test, and has current verification evidence. Use as the final gate for a BUGFIX.md workflow.
argument-hint: "Issue key or BUGFIX.md"
disable-model-invocation: true
---

# Bug Verification

## Purpose

Provide a strict, evidence-based review of a completed bug-fix workflow. Do not assume the implementer's claims or checklist status are correct.

## When to use

- A bug-fix step or full `BUGFIX.md` workflow is ready for independent verification.
- Completed checklist items need to be audited before the change is accepted.

## Required inputs

- `BUGFIX.md` and the bug details from an available issue-tracker integration or the user's supplied report.
- The implementation diff and tests.
- Fresh verification output or commands that can be rerun.

If critical context or evidence is unavailable, report the gap; do not infer a pass.

## Procedure

1. Validate that `BUGFIX.md` describes the same defect and has a specific, code-supported root cause.
2. For every completed step, check its `goal`, changed files, tests, verification, and `done_when` against the actual diff and results.
3. Confirm a regression test exercises the original failure, plausibly fails before the fix, and passes after. Review relevant edge cases and existing coverage.
4. Check that the implementation addresses the root cause rather than masking symptoms and stays within the approved scope.
5. Confirm current evidence for affected tests and applicable lint/build checks. Rerun commands when feasible; distinguish observed results from claims.
6. Review residual regression risks and end-to-end coverage needed for user-visible behavior. If the required e2e environment is unavailable, state that explicitly.
7. Use a reviewer distinct from the author when available. A different model family can add independence when available; the environment controls model choice.
8. Return concise findings under `issue`, `concern`, `nitpick`, `suggestion`, and `verified`. State whether the fix passes, fails, or cannot be verified.

## Output contract

- Findings refer to specific files and observable evidence.
- State whether the fix passes the gate, fails, or cannot be verified with the available evidence.
- Identify the missing test or verification command when blocked.

## Non-negotiable rules

- Do not pass without a confirmed root cause, a meaningful reproducing test, regression-risk review, and current verification evidence.
- Do not trust `[x]` without checking the code, tests, and `done_when` conditions.
- Do not claim a separate model vendor or tool set was enforced by this skill.
- Keep organization-specific endpoints, identifiers, customer data, and business-process details out of reusable examples and shared output.

## Related skills

- Use `bug-investigate` to establish root cause and `bug-fix` to execute the fix plan.
