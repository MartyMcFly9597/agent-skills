# Copilot Customization Policy

This repository maintains generic workflows as skills. This policy distinguishes workflow guidance from configuration enforced by the host. It targets the **Copilot harness in VS Code**; shared locations do not imply identical behavior in Copilot CLI, the cloud agent, or other harnesses. The references below were checked on 2026-11-24.

## Choose the artifact

| Artifact | Responsibility and format | Discovery and use |
| --- | --- | --- |
| Custom agent | A reusable role with supported tool and model configuration; Markdown body with YAML frontmatter | Select in the agent picker, or delegate when supported. Use when capabilities must differ from the general-purpose agent. |
| Instruction | Standing project or personal guidance; plain Markdown, or `*.instructions.md` with optional YAML such as `applyTo` | Applicable user and repository rules are included together. Use file globs for targeted conventions, not a workflow slash command. |
| Skill | Reusable procedure and supporting resources; `<name>/SKILL.md` with `name` and `description` frontmatter | Loaded on demand by name/description. This repo's entry points use `disable-model-invocation: true` for explicit slash commands; supporting skills use `user-invocable: false` to hide the slash command without disabling relevant loading. |

Skills and instructions cannot select a model or restrict available tools. `AGENTS.md` is an instruction file, not a custom agent definition.

### Example: "reviews must not edit files"

**Agent: configure the capability boundary first.** Adapt this template into `.github/agents/read-only-reviewer.agent.md` or `~/.copilot/agents/read-only-reviewer.agent.md`. It is documentation, not an installed agent:

```markdown
---
name: Read-only reviewer
description: Review supplied changes and return actionable findings without editing files
target: github-copilot
tools: ['read', 'search']
model: ['<preferred reviewer model ID>', '<fallback reviewer model ID>']
model-policy: required
reasoning-effort: high
---
Review the supplied diff and directly relevant source and tests.
Do not edit files, run commands, delegate, or publish comments.
Return findings in chat with file/line, impact, and evidence.
Verify each finding against source; distinguish unverified concerns.
State missing inputs and checks you could not run. Do not claim tests passed.
```

Replace both model placeholders using completions for the selected harness and choose a supported effort level. The required model policy blocks sending if none of the listed models is available when this agent is selected in VS Code. Alternatively, omit all three model-related fields to use the current model without an agent-specific model restriction. `target` selects the editor schema; it does not switch the session's harness.

The tool list excludes editing, execution, delegation, and broad MCP access. Do not add `execute` just to obtain a diff: supply the diff and existing test output as inputs. Inspect the running agent's tools before relying on the restriction. A prose prohibition alone is not a permission boundary, and a tool list is not an operating-system sandbox.

**Instruction: express the standing convention.** For example, in `.github/instructions/reviews.instructions.md`:

```markdown
---
applyTo: '**'
---
When asked to review, report findings without editing files.
Perform fixes only in a separately authorized implementation task.
```

This applies guidance to matching file work; it neither activates a reviewer nor removes editing tools. Use the same convention in user instructions only when it should apply across all your projects.

**Skill: express the review procedure.** A review skill can say "inspect the supplied diff, verify findings against source, and return findings without changing files." That rule applies when the skill is loaded, but still depends on the active agent's capabilities. From a coordinator that can delegate, use the existing [cross-vendor-review skill](../.github/skills/cross-vendor-review/SKILL.md) instead of creating a duplicate workflow; the read-only reviewer itself does not delegate. Do not preload [pr-review](../.github/skills/pr-review/SKILL.md) into this read-only agent: that skill requires a report written to disk.

## Locations and ownership

Workspace paths are relative to the repository root. `~` is the home directory on the machine **running the harness**, which may be a remote host rather than the local desktop.

| Customization | Workspace | User | This installer |
| --- | --- | --- | --- |
| Custom agents | `.github/agents/*.agent.md` (also `.md`) | `~/.copilot/agents/*.agent.md` (also `.md`) | Neither scope |
| General instructions | `.github/copilot-instructions.md`, root or applicable nested `AGENTS.md` | `~/.copilot/copilot-instructions.md` | Neither scope |
| Targeted instructions | `.github/instructions/**/*.instructions.md` | `~/.copilot/instructions/**/*.instructions.md` | Neither scope |
| Copilot skills | `.github/skills/<name>/SKILL.md` | `~/.copilot/skills/<name>/SKILL.md` | Both, explicitly selected |
| Other-harness skill roots | `.agents/skills/<name>/SKILL.md` | `~/.agents/skills/<name>/SKILL.md` | Neither scope |

The `.agents/skills` roots are native Codex locations, also read by the deprecated Local harness; they are not interchangeable installer destinations for this Copilot package. Copilot clients may recognize additional roots, but this repository uses the native Copilot locations above. The Codex integration can also discover workspace `.github/skills`; this does not change our install target.

Prefer native locations over extra editor search paths. `chat.agentSkillsLocations` is deprecated; `chat.agentFilesLocations` and `chat.instructionsFilesLocations` remain supported by VS Code, but independent CLI/app clients do not inherit them.

Put shared conventions in the consuming repository and personal preferences at user scope. Never copy private user instructions into a workspace or publish them with this package. User folders persist independently of the Copilot login on the same machine, but do not roam through VS Code Settings Sync. Access to models, tools, and organization customizations may change with the account.

## Discovery, duplicates, and conflicts

