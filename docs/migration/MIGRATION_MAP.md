# Skill Migration Map

## Purpose

This map records historical prompt sources consolidated into canonical Copilot skills. Six small `.prompt.md` compatibility wrappers are retained for Local-harness users; they delegate to skills and install only when `--with-prompts` is supplied. Historical source paths below are provenance labels, while the Local prompt column contains current files.

## Conversion

- Workflow instructions are maintained in `.github/skills/<name>/SKILL.md` and invoked by skill name. Optional Local prompt wrappers contain no copied workflow logic and link to their canonical skills.
- Install skills to `<workspace>/.github/skills`; `--with-prompts` additionally installs the Local wrappers to `<workspace>/.github/prompts`.
- Prompt names, descriptions, argument guidance, and useful workflow instructions were incorporated into skills; the wrappers preserve only Local entrypoint compatibility.
- Legacy `agent`, `model`, and `tools` metadata was not transferred to skills. Custom instructions can express project guidance, but they do not configure or enforce those settings.
- If a future workflow requires harness-supported model or tool configuration, use a custom agent in `.github/agents`. Model availability remains environment-controlled; skill hints are informational, and review skills recommend a distinct reviewer/model family when available.

Official references: VS Code documentation, “Convert prompt files to skills” and “SKILL.md file format.”

## Workflow Sources

| Phase / origin | Historical prompt sources | Canonical skill / Copilot invocation | Optional Local prompt | Enforcement | Install target | Capabilities and app limits |
| --- | --- | --- | --- | --- | --- | --- |
| `story-planner` / #2, PR #7 | `.codex/prompts/story/plan.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/plan.md` | `.github/skills/story-planner/SKILL.md` / `/story-planner` | `.github/prompts/story-plan.prompt.md` | Explicit invocation via skill metadata; text cannot select models or enforce tools | `<workspace>/.github/skills/story-planner/SKILL.md`; optional prompt under `.github/prompts` | Issue details or tracker integration; e2e strategy depends on the consuming app |
| `story-implementer` / #2, PR #7 | `.codex/prompts/story/implement.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/implement.md` | `.github/skills/story-implementer/SKILL.md` / `/story-implementer` | `.github/prompts/story-implement.prompt.md` | Explicit invocation via skill metadata; text cannot select models or enforce tools | `<workspace>/.github/skills/story-implementer/SKILL.md`; optional prompt under `.github/prompts` | Approved `PLAN.md`, repository test/build commands, and app-specific conventions |
| `story-verifier` / #2, PR #7 | `.codex/prompts/story/verify.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/verify.md` | `.github/skills/story-verifier/SKILL.md` / `/story-verifier` | `.github/prompts/story-verify.prompt.md` | Explicit invocation via skill metadata; text cannot select models or enforce tools | `<workspace>/.github/skills/story-verifier/SKILL.md`; optional prompt under `.github/prompts` | Current test/build evidence; browser/e2e checks depend on app and available tooling |
| `bug-investigate` / #15 | `.codex/prompts/bug/investigate.md`, `.github/prompts/bug-investigate.prompt.md` | `.github/skills/bug-investigate/SKILL.md` / `/bug-investigate` | `.github/prompts/bug-investigate.prompt.md` | Explicit invocation via skill metadata; text cannot select models or enforce tools | `<workspace>/.github/skills/bug-investigate/SKILL.md`; optional prompt under `.github/prompts` | Issue report or tracker integration and access to the consuming repository |
| `bug-fix` / #15 | `.codex/prompts/bug/fix.md`, `.github/prompts/bug-fix.prompt.md` | `.github/skills/bug-fix/SKILL.md` / `/bug-fix` | `.github/prompts/bug-fix.prompt.md` | Explicit invocation via skill metadata; text cannot select models or enforce tools | `<workspace>/.github/skills/bug-fix/SKILL.md`; optional prompt under `.github/prompts` | Approved `BUGFIX.md`, a runnable regression test harness, and repository commands |
| `bug-verify` / #15 | `.codex/prompts/bug/verify.md`, `.github/prompts/bug-verify.prompt.md` | `.github/skills/bug-verify/SKILL.md` / `/bug-verify` | `.github/prompts/bug-verify.prompt.md` | Explicit invocation via skill metadata; text cannot select models or enforce tools | `<workspace>/.github/skills/bug-verify/SKILL.md`; optional prompt under `.github/prompts` | Defect report and fresh verification evidence from the consuming repository |

## Supporting Guidance

| Skill | Historical prompt source | Guidance consolidated |
| --- | --- | --- |
| `vue-testing` | `.github/prompts/vue/vue-testing-shared-context.md`, `.github/prompts/vue/vue-testing-library-black-box.md` | Vue harness context, accessible queries, observable scenarios, asynchronous interactions, anti-patterns and review gate |
| `vue-bug-fixer-regression-guard` | `.github/prompts/vue/vue-bug-fixer-regression-guard.md` | `.github/skills/vue-bug-fixer-regression-guard/SKILL.md`; user-invocable Vue workflow, distinct from Jira `BUGFIX.md` phases |
| `vue-bug-fix-reviewer` | `.github/prompts/vue/vue-bug-fix-reviewer.md` | `.github/skills/vue-bug-fix-reviewer/SKILL.md`; independent review of Vue fix completeness, causal coverage, and regression-test quality |
| `workflow-execution` | Story and bug workflow sources listed above | Common planning/resume contract, one-step execution, verification evidence, checkpointing, and gate reporting |
| Story workflow skills | `.github/prompts/story-agent.md` | Shared story inspection, regression-risk, scope and documentation guidance distributed by phase |
| Story and review skills | `.github/prompts/model-policy.md` | Informational model guidance placed where planning or independent review makes it relevant; no model selector skill was created because skills cannot switch the configured model |

The supporting-source inventory for companion work item #16 is maintained separately from this migration record.

## Public-Safety Review

The associated PR records review results by file, line, and generic category. Do not copy private matches, internal identifiers, source checkout names, or deny-list terms into this map or PR notes.
