---
name: story-implementer
description: Execute the next incomplete PLAN.md story step with focused tests and verification. Use when an approved plan is ready for implementation or needs a careful resume.
argument-hint: "Story key or PLAN.md"
disable-model-invocation: true
---

# Story Implementer

## Purpose

Execute a valid `PLAN.md` one step at a time, with tests and verification before completion.

## When to use

- A story has a valid `PLAN.md` and implementation is ready to begin.
- Controlled incremental execution or a safe resume is required.

## Required inputs

- Valid `PLAN.md`.
- Current application repository.
- Story details from an available issue-tracker integration, or pasted by the user, when needed to validate plan scope.
- Optional separate e2e repository when a step declares `repo: e2e`.

## Procedure

Read and follow [workflow-execution](../workflow-execution/SKILL.md), applying its context and step execution rules to `PLAN.md`.

1. Match the plan to the supplied story details. If missing or invalid, return to planning rather than improvising an implementation plan.
2. If `repo: e2e` is specified, use the separate e2e repository; otherwise use the application repository. Confirm branch conventions in each repository.
3. For frontend work, inspect a comparable screen or component. Reuse layout, shared styles/tokens, component patterns, and accessibility semantics; record necessary deviations in `PLAN.md`.
4. Follow repository documentation conventions for public APIs. Add comments only for non-obvious intent or constraints.
5. Add tests for the step's acceptance criteria and relevant regression risks. For bug-fix work, observe a reproducing test fail before implementation. For Vue component tests, read and follow [vue-testing](../vue-testing/SKILL.md).
6. For e2e work, reuse the repository's page objects, fixtures, helpers, and spec conventions. Exercise actual visible interactions and discover the command for the specific spec.
7. Complete the selected step under the shared verification, checkpoint, and reporting rules.

## Output contract

- Use the shared step report, including acceptance-criteria coverage and any e2e gap.

## Non-negotiable rules

- Implementation must remain aligned with the story's acceptance criteria and selected plan step.

## Related skills

- Use `story-planner` to prepare a plan and `story-verifier` to review completion evidence.
