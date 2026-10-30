---
description: "Investigate a defect, confirm its root cause, assess test gaps, and prepare BUGFIX.md"
name: "Bug Investigate"
argument-hint: "Issue key or bug details"
agent: "agent"
---
Investigate the reported defect: ${input:arg1}

This prompt is retained for Local-harness compatibility. In the Copilot harness, invoke `/bug-investigate` instead; the skill is the canonical workflow.

## Investigation only

- Retrieve the report through an available issue-tracker integration, or ask the user to paste the summary, reproduction steps, expected behavior, and actual behavior.
- Trace the actual code and test paths. Confirm the root cause before proposing a fix; do not implement changes.
- Assess relevant unit/component and, when available, end-to-end coverage. Explain the test gap and regression risks.
- Prepare `BUGFIX.md` with the complete template: Bug, Bug ID (if available), Steps to Reproduce, Expected Behaviour, Actual Behaviour, Root Cause, Existing Test Coverage, Regression Risks, and Fix Plan. Every fix step must contain `goal`, `files`, `tests`, `verify`, and `done_when`.
- Use exact commands discovered from the current repository. If tracker/e2e access or required details are unavailable, state the limitation and ask for the missing input; never fabricate it.
- Keep this reusable workflow generic. Do not copy company names, private endpoints, customer data, business operations, or internal identifiers into examples or `BUGFIX.md` templates.

## Output

Write or update `BUGFIX.md` and summarize the confirmed root cause, test gaps, fix scope, and remaining uncertainty. Do not implement the fix.