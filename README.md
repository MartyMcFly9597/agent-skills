# agent-skills

Reusable skills and prompts repository for agent workflows.

## Purpose

This repo is being built from `C:/WebDevelopment/ws/call-center/ah-vacv-spa/.codex` source assets.

The goal is to migrate free-form prompt guidance into durable, reusable `SKILL.md` packages with:

- clear invocation intent
- explicit procedures
- strict output contracts
- non-negotiable guardrails

## Repository Layout

- `.github/skills/`: reusable skill packages
- `.github/prompts/`: direct-use prompts and prompt source material
- `.github/agents/`: specialized custom agents for this repo
- `docs/migration/`: migration map, issue queue, and rollout docs
- `docs/quality/`: review checklist, external AI review prompt, quality report
- `docs/process/`: issue-driven branch and PR delivery workflow

## Migration Workflow

1. Capture source-to-target mappings in `docs/migration/MIGRATION_MAP.md`.
2. Create GitHub issues for each migration domain.
3. Implement one issue per branch.
4. Open one PR per issue with verification evidence.
5. Merge in issue order unless reprioritized.
6. Run quality gate review before finalizing the migration.

## Authoring Standards

- Keep each skill focused on one job.
- Prefer explicit, testable procedural steps.
- Preserve source traceability in every migrated skill.
- Avoid duplicated global guidance by extracting shared context skills.
- Treat prompts as source material and skills as operational contracts.

## Tracking

- Migration map: `docs/migration/MIGRATION_MAP.md`
- Issue queue: `docs/migration/ISSUES.md`
- Quality checklist: `docs/quality/REVIEW_CHECKLIST.md`
- Delivery workflow: `docs/process/ISSUE_DELIVERY_WORKFLOW.md`

## Skills CLI (Hybrid Install)

This repository includes a Node CLI named `skills` for local npm usage now and `npx` usage after publish.

### Local usage

- `npm install`
- `npm run skills:list`
- `npm run skills:install -- . --with-prompts`

Optional global link on your own machine:

- `npm link`
- `skills list`

### npx usage (after npm publish)

- `npx @martymcfly9597/agent-skills list`
- `npx @martymcfly9597/agent-skills install . --with-prompts`

If you later secure the package name `skills`, then this becomes:

- `npx skills list`
- `npx skills install . --with-prompts`

CLI docs: `docs/process/SKILLS_CLI_INSTALL.md`
