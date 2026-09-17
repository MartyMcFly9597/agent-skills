---
description: "Investigate a Jira bug, trace root cause, assess test gaps, and create BUGFIX.md"
name: "Bug Investigate"
argument-hint: "Jira bug key or URL"
agent: "agent"
---
Investigate this bug: ${input:arg1}

Follow [bug investigation spec](../../.codex/prompts/bug/investigate.md).
Model per [model policy](model-policy.md) — phase: bug investigation (Claude Sonnet 5, standard; escalate to Claude Opus 5 extended only if root cause resists two attempts). State your model first; stop if it mismatches.

Required output:
- Write BUGFIX.md with confirmed root cause, test gap analysis, and fix plan
- Provide concise summary of bug understanding, root cause evidence, and fix scope

Hard constraints:
- Investigation only (no implementation)
- Root cause must be confirmed by tracing code, not guessed
- Every fix step must include tests that reproduce the original bug
- Assess whether unit tests, e2e tests, or both are needed
