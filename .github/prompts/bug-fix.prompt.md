---
description: "Execute the next incomplete step from BUGFIX.md for a Jira bug"
name: "Bug Fix"
argument-hint: "Jira bug key or URL"
agent: "agent"
---
Execute fix for this bug: ${input:arg1}

Follow [bug fix spec](../../.codex/prompts/bug/fix.md).

Required behavior:
- Execute one BUGFIX.md step at a time
- Write failing test first, then apply minimal fix
- Run step verification commands
- Mark step complete only when done_when is satisfied
- Update BUGFIX.md status accordingly

Hard constraints:
- Do not skip steps
- Do not skip tests or verification
- Test-first: write the reproducing test before the fix
- Do not recreate BUGFIX.md unless missing or invalid
