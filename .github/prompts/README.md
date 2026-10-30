# Prompts Directory

This directory stores prompt files for Local-harness compatibility. Copilot harness sessions do not load `*.prompt.md` files; use the corresponding explicitly invoked skill under `.github/skills/` as the Copilot workflow entrypoint.

## File Convention

- `.github/prompts/<name>.md` for standalone prompts.
- Grouped prompts may use subfolders when that improves discoverability.

## Prompt-to-Skill Strategy

Skills are the canonical reusable workflow format for Copilot. Keep a prompt file only when Local-harness compatibility is still needed. The prompt must be self-contained for Local use and must not link to an uninstalled source tree.

When migrating a prompt into a skill:

1. Add or update the target `SKILL.md` package with valid `name` and `description` frontmatter.
2. Set `disable-model-invocation: true` when the workflow must only run on explicit request.
3. Map prompt `name`, `description`, and argument guidance into the skill. Prompt `agent`, `model`, and `tools` metadata does not transfer; do not claim model or tool enforcement unless a supported custom agent provides it.
4. Keep a Local-only prompt only when needed and test it separately from the Copilot skill.
5. Record the mapping in `docs/migration/MIGRATION_MAP.md` in this repository. The map is repository documentation and is not included in installed packages.
