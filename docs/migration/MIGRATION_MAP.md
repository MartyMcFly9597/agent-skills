# Skill and Prompt Migration Map

## Purpose

This map records where reusable workflows came from, which Copilot skill owns each workflow, and what remains available only for Local-harness compatibility. Source paths are repository-relative labels; the external consumer checkout is intentionally unnamed.

## Copilot Conversion Rules

- Copilot harness sessions use skills as reusable workflows. Prompt files remain available to Local-harness sessions but are not Copilot harness entrypoints.
- Each skill has a `SKILL.md` with `name` matching its folder and a `description` that states what it does and when to use it.
- `argument-hint` carries over as the slash-command input hint. Prompt input placeholders become instructions to supply those arguments after the skill command.
- Explicit workflows use `disable-model-invocation: true` so they run only when the user invokes them.
- Prompt `agent`, `model`, and `tools` metadata is not carried into the skill. Skills do not enforce model selection or tool allow-lists. Configure those separately only when the consuming environment supports them.
- Skills are installed into `.github/skills/<skill-name>/SKILL.md`. Local-only prompt files are installed under `.github/prompts/` when requested.

Official references: VS Code documentation, “Convert prompt files to skills” and “SKILL.md file format.”

## Workflow Phases

| Skill | Phase | External consumer source path (checkout name omitted) | Repository-local source path | Local-only prompt entrypoint | Copilot entrypoint | Fields mapped | Fields not transferable | Generic prerequisites | Origin | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `story-planner` | Story planning | `.codex/prompts/story/plan.md`, `.codex/prompts/story-agent.md` | `.github/prompts/story/plan.md` | `.github/prompts/story/plan.md` (Local only) | `/story-planner` | Display name, description, argument hint, explicit invocation | Agent, model, tools | Issue-tracker read access; optional separate e2e repository | #2 / PR #7 | Reconciled |
| `story-implementer` | Story implementation | `.codex/prompts/story/implement.md`, `.codex/prompts/story-agent.md` | `.github/prompts/story/implement.md` | `.github/prompts/story/implement.md` (Local only) | `/story-implementer` | Display name, description, argument hint, explicit invocation | Agent, model, tools | Existing plan; issue-tracker read access; optional separate e2e repository | #2 / PR #7 | Reconciled |
| `story-verifier` | Story verification | `.codex/prompts/story/verify.md`, `.codex/prompts/story-agent.md` | `.github/prompts/story/verify.md` | `.github/prompts/story/verify.md` (Local only) | `/story-verifier` | Display name, description, argument hint, explicit invocation | Agent, model, tools | Existing plan and implementation evidence; optional separate e2e repository | #2 / PR #7 | Reconciled |
| `bug-investigate` | Bug investigation | `.codex/prompts/bug/investigate.md` | `.codex/prompts/bug/investigate.md` | `.github/prompts/bug-investigate.prompt.md` | `/bug-investigate` | Name, description, argument hint, user-supplied issue key or URL | Agent, model, tools | Issue-tracker read access or user-provided bug details; optional e2e repository | #15 | Added |
| `bug-fix` | Bug fix implementation | `.codex/prompts/bug/fix.md` | `.codex/prompts/bug/fix.md` | `.github/prompts/bug-fix.prompt.md` | `/bug-fix` | Name, description, argument hint, user-supplied issue key or URL | Agent, model, tools | Valid `BUGFIX.md`; repository test commands and write access | #15 | Added |
| `bug-verify` | Bug verification | `.codex/prompts/bug/verify.md` | `.codex/prompts/bug/verify.md` | `.github/prompts/bug-verify.prompt.md` | `/bug-verify` | Name, description, argument hint, user-supplied issue key or URL | Agent, model, tools | `BUGFIX.md`, changed code, and fresh verification evidence | #15 | Added |

The command examples and issue details are supplied by the consuming workspace. They are not included in this repository. Local prompt files are compatibility entrypoints only; their instructions must not depend on uninstalled source files.

## Related, Separate Skills

The Vue regression guard, Vue bug-fix reviewer, shared Vue testing context, and black-box Vue testing skills remain separate framework-specific guidance. They do not replace the tracker-driven `bug-investigate` → `bug-fix` → `bug-verify` workflow.

## Supporting Sources

Issue #16 appends reviewed supporting prompt, skill, instruction, and agent dispositions here. This is the only migration map.

| Source path | Disposition | Target or reason | Dependencies / install notes | Public-safety review |
| --- | --- | --- | --- | --- |

## Public-Safety Review

The implementation PR records file-and-line categories and dispositions only. Do not copy private matches, internal identifiers, source checkout names, or deny-list terms into this map or PR notes.