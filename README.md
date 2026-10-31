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
| `workflow-execution` | Supporting skill for shared planning, execution, and verification gates |
| `vue-testing` | Supporting skill for Vue test authoring and regression-test review |

Supporting skills have `user-invocable: false`: they do not add slash commands. The phase workflows explicitly load the shared workflow rules and load Vue guidance only for applicable changes.

## Multiple Application Families

Keep skills flat: `.github/skills/<skill-name>/SKILL.md`. Distinguish skills by their directory and frontmatter `name`, not by renaming `SKILL.md` or nesting category folders.

- Share the six story/bug entry points when teams use the same phase workflow. Load app-specific supporting skills for architecture, test harnesses, UI conventions, or repository layout only when applicable.
- Prefix app-family skills with a generic, descriptive qualifier such as `web-testing` or `console-testing`. Set supporting skills to `user-invocable: false` and describe precise applicability; do not activate them from a vague word such as "app" alone.
- If a team has a genuinely different planning process or output artifact, retain a distinct entry point such as `web-story-planner`. Shared planning rules belong in `workflow-execution`; distinct workflow requirements belong in that entry point. Do not copy the whole generic planner to change a few conventions.
- Read the consuming repository's instructions and relevant code to select guidance. Record the selected app-family skills in `PLAN.md` or `BUGFIX.md` so implementation and verification use the same context. Ask when applicability is ambiguous; surface conflicts rather than silently combining incompatible rules.
- Keep proprietary app-family details in the consuming repository's own skills or instructions. Only organization-neutral guidance belongs in this public package. Before importing another team's skills, compare their triggers and requirements with existing skills, merge true overlap, and retain distinct capabilities under unique names.

The example app-family names above describe an extension convention, not additional packaged skills. A technology skill such as `vue-testing` can apply across app families; it must not imply that every application uses Vue, PrimeVue, or the same e2e setup.

## Install Into a Workspace

The repository's installer copies skills to the Copilot workspace location `.github/skills`.

```powershell
npm run skills:install -- C:\path\to\workspace
```

The installer is invoked from this repository. It supports `--force`, `--dry-run`, and `--source <path>`.

### Updating an Existing Installation

The installer preserves destination-only files, including with `--force`; it does not prune retired skills. When updating an older installation, review and remove these obsolete skill directories from the target workspace's `.github/skills` after preserving any local customizations:

- `shared-vue-testing-context`
- `vue-testing-library-black-box`
- `vue-bug-fixer-regression-guard`
- `vue-bug-fix-reviewer`

Their reusable testing guidance is now in `vue-testing`; use the regular bug phases for investigation, fixes, and review. Run installation with `--dry-run` first and use `--force` only when overwriting existing skill files is intended. Confirm that the old slash commands no longer appear in a fresh Copilot session.

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
