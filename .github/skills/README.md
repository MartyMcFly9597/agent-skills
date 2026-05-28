# Skills Directory

This directory contains reusable skill packages for the workspace.

## Folder Convention

Each skill lives in its own folder with exactly one `SKILL.md` file:

- `.github/skills/<skill-name>/SKILL.md`

Skill names should be lowercase and hyphenated.

## SKILL.md Baseline Sections

Use this baseline structure unless the skill needs extra sections:

1. `Purpose`
2. `When to use`
3. `Required inputs`
4. `Procedure`
5. `Output contract`
6. `Non-negotiable rules`
7. `Source prompts`

## Authoring Rules

- Keep steps explicit and testable.
- Avoid vague instructions like "do what is needed".
- Preserve source traceability in `Source prompts`.
- Keep one responsibility per skill.
- Do not duplicate broad guidance across many skills; extract shared context into its own skill.
