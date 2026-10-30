---
description: "Execute the next verified BUGFIX.md step with a reproducing test and minimal fix"
name: "Bug Fix"
argument-hint: "Issue key or BUGFIX.md"
agent: "agent"
---
Execute the next incomplete step for this defect: ${input:arg1}

This prompt is retained for Local-harness compatibility. In the Copilot harness, invoke `/bug-fix` instead; the skill is the canonical workflow.

## Before execution

- Read and validate `BUGFIX.md` against the supplied issue details. Re-read the identified code path to confirm the stated cause.
- If `BUGFIX.md` is missing or invalid, stop and request the investigation workflow; do not silently invent a plan.
- Find the first unchecked `[ ]` step and execute only that step.

## Test-first execution

1. Write a focused test that reproduces the reported behavior.
2. Run it before changing implementation code and confirm it fails for the expected reason.
3. Apply the smallest safe change that addresses the confirmed root cause.
4. Run the reproducing test and relevant regression tests, then run all listed verification commands.
5. Re-read `done_when`; mark `[x]` only after all conditions and checks pass. Record exact commands and results.
6. Stop after the current step. Keep the change commit-ready and commit only if the repository workflow allows it.

Do not skip tests or verification, refactor unrelated code, or copy organization-specific identifiers, private endpoints, customer data, or business-operation details into shared examples.