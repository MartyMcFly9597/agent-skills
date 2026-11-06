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

## Supporting Source Inventory

Disposition: `keep` means retain as a maintained artifact; `merge` or `adapt` means the historical source is represented by the named canonical skill; `exclude` means do not distribute it. The installer copies only `.github/skills` into `<workspace>/.github/skills`; historical prompt files are not packaged or installed.

For repository-owned skills, `generic; no source-specific scan` means generic heuristic checks ran, review notices need human disposition, and no separate source-specific scan was performed.

### Repository-Owned Skills

| Artifact | Disposition and ownership | Dependencies and applicability | Distribution / install status | Public-safety status |
| --- | --- | --- | --- | --- |
| `.github/skills/pr-review/SKILL.md` | Keep; repository-owned PR review capability, adapted from the historical review prompt | Git diff and the consumer repository's target branch; reviewer/model choice is environment-dependent | Included in npm package; copied to `<workspace>/.github/skills/pr-review/` | Generic; no source-specific scan |
| `.github/skills/vue-testing/SKILL.md` | Keep; shared Vue testing support, merged from the shared-context and black-box testing prompts | Only for Vue projects; new component tests expect the consuming app's Testing Library Vue harness | Included in npm package; copied to `<workspace>/.github/skills/vue-testing/` | Generic; no source-specific scan |
| `.github/skills/vue-bug-fixer-regression-guard/SKILL.md` | Keep; distinct Vue bug-fixing role, adapted from its historical prompt | Vue repository and `vue-testing`; not a Jira `BUGFIX.md` phase | Included in npm package; copied to `<workspace>/.github/skills/vue-bug-fixer-regression-guard/` | Generic; no source-specific scan |
| `.github/skills/vue-bug-fix-reviewer/SKILL.md` | Keep; distinct Vue fix-review role, adapted from its historical prompt | Vue bug report/change and `vue-testing`; not the Jira bug verifier | Included in npm package; copied to `<workspace>/.github/skills/vue-bug-fix-reviewer/` | Generic; no source-specific scan |
| `.github/skills/workflow-execution/SKILL.md` | Keep; shared support for the six story/Jira bug phases | Loaded by phase skills; repository instructions and actual test/tool availability remain authoritative | Included in npm package; copied to `<workspace>/.github/skills/workflow-execution/` | Generic; no source-specific scan |
| `.github/skills/story-planner/SKILL.md` | Keep; phase owned by #15/#2, inventoried here to link the supporting workflow | Uses `workflow-execution`; Vue testing guidance applies only when relevant | Included in npm package; copied to `<workspace>/.github/skills/story-planner/` | Generic; no source-specific scan |
| `.github/skills/story-implementer/SKILL.md` | Keep; phase owned by #15/#2, inventoried here to link the supporting workflow | Uses `workflow-execution`; Vue testing guidance applies only when relevant | Included in npm package; copied to `<workspace>/.github/skills/story-implementer/` | Generic; no source-specific scan |
| `.github/skills/story-verifier/SKILL.md` | Keep; phase owned by #15/#2, inventoried here to link the supporting workflow | Uses `workflow-execution`; Vue testing guidance applies only when relevant | Included in npm package; copied to `<workspace>/.github/skills/story-verifier/` | Generic; no source-specific scan |
| `.github/skills/bug-investigate/SKILL.md` | Keep; Jira phase owned by #15, inventoried here to link the supporting workflow and distinguish it from Vue roles | Uses `workflow-execution`; tracker details may be user-supplied; Vue testing guidance applies conditionally | Included in npm package; copied to `<workspace>/.github/skills/bug-investigate/` | Generic; no source-specific scan |
| `.github/skills/bug-fix/SKILL.md` | Keep; Jira phase owned by #15, inventoried here to link the supporting workflow and distinguish it from Vue roles | Uses `workflow-execution`; requires an approved `BUGFIX.md` and runnable repository tests; Vue testing guidance applies conditionally | Included in npm package; copied to `<workspace>/.github/skills/bug-fix/` | Generic; no source-specific scan |
| `.github/skills/bug-verify/SKILL.md` | Keep; Jira phase owned by #15, inventoried here to link the supporting workflow and distinguish it from Vue roles | Uses `workflow-execution`; requires current defect and verification evidence; Vue testing guidance applies conditionally | Included in npm package; copied to `<workspace>/.github/skills/bug-verify/` | Generic; no source-specific scan |

### Historical Repository Sources

