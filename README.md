# agent-skills

Reusable, explicitly invoked agent skills for software planning, implementation, review, and testing. This is a public repository; contributions must contain only generic workflow guidance with no organization-specific or business-operation details.

## Copilot Workflows

Use the Copilot harness slash commands for phase workflows:

| Workflow | Commands |
| --- | --- |
| Story | `/story-planner` → `/story-implementer` → `/story-verifier` |
| Bug | `/bug-investigate` → `/bug-fix` → `/bug-verify` |

These skills are explicitly invoked. They describe workflow behavior but do not enforce model selection or tool availability. Issue-tracker and optional e2e capabilities must be configured by the consuming workspace. If a tracker integration is unavailable, provide the issue details directly.

## Available Skills

| Skill | Purpose |
| --- | --- |
| `story-planner` | Plan a story into a small, testable `PLAN.md` checklist |
| `story-implementer` | Execute the next plan step with tests and verification |
| `story-verifier` | Gate story completion against plan, tests, and evidence |
| `bug-investigate` | Confirm a defect's root cause and prepare `BUGFIX.md` |
| `bug-fix` | Execute one test-first bug-fix step at a time |
| `bug-verify` | Independently verify root cause, regression tests, and evidence |
| `pr-review` | Review a pull request diff for correctness and regression risk |
| `shared-vue-testing-context` | Shared constraints for Vue component tests |
| `vue-testing-library-black-box` | Black-box Vue component testing with Testing Library |
| `vue-bug-fixer-regression-guard` | Vue bug fixing with durable regression tests |
| `vue-bug-fix-reviewer` | Review Vue bug fixes for causal correctness and regression risk |

## Install Into a Workspace

The repository's installer copies skills to the Copilot workspace location `.github/skills`.

```powershell
npm run skills:install -- C:\path\to\workspace
```

The installer is invoked from this repository. It supports `--force`, `--dry-run`, and `--source <path>`.

## Local CLI

```powershell
node bin/skills.js list
node bin/skills.js install C:\path\to\workspace
node bin/skills.js doctor
```

`list` lists skill package directories in this source repository; it does not list skills installed in another agent. Upstream `npx skills` is a separate CLI.

## Authoring

Create `.github/skills/<skill-name>/SKILL.md` with YAML frontmatter containing a unique lowercase, hyphenated `name` matching the folder and a `description` stating what the skill does and when to use it. Explicit workflows should include `disable-model-invocation: true`. Keep all skills and supporting examples organization-neutral.

See `.github/skills/README.md` for the authoring baseline. Workflow instructions live in `.github/skills`; no prompt-file copies are maintained. The migration catalog is maintained at `docs/migration/MIGRATION_MAP.md` and is not included in npm packages.

Run the repository checks with:

```powershell
npm run check
```

For migration and provenance, see the migration map. Its supporting-source inventory is extended by the companion inventory work item.

## Contributions

Use one feature branch and one pull request per focused change, targeting `main`. Review the entire public diff for organization-specific names, private endpoints, customer data, business processes, and internal policy details before opening a pull request.
