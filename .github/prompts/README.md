# Prompts Directory

This directory stores direct-use prompt files.

## File Convention

- `.github/prompts/<name>.md` for standalone prompts.
- Grouped prompts may use subfolders when that improves discoverability.

## Prompt-to-Skill Strategy

Prompts are source material.
Skills are durable operational workflows.

When migrating a prompt into a skill:

1. Keep the original prompt for backward compatibility.
2. Add or update the target `SKILL.md` package.
3. Record the mapping in `docs/migration/MIGRATION_MAP.md`.
