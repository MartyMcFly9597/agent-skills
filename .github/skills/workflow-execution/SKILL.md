---
name: workflow-execution
description: Shared rules used when planning, executing, or verifying PLAN.md and BUGFIX.md workflows across application repositories.
user-invocable: false
---

# Workflow Execution

## Scope and Context

Apply the section for the current phase only. Planning does not authorize implementation; verification does not authorize fixes or advancing the checklist.

- Read the consuming repository's instructions and relevant app-family skills. Identify the actual stack, test harness, branch conventions, and any separate repositories. Never assume a framework, tracker, component library, or e2e layout from the skill's origin.
- Load an app-family skill only when its description and repository evidence match the target. Shared phase workflows remain responsible for orchestration; app-family skills supply applicable conventions. Surface conflicting requirements instead of silently choosing one.
- Record selected app-family and technology skills, with their repository-relative paths, in the plan's context section. On resume or review, read those skills and confirm applicability against the current repository. If no extra skills apply, state that rather than inventing a profile.
- Obtain missing issue details or repository access from the user. Do not invent requirements, commands, environments, or verification results.
- Keep reusable guidance and shared examples free of organization identifiers, private endpoints, customer data, and business-operation details.
- Skills do not enforce model choice or tool permissions. Optional plan model hints are informational; availability is controlled by the environment.

## Planning Contract

1. Validate an existing plan against the current request and code. Preserve valid completed and pending steps; replace an unrelated or invalid plan only with an explanation.
2. Keep steps small and independently testable where practical. Each needs `goal`, `files`, `tests`, `verify`, and objective `done_when` fields. Identify the owning repository when work spans repositories.
3. Discover executable test and verification commands from repository manifests or docs. Record unavailable environments and coverage gaps instead of inventing commands.

## Step Execution

1. Validate the plan and work in the repository and branch owning the step. Select the first unchecked `[ ]` step; execute only that step per invocation, even in a multi-context plan.
2. Inspect code and tests against its `done_when` before editing. If already satisfied, verify it without creating unnecessary changes. Otherwise make the smallest scoped change and add meaningful tests; avoid unrelated refactors.
3. Run every listed test and verification command, plus relevant regression checks. Repair failures within the current step and rerun the same checks. Report unrelated failures or unavailable prerequisites without claiming completion.
4. Mark `[x]` only when all `done_when` conditions and required checks are met. Record exact commands, results, and remaining gaps. Never skip or advance to the next incomplete step in this invocation.
5. Commit only when permitted by the user's request and repository contribution workflow, in the repository where files changed. Report the step, repository, changes, tests, verification, completion status, and commit status.

## Verification Gate

1. Validate the plan's identity, structure, and scope. Audit every completed `[x]` against the actual code, tests, `done_when`, and any claimed commit; checklist status alone is not evidence.
2. Review scope, unintended behavior changes, established patterns, meaningful test boundaries, and residual regression risk. Check affected tests and applicable lint, style-lint, build, and e2e evidence.
3. Rerun commands when feasible. Distinguish current observed results from author claims; report missing, stale, or unavailable evidence. Do not pass an out-of-sync plan or a completed step with unmet conditions.
4. Use a reviewer distinct from the author when available; a different model family can add independence. Do not claim independence or execution that was unavailable.
5. Return findings under `issue`, `concern`, `nitpick`, `suggestion`, and `verified`, with concrete files and evidence. State `pass`, `fail`, or `cannot verify`; identify the missing check when blocked.
	Use `fail` for an established unmet requirement, `cannot verify` when evidence is insufficient without an established violation, and `pass` only when all applicable gates are met. Report evidence gaps even when another defect already makes the verdict `fail`.