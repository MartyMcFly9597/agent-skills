---
name: story-verifier
description: Independently verify a completed story against PLAN.md, its acceptance criteria, tests, and current evidence. Use as the final gate before accepting story work.
argument-hint: "Story key or PLAN.md"
disable-model-invocation: true
---

# Story Verifier

## Purpose

Provide a strict, evidence-based gate review of story implementation, tests, regression risk, and plan completion.

## When to use

- A planned story has been implemented and needs objective verification.
- Completed checklist items need a fresh audit before acceptance.

## Required inputs

- `PLAN.md`.
- Story details from an available issue-tracker integration, or pasted by the user.
- Application changes, tests, and current verification output or rerunnable commands.
- Optional separate e2e repository when the plan includes `repo: e2e` steps.

If required evidence is missing, report that gap rather than assuming success.

## Procedure

1. Validate that `PLAN.md` is present and matches the supplied story details.
2. Check that steps are small and have concrete `goal`, `files`, `tests`, `verify`, and `done_when` fields. Confirm e2e steps exist for user-facing acceptance criteria when an e2e environment is available.
3. For each completed `[x]` step, compare the code, tests, verification evidence, and any claimed commit with the step's `done_when`.
4. Review the diff for scope alignment, unintended behavior changes, reuse of established patterns, and unnecessary refactoring.
5. Check unit/component test quality, meaningful regression cases, and test-layer choice.
6. For e2e steps, verify repository branch conventions, reuse of page objects/fixtures, coverage of visible user behavior, and whether the specific spec can run independently. If e2e is unavailable, state the gap and rationale.
7. Check unit, component, end-to-end, lint, style-lint, and build evidence as relevant to the change. Confirm commands are current and actually passed; rerun when feasible and distinguish observed results from claims.
8. Use a reviewer distinct from the author when the environment makes one available. A different model family can add independence when available; the environment controls model choice.
9. Return concise findings under text headings: `issue` (must fix), `concern` (should fix or discuss), `nitpick`, `suggestion`, and `verified`.

## Output contract

- State whether the plan passes, fails, or cannot be verified with available evidence.
- Reference concrete files and evidence; do not trust `[x]` without proof.
- Call out missing tests, stale/missing verification, or unresolved regression risks.

## Non-negotiable rules

- No pass without current verification evidence.
- No pass when the plan is out of sync or a completed step fails its `done_when`.
- Do not pass user-facing work with missing e2e coverage unless the plan records a justified unavailable environment.
- Model and tool availability are controlled by the execution environment; this skill does not enforce them.
- Keep review examples and shared output free of organization identifiers, private endpoints, customer data, and business-specific operational details.

## Related skills

- Use `story-planner` to validate planning quality and `story-implementer` for step execution.
