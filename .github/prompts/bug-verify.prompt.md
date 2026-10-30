---
description: "Verify BUGFIX.md root cause, regression tests, scope, and current evidence"
name: "Bug Verify"
argument-hint: "Issue key or BUGFIX.md"
agent: "agent"
---
Verify the completed bug fix: ${input:arg1}

This prompt is retained for Local-harness compatibility. In the Copilot harness, invoke `/bug-verify` instead; the skill is the canonical workflow.

## Gate review

- Validate `BUGFIX.md` against the supplied report and confirm the root cause is specific and supported by the code path.
- Check that the fix addresses the root cause, stays in scope, and includes a regression test that would have failed before the fix.
- Review relevant edge cases, existing tests, and regression risk.
- Confirm the listed verification evidence is current; rerun commands when feasible and distinguish observed results from claims.
- Review e2e coverage for user-visible behavior when an e2e environment is available. If unavailable, state the gap and reason.
- Do not pass incomplete steps or trust `[x]` without evidence.

## Output

Return concise findings under: `issue` (must fix), `concern`, `nitpick`, `suggestion`, and `verified`. State whether the fix passes, fails, or cannot be verified. Do not claim a reviewer model or tool restriction was enforced.