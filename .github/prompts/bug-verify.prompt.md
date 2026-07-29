---
description: "Strictly verify BUGFIX.md progress, root cause validity, and test coverage"
name: "Bug Verify"
argument-hint: "Jira bug key or URL"
agent: "agent"
---
Verify fix quality for this bug: ${input:arg1}

Follow [bug verification spec](../../.codex/prompts/bug/verify.md).

Required checks:
- BUGFIX.md integrity and root cause accuracy
- Fix correctness against root cause
- Test coverage: tests must reproduce the original bug
- Regression safety
- Verification evidence freshness

Output format:
- 🚫 issue: must fix
- ⚠️ concern: should fix or discuss
- ⛏️ nitpick: minor
- 💡 suggestion: improvement
- ✅ verified: good