| Source artifact | Disposition / canonical target | Ownership and dependencies | Install status | Public-safety status |
| --- | --- | --- | --- | --- |
| `.github/prompts/pr-review.md` | Adapted into `.github/skills/pr-review/SKILL.md` | Repository-owned; PR diff and configured target branch | Historical Git source only; excluded from package and installer | Historical content remains in public Git history; not copied as a separate installed artifact |
| `.github/prompts/vue/vue-testing-shared-context.md` | Merged into `.github/skills/vue-testing/SKILL.md` | Repository-owned; only applicable to Vue consumers | Historical Git source only; excluded from package and installer | Historical content remains in public Git history; not copied as a separate installed artifact |
| `.github/prompts/vue/vue-testing-library-black-box.md` | Merged into `.github/skills/vue-testing/SKILL.md` | Repository-owned; consumer must provide the relevant test harness | Historical Git source only; excluded from package and installer | Historical content remains in public Git history; not copied as a separate installed artifact |
| `.github/prompts/vue/vue-bug-fixer-regression-guard.md` | Adapted into `.github/skills/vue-bug-fixer-regression-guard/SKILL.md` | Repository-owned; distinct from Jira bug phases; depends on Vue testing guidance | Historical Git source only; excluded from package and installer | Historical content remains in public Git history; not copied as a separate installed artifact |
| `.github/prompts/vue/vue-bug-fix-reviewer.md` | Adapted into `.github/skills/vue-bug-fix-reviewer/SKILL.md` | Repository-owned; distinct from Jira bug verification; depends on Vue testing guidance | Historical Git source only; excluded from package and installer | Historical content remains in public Git history; not copied as a separate installed artifact |
| `.github/prompts/story-agent.md` | Shared guidance distributed across the three story phase skills and `workflow-execution`; phase ownership remains with #15 | Repository-owned; avoid reimplementing story phases in support skills | Historical Git source only; excluded from package and installer | Historical content remains in public Git history; not copied as a separate installed artifact |
| `.github/agents/skills-repo-orchestrator.agent.md` | Keep as a repository-local maintenance agent; not converted into a consumer skill | Repository maintenance only; uses repository instructions and local tools | Not included in npm `files`; not copied by the skill installer | Generic; no source-specific scan |
| `.github/instructions/**` | No repository-owned instruction files are tracked in this checkout | No local artifact to classify | None | Not applicable |

### Sources Not Imported from Adjacent or User-Level Repositories

| Source group named by #16 | Disposition | Ownership, dependencies, and install status | Public-safety status |
| --- | --- | --- | --- |
| Adjacent SPA `.github/instructions/sonarqube_mcp.instructions.md` | Exclude from this package; project-specific instructions are not distributable as-is; generalize only with source-owner approval | SPA-owned artifact tracked in the supplied adjacent checkout; no install destination is defined for this package | Reviewed for inventory and distribution; not copied into this public package |
| Adjacent SPA `.codex/skills/**`, `.codex/prompts/pr-review.md`, `.codex/prompts/vue/**`, `.github/prompts/**`, and `.github/skills/**` | No tracked artifacts found at these requested paths in the supplied checkout; nothing to import | The checked paths contain no tracked SPA artifacts to classify or install | No content was present at these paths to review; this does not make other SPA content distributable |
| User-level cross-vendor review prompt | Exclude by default; consider only if the owner provides and approves a generic reusable source | User-owned source not supplied; no personal path or content recorded | Not reviewed or distributable from this inventory |
| Installed user-level skills | Exclude by default unless an individual source is provided, owned, approved, and independently reviewed | User-level/third-party sources were not supplied; no personal paths or content recorded | Not reviewed or distributable from this inventory |

The repository-maintenance agent is intentionally distinct from the npm-installed skill catalog. The supplied adjacent SPA checkout was inspected for the requested paths: its tracked MCP instructions are explicitly excluded above, and no tracked artifacts were found at the other listed SPA paths. User-level sources remain uninspected because none were supplied.

## Public-Safety Review

The associated PR records review results by file, line, and generic category. Do not copy private matches, internal identifiers, source checkout names, or deny-list terms into this map or PR notes.

Generic privacy checks run with `npm run check -- --shipped`. Source-specific organization, project, and business terms must be maintained in a private file outside the repository and supplied through `PRIVACY_DENYLIST`. The checker reports matching file, category, and line without echoing the matched text. When `PRIVACY_DENYLIST` is unset, only generic checks ran; do not claim a source-specific scan was completed.
