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

Read and follow [workflow-execution](../workflow-execution/SKILL.md), applying its context and verification gate to `PLAN.md`.

1. Match `PLAN.md` to the story details and acceptance criteria. Map each criterion to implementation and meaningful test coverage; identify partial delivery.
2. Confirm e2e steps exist for user-facing acceptance criteria when an e2e environment is available.
3. Check frontend consistency with comparable screens, shared styles/tokens, and accessibility semantics. For Vue tests, read and follow [vue-testing](../vue-testing/SKILL.md).
4. For e2e steps, verify repository branch conventions, page-object/fixture reuse, visible behavior coverage, and whether the specific spec can run independently. If unavailable, state the gap and rationale.
5. Apply the shared evidence audit and return its gate verdict and findings.

## Output contract

- Use the shared gate report, identifying unmet acceptance criteria and missing or unavailable e2e coverage.

## Non-negotiable rules

- Do not pass user-facing work with missing e2e coverage unless the plan records a justified unavailable environment.

## Related skills

- Use `story-planner` to validate planning quality and `story-implementer` for step execution.
