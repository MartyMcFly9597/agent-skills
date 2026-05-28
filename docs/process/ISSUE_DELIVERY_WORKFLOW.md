# Issue-Driven Delivery Workflow

This repository uses one branch and one pull request per issue.

## Branch Naming

Use this format:

- `issue-<number>-<short-scope>`

Examples:
- `issue-2-migrate-story-workflow-skills`
- `issue-4-quality-gate-review-loop`

## PR Rules

- Every PR should target one issue only.
- PR title should include issue number in parentheses.
- PR body must include:
  - summary of changed files
  - verification evidence
  - `Closes #<issue>`

## Merge Sequence

1. Create branch from latest `main`.
2. Implement only issue scope.
3. Run verification commands.
4. Push branch and open PR.
5. Request/perform review.
6. Merge PR.
7. Delete branch.
8. Start next issue from updated `main`.

## Required Evidence

At minimum include:

- commit hash
- branch name
- command outputs used as verification
- explicit statement of remaining risk (if any)

## Handling Review Feedback

- Apply requested changes only if in-scope for current issue.
- If feedback is out-of-scope but valuable, create a follow-up issue.
- Update PR description or comments with what changed after feedback.
