# Skills Directory

This directory contains reusable skill packages for the workspace.

## Folder Convention

Each skill lives in its own folder with exactly one `SKILL.md` file:

- `.github/skills/<skill-name>/SKILL.md`

Skill names should be lowercase and hyphenated.

## Copilot Skill Frontmatter

Each `SKILL.md` must begin with YAML frontmatter containing:

```yaml
---
name: skill-folder-name
description: What the skill does and when to use it.
---
```

`name` must be lowercase, hyphenated, unique, and match the containing folder. `description` should name the capability and trigger conditions. For phase workflows intended to run only on request, add `disable-model-invocation: true`. `argument-hint` is optional and may describe the input expected after the slash command.

Prompt-only metadata such as `agent`, `model`, and `tools` does not transfer to skills. Do not claim that skill text enforces model choice or tool availability. Configure those capabilities separately only when the target harness supports them.

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

- Preserve source traceability in `Source prompts` using repository-relative source descriptions and the canonical migration map. Do not link to files that are not shipped with the skill.
- Keep public repository content generic; do not include organization names, private URLs, customer data, business operations, or internal policy details.
