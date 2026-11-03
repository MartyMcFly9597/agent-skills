# Skill Migration Map

## Purpose

This map records source material consolidated into canonical Copilot skills. Prompt paths are historical provenance only; this repository maintains and ships skills, not prompt files.

## Conversion

- Workflow instructions are maintained in `.github/skills/<name>/SKILL.md` and invoked by skill name.
- The installer copies skills to `<workspace>/.github/skills`; no prompt files are maintained, packaged, or installed.
- Names, descriptions, argument guidance, and useful workflow requirements from historical sources were consolidated into skills.
- Legacy `agent`, `model`, and `tools` metadata was not transferred to skills. Custom instructions can express project guidance, but they do not configure or enforce those settings.
- If a future workflow requires harness-supported model or tool configuration, use a custom agent in `.github/agents`. Model availability remains environment-controlled; skill hints are informational, and review skills recommend a distinct reviewer/model family when available.

Official references: VS Code documentation, “Convert prompt files to skills” and “SKILL.md file format.”

## Workflow Sources

| Phase / origin | Historical source material | Canonical skill / Copilot invocation | Enforcement limitation | Install target | Prerequisites and app limits |
| --- | --- | --- | --- | --- | --- |
| `story-planner` / #2, PR #7 | `.codex/prompts/story/plan.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/plan.md` | `.github/skills/story-planner/SKILL.md` / `/story-planner` | Explicit invocation via skill metadata; skill text cannot select models or enforce tools | `<workspace>/.github/skills/story-planner/SKILL.md` | Issue details or tracker integration; e2e strategy depends on the consuming app |
| `story-implementer` / #2, PR #7 | `.codex/prompts/story/implement.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/implement.md` | `.github/skills/story-implementer/SKILL.md` / `/story-implementer` | Explicit invocation via skill metadata; skill text cannot select models or enforce tools | `<workspace>/.github/skills/story-implementer/SKILL.md` | Approved `PLAN.md`, repository test/build commands, and app-specific conventions |
| `story-verifier` / #2, PR #7 | `.codex/prompts/story/verify.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/verify.md` | `.github/skills/story-verifier/SKILL.md` / `/story-verifier` | Explicit invocation via skill metadata; skill text cannot select models or enforce tools | `<workspace>/.github/skills/story-verifier/SKILL.md` | Current test/build evidence; browser/e2e checks depend on app and available tooling |
| `bug-investigate` / #15 | `.codex/prompts/bug/investigate.md`, `.github/prompts/bug-investigate.prompt.md` | `.github/skills/bug-investigate/SKILL.md` / `/bug-investigate` | Explicit invocation via skill metadata; skill text cannot select models or enforce tools | `<workspace>/.github/skills/bug-investigate/SKILL.md` | Issue report or tracker integration and access to the consuming repository |
| `bug-fix` / #15 | `.codex/prompts/bug/fix.md`, `.github/prompts/bug-fix.prompt.md` | `.github/skills/bug-fix/SKILL.md` / `/bug-fix` | Explicit invocation via skill metadata; skill text cannot select models or enforce tools | `<workspace>/.github/skills/bug-fix/SKILL.md` | Approved `BUGFIX.md`, a runnable regression test harness, and repository commands |
| `bug-verify` / #15 | `.codex/prompts/bug/verify.md`, `.github/prompts/bug-verify.prompt.md` | `.github/skills/bug-verify/SKILL.md` / `/bug-verify` | Explicit invocation via skill metadata; skill text cannot select models or enforce tools | `<workspace>/.github/skills/bug-verify/SKILL.md` | Defect report and fresh verification evidence from the consuming repository |
| `pr-review` | `.github/prompts/pr-review.md` | `.github/skills/pr-review/SKILL.md` / `/pr-review` | Explicit invocation via skill metadata; skill text cannot select models or enforce tools | `<workspace>/.github/skills/pr-review/SKILL.md` | Pull request diff and configured target branch; reviewer/model selection depends on available environment |

## Supporting Guidance

| Skill | Historical source material | Guidance consolidated |
| --- | --- | --- |
| `vue-testing` | Historical Vue prompt sources | Vue harness context, accessible queries, observable scenarios, asynchronous interactions, anti-patterns and review gate |
| `vue-bug-fixer-regression-guard` | Historical Vue bug-fixer prompt | `.github/skills/vue-bug-fixer-regression-guard/SKILL.md`; user-invocable Vue workflow, distinct from Jira `BUGFIX.md` phases |
| `vue-bug-fix-reviewer` | Historical Vue reviewer prompt | `.github/skills/vue-bug-fix-reviewer/SKILL.md`; independent review of Vue fix completeness, causal coverage, and regression-test quality |
| `workflow-execution` | Story and bug workflow sources listed above | Common planning/resume contract, one-step execution, verification evidence, checkpointing, and gate reporting |
| Story workflow skills | `.github/prompts/story-agent.md` | Shared story inspection, regression-risk, scope and documentation guidance distributed by phase |
| Story and review skills | Historical model-policy source | Skills document that model/tool selection is not enforceable by skill text; broader Copilot customization policy is tracked in #19 |

The supporting-source inventory for companion work item #16 is maintained separately from this migration record.

## Public-Safety Review

The associated PR records review results by file, line, and generic category. Do not copy private matches, internal identifiers, source checkout names, or deny-list terms into this map or PR notes.
