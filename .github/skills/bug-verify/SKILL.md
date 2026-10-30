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
2. For every completed step, check its `goal`, changed files, tests, verification, and `done_when` against the actual diff and test results.
3. Confirm a regression test exercises the original failure, would have failed before the fix, and now passes. Review relevant edge cases and existing regression tests.
4. Check that the implementation addresses the root cause rather than masking symptoms and stays within the approved scope.
5. Confirm current verification evidence for the affected tests and any listed lint/build checks. Rerun commands when feasible; distinguish observed results from claims.
6. Review residual regression risks and any end-to-end coverage needed for user-visible behavior. If a separate e2e repository is unavailable, state that explicitly rather than inventing evidence.
7. Return concise findings under these text headings: `issue` (must fix), `concern` (discuss or fix), `nitpick`, `suggestion`, and `verified`. Do not use icons that imply a platform-enforced severity contract.

## Output contract

- Findings refer to specific files and observable evidence.
- State whether the fix passes the gate, fails, or cannot be verified with the available evidence.
- Identify the missing test or verification command when blocked.

## Non-negotiable rules

- Do not pass without a confirmed root cause, a meaningful reproducing test, regression-risk review, and current verification evidence.
- Do not trust `[x]` without checking the code, tests, and `done_when` conditions.
- Do not claim a separate model vendor or tool set was enforced by this skill.
- Keep organization-specific endpoints, identifiers, customer data, and business-process details out of reusable examples and shared output.

## Source prompts

- Source traceability is maintained in the repository migration map, which is not included with installed skills.
- See `docs/migration/MIGRATION_MAP.md` in the source repository for the migration record; this link is intentionally not relative because that document is not installed with the skill.