- **Skills:** same-named copies in supported locations can both appear in the Skills page. Install each skill in one scope only; do not rely on an undocumented workspace-over-user winner. Back up adaptations before removing a duplicate. Different capabilities need distinct names.
- **Instructions:** Copilot combines applicable user and repository instructions without a general precedence order between instruction files. `applyTo` globs target files the agent works with; nested `AGENTS.md` files are discovered along relevant paths. Remove or narrow contradictory guidance at its source instead of adding an override rule.
- **Agents:** use unique file IDs and display names across scopes. Copilot CLI resolves a duplicate ID to the personal agent, where the ID derives from the file path, not the `name` field. Do not assume that rule is universal across clients; in VS Code, inspect the agent's source in the Customizations editor. When a custom agent is selected in Copilot chat, its body instructions take precedence over conflicting custom instructions. Keep them consistent rather than depending on that precedence.
- **Verify discovery:** start a fresh chat with the intended harness and workspace. Open **Chat: Open Customizations**, inspect the file source and diagnostics, then invoke a small representative task. Check actual instructions, tool activity, and model selection; a file appearing in the UI does not prove its rules are followed. Confirm availability again after a login, client, or remote-host change.

## Installer contract

| Command | Destination |
| --- | --- |
| `node bin/skills.js install [target]` | `<target>/.github/skills`; omitted target means the current directory |
| `node bin/skills.js install --user` | `~/.copilot/skills` |

The installer copies the source repository's `.github/skills` tree, including skill resources and its catalog. It never installs agents, instructions, prompts, or `.agents/skills`, and it never imports user settings. The repository-maintenance agent is repository-local, not a consumer artifact.

User scope is opt-in: `--user` plus a positional target is rejected before writes. `--source` changes the source root, not the destination scope. `--dry-run` writes nothing; existing files are preserved unless `--force` is supplied. Even with `--force`, destination-only files are not pruned.

The [installer tests](../scripts/skills-installer.test.js) exercise explicit and default workspace destinations with an isolated home, ensuring only skills are copied and no user files are created. Separate tests exercise explicit user installation, dry runs, conflicting arguments, and dependency-free installation. These verify filesystem behavior, not live harness discovery.

This policy and the migration map remain repository documentation, outside the package allowlist. README/catalog links use the repository URL so installed copies do not point to missing local documentation.

## Generic model and reviewer policy

This replaces the reusable parts of the historical model-policy prompt, not its fixed vendor assignments, model IDs, prices, or private policy. Provenance remains in the [migration map](migration/MIGRATION_MAP.md); the existing workflow skills remain canonical.

| Requirement | Supported control or limitation |
| --- | --- |
| Read-only reviewer | Configure `tools` as in the agent example and verify the actual tool inventory. Instructions and skills alone cannot enforce this. |
| Explicit model choice | `model` supplies a preference or ordered alternatives. In VS Code, `model-policy: required` restricts the selected chat agent to available listed models; `preferred` permits user overrides. |
| Thinking effort | `reasoning-effort` sets an initial supported effort, not a locked value; users can change it. |
| Delegated model/tool policy | Check the delegated runtime separately. VS Code does not forward `model-policy` or `strict-tools-list` during SDK agent conversion; a selected-agent UI restriction is not a runtime-wide or subagent guarantee. Editor schema acceptance is insufficient. |
| Repository instructions in subagents | Pass relevant instructions in the handoff and verify inclusion. Do not assume inheritance: CLI custom subagents need explicit opt-in, and VS Code does not forward `include-custom-instructions` during conversion. |
| Different-vendor review, escalation, cost limits, and model self-identification | Workflow expectations, not enforceable through skill prose or a model list alone. Verify routing metadata and approvals; disclose limitations. |

Apply these advisory rules without overriding the user's or environment's model controls:

1. Select models from the actual available inventory for the task's risk and complexity. Keep cost tiers local; request approval before using an option with unknown cost or exceeding an agreed budget. Do not publish fixed prices or assume model names rank capability.
2. For cross-vendor review, establish the implementation author/vendor from trustworthy routing metadata or explicit user input, then use a different vendor when available. A model's "I am..." claim, Git author, or current picker value does not prove who authored earlier changes. Follow the [cross-vendor workflow](../.github/skills/cross-vendor-review/SKILL.md) for unknown or mixed authorship, and label best-effort coverage honestly.
3. Give reviewers the exact base/HEAD, dirty-tree scope, relevant instructions, diff, and only the direct context needed to verify it. Use a fresh review context; carry durable state through the existing `PLAN.md` or `BUGFIX.md` contracts rather than replaying unrelated chat history.
4. Verify substantive findings against source or a focused reproduction before fixing them. Distinguish static review from executed tests. Read-only reviewers return findings; separately authorized implementation performs changes.
5. After repeated verification failures, reassess the cause and consider a bounded escalation for the failing step, recording the reason, approval, and result. Return to the normal task tier afterwards. Higher capability or extra reviewers do not replace evidence.

## References

- [VS Code custom agent file reference](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference) - locations, model policy, tool aliases, and SDK conversion limits.
- [VS Code custom instructions reference](https://code.visualstudio.com/docs/agents/reference/custom-instructions-reference) - discovery, user scope, and combination rules.
- [VS Code agent skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) - locations, invocation, and duplicate discovery.
- [Copilot CLI custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) - personal/repository agent IDs and subagent instruction inclusion.
