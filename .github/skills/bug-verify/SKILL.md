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

Read and follow [workflow-execution](../workflow-execution/SKILL.md), applying its context and verification gate to `BUGFIX.md`.

1. Validate that `BUGFIX.md` describes the same defect and has a specific, code-supported root cause.
2. Check evidence that a regression test exercises the original failure, failed for the expected reason before the fix, and passes after it. An assumed or plausible pre-fix failure is not observed evidence.
3. Map each reported expectation to the changed path and tests. Reject partial remediation, symptom masking, and mocks that bypass the failure. Review related callers and shared state/data dependencies for causal completeness.
4. For Vue changes, read and follow [vue-testing](../vue-testing/SKILL.md), including its test-durability review gate.
5. Review residual regression risks and e2e coverage needed for visible behavior; explicitly report an unavailable environment.
6. Apply the shared evidence audit and return its gate verdict and findings.

## Output contract

- Use the shared gate report, including causal completeness, original-failure evidence, and residual risks.

## Non-negotiable rules

- Do not pass without a confirmed root cause, a meaningful reproducing test, regression-risk review, and current verification evidence.

## Related skills

- Use `bug-investigate` to establish root cause and `bug-fix` to execute the fix plan.
