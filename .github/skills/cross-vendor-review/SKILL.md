---
name: cross-vendor-review
description: "Review the current branch using the strongest available code-review model from a different vendor than the implementation author. Use when an independent, read-only review of branch changes is requested."
argument-hint: "Optional: base branch, implementation model/vendor, scope, or re-review context"
disable-model-invocation: true
---

# Skill: Cross-Vendor Review

## Purpose

Request an independent, read-only code review of the current branch through a subagent whose model comes from a different vendor than the implementation author, then verify and report its findings.

## When to use

- User asks for an independent or cross-vendor review of the current branch before opening or merging a pull request.
- User asks to re-review a branch against previous review findings.

## Required inputs

- Git repository with branch changes to review.
- Optional user arguments: comparison base, implementation model/vendor, review scope, or a previous review to revisit.
- A harness that can invoke subagents with an explicit model. Model availability is controlled by the environment; this skill cannot enforce it.

## Procedure

### 1. Select the reviewer

- Establish which model vendor authored the implementation from explicit user input, trustworthy session context, or available model-routing/session metadata associated with the actual implementation turns. In Auto mode, investigate available metadata first rather than asking the user to identify the model. Read only the minimum relevant metadata; never expose credentials or unrelated session content. Git author names, email addresses, assistant branding, and a model's self-description do not establish the implementation vendor. Distinguish confirmed metadata from inference; do not treat the currently selected model as proof of who wrote earlier changes.
- Use the strongest available reasoning/code-review model from a DIFFERENT vendor. A different model from the same vendor is not independent for this purpose. For mixed-vendor implementations, choose a vendor outside the author set when available; otherwise explain the limitation.
- Discover available models through the platform's supported mechanism. If a model invocation returns an availability list, select from that list. Prefer a flagship reasoning model; do not assume version labels across vendors are a reliable strength ranking.
- Invoke the subagent with an explicit model selection. Announce the confirmed or inferred implementation vendor and selected reviewer model/vendor, including uncertainty when present.
- If authorship remains unknown after that investigation, proceed without blocking the user: request two strong reviewers from different vendors, in parallel when available. This provides vendor-diverse coverage without establishing that either specific reviewer differs from the implementation author; report that distinction honestly. Reconcile and verify their findings before presenting a combined result. If only one reviewer can be invoked, perform a clearly labeled best-effort review and disclose that cross-vendor independence could not be confirmed.

### 2. Establish the review state

- Read applicable repository instructions and check the current branch, HEAD SHA, working-tree status, and upstream/base reference.
- Use the user's base when supplied. Otherwise determine the branch's intended target from its PR or repository metadata and compare against the merge base. Do not assume the target is named main.
- Include branch commits plus staged, unstaged, and relevant untracked source/test changes. Preserve all existing work; do not checkout, stash, reset, pull, install dependencies, or modify files.
- Record the base SHA and reviewed HEAD SHA, and identify uncommitted changes explicitly. For a re-review, first check whether the branch moved since the previously reviewed SHA, then verify earlier findings against the current code.

### 3. Delegate the review

Give the reviewer the repository path, exact base and HEAD, dirty-tree scope, user requirements, applicable instructions, and prior findings when relevant. Require it to inspect the actual diff and nearby owning code/tests, including untracked files, rather than trusting the implementation summary.

State in the reviewer request that the reviewer must not edit files, commit, push, create branches, publish comments, or change external systems.

Prioritize correctness, security/privacy, data-loss risks, behavioral regressions, compatibility, concurrency, cleanup/error masking, and missing meaningful tests. Evaluate claims against actual control flow and contracts. Keep unrelated refactors and documented non-goals out of scope. Separate genuine defects from optional style preferences.

The reviewer may run existing focused, non-mutating checks only when they are known to be local and safe; no real-service calls, destructive tests, live notifications, dependency installs, or secret output. Follow repository-specific test safety rules. Never terminate a shared shell with exit or enable shell-wide fail-fast mode. When execution is unavailable, state that limitation and do not claim tests were run.

Request findings ordered by severity. Each actionable finding must include a precise file/line reference, triggering conditions or a concrete reproduction, the impact, and a minimal recommended correction. Ask explicitly whether blocking findings remain and which previous findings are resolved.

### 4. Verify the findings

- Independently verify substantive reviewer claims against current source or a cheap safe reproduction before presenting them as confirmed. Label anything not established as unverified; do not invent defects to fill a review quota.
- Check that the reviewed branch/HEAD and relevant working-tree content have not changed during the review. If they changed, identify the uncovered delta and request a targeted follow-up before claiming the final state was reviewed.

## Output contract

Return the findings and recommended next action in this structure:

1. **Findings:** severity-ranked confirmed issues with file/line links; clearly separate optional suggestions and unverified concerns. Say explicitly when no actionable issues were found.
2. **Review Scope:** reviewer model/vendor (or both reviewers), confirmed/inferred/unknown implementation vendor and the evidence available, branch, base/HEAD SHAs, and included uncommitted changes.
3. **Verification:** checks actually run, results, execution limitations, and residual risks.
4. **Readiness:** ready for PR, ready with non-blocking follow-ups, or changes required, with a brief reason. Static review alone does not prove tests pass.

## Non-negotiable rules

- Review only: do not implement fixes automatically.
- Neither this workflow nor the reviewer may edit files, commit, push, create branches, publish comments, or change external systems. Publish nothing without explicit authorization.
- Never silently claim a same-vendor or unknown-vendor review is confirmed independent.
- Keep private organization names, internal tickets, domains, report links, credentials, and proprietary snippets out of any proposed public-facing text. Use ACME and synthetic examples where placeholders are needed.

## Related skills

- [pr-review](../pr-review/SKILL.md) writes a severity-labeled diff review report to disk; use it when a saved report is needed rather than a delegated cross-vendor review.
