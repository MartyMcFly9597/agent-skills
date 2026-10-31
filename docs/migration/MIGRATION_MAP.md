# Skill Migration Map

## Purpose

This map records historical prompt sources consolidated into the Copilot skills. Prompt files and source copies are not retained in the repository or package. Paths below are provenance labels only, not active files or install locations.

## Conversion

- Copilot workflows are maintained only as `.github/skills/<name>/SKILL.md` and invoked by their skill name. No duplicate prompt files are maintained or installed.
- Prompt names, descriptions, argument guidance, and useful workflow instructions were incorporated into skills.
- Legacy `agent`, `model`, and `tools` metadata was not transferred to skills. Custom instructions can express project guidance, but they do not configure or enforce those settings.
- If a future workflow requires harness-supported model or tool configuration, use a custom agent in `.github/agents`. Model availability remains environment-controlled; skill hints are informational, and review skills recommend a distinct reviewer/model family when available.

Official references: VS Code documentation, “Convert prompt files to skills” and “SKILL.md file format.”

## Workflow Sources

| Skill | Historical prompt sources | Copilot entrypoint | Guidance consolidated | Origin |
| --- | --- | --- | --- | --- |
| `story-planner` | `.codex/prompts/story/plan.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/plan.md` | `/story-planner` | Story intake, codebase inspection, risk/coverage planning, PLAN.md structure, complexity and optional e2e strategy | #2 / PR #7 |
| `story-implementer` | `.codex/prompts/story/implement.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/implement.md` | `/story-implementer` | One-step execution, tests, verification, frontend consistency, e2e conventions, completion evidence | #2 / PR #7 |
| `story-verifier` | `.codex/prompts/story/verify.md`, `.codex/prompts/story-agent.md`, `.github/prompts/story/verify.md` | `/story-verifier` | Plan integrity, implementation/test review, regression checks, e2e, current verification, independent review | #2 / PR #7 |
| `bug-investigate` | `.codex/prompts/bug/investigate.md`, `.github/prompts/bug-investigate.prompt.md` | `/bug-investigate` | Root-cause tracing, defect classification, coverage-gap assessment, BUGFIX.md structure | #15 |
| `bug-fix` | `.codex/prompts/bug/fix.md`, `.github/prompts/bug-fix.prompt.md` | `/bug-fix` | Test-first execution, minimal fix, per-step verification and checkpointing | #15 |
| `bug-verify` | `.codex/prompts/bug/verify.md`, `.github/prompts/bug-verify.prompt.md` | `/bug-verify` | Root-cause validity, regression-test quality, scope, risks, verification evidence | #15 |
| `pr-review` | `.github/prompts/pr-review.md` | `/pr-review` | Diff-only scope, severity labels, concise findings, review report file format | #15 |

## Supporting Guidance

| Skill | Historical prompt source | Guidance consolidated |
| --- | --- | --- |
| `vue-testing` | `.github/prompts/vue/vue-testing-shared-context.md`, `.github/prompts/vue/vue-testing-library-black-box.md` | Vue harness context, accessible queries, observable scenarios, asynchronous interactions, anti-patterns and review gate |
| Bug workflow skills and `vue-testing` | `.github/prompts/vue/vue-bug-fixer-regression-guard.md`, `.github/prompts/vue/vue-bug-fix-reviewer.md` | Shared-root-cause analysis, test-level selection, causal completeness, partial fixes, and durable regression coverage |
| `workflow-execution` | Story and bug workflow sources listed above | Common planning/resume contract, one-step execution, verification evidence, checkpointing, and gate reporting |
| Story workflow skills | `.github/prompts/story-agent.md` | Shared story inspection, regression-risk, scope and documentation guidance distributed by phase |
| Story and review skills | `.github/prompts/model-policy.md` | Informational model guidance placed where planning or independent review makes it relevant; no model selector skill was created because skills cannot switch the configured model |

The supporting-source inventory for companion work item #16 is maintained separately from this migration record.

## Public-Safety Review

The associated PR records review results by file, line, and generic category. Do not copy private matches, internal identifiers, source checkout names, or deny-list terms into this map or PR notes.
