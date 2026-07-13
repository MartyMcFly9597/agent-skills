# agent-skills

Reusable skills and prompts for agent workflows.

## Repository layout

```
.github/
  skills/          # Skill packages (one SKILL.md per directory)
  prompts/         # Agent prompts (role instructions for direct invocation)
  agents/          # Custom agent definitions for this repo
bin/               # Skills CLI
```

## Using skills in another repo

### Option 1: Symlink (recommended for local development)

From your project root, symlink `.codex/skills` and `.codex/prompts` to this repo:

```bash
# From your project repo (adjust relative path as needed)
ln -s ../../../agent-skills/.github/skills .codex/skills
ln -s ../../../agent-skills/.github/prompts .codex/prompts
```

Changes in `agent-skills` are reflected immediately — no copy or sync step.

### Option 2: CLI install (copies files into target repo)

```bash
# Local usage (from this repo)
npm install
npm run skills:install -- /path/to/target --with-prompts

# Or link globally
npm link
skills install /path/to/target --with-prompts

# npx (after npm publish)
npx @martymcfly9597/agent-skills install /path/to/target --with-prompts
```

### Option 3: Manual copy

Copy `.github/skills/` and `.github/prompts/` into your project's `.codex/` or `.github/` directory.

## Available skills

| Skill | Purpose |
|-------|---------|
| `story-planner` | Plan a Jira story into a testable PLAN.md checklist |
| `story-implementer` | Execute PLAN.md one step at a time with verification |
| `story-verifier` | Gate story completion with strict review |
| `pr-review` | Diff-scoped pull request review with severity labels |
| `shared-vue-testing-context` | Shared testing constraints for Vue component tests |
| `vue-testing-library-black-box` | Black-box Vue component testing with Testing Library |
| `vue-bug-fixer-regression-guard` | Bug fix with regression guard tests |
| `vue-bug-fix-reviewer` | Review bug fix PRs for quality and regression risk |

## CLI commands

| Command | Description |
|---------|-------------|
| `skills list` | List available skill packages |
| `skills install [target]` | Copy skills into target workspace |
| `skills install [target] --with-prompts` | Also copy prompts |
| `skills doctor` | Print environment and source directory checks |

Flags: `--force` (overwrite), `--dry-run` (preview), `--source <path>` (override source root).

## Maintaining this repo

### Adding a skill

1. Create `.github/skills/<skill-name>/SKILL.md`.
2. If the skill has a companion prompt, create `.github/prompts/<name>.md`.
3. Update the table in this README.

### Skill structure

```
.github/skills/<skill-name>/
  SKILL.md              # Required — purpose, when to use, procedure, output contract, rules
  supporting-file.*     # Optional — heavy reference or reusable tools
```

### Branching

One feature branch per change, one PR per branch, target `main`.
