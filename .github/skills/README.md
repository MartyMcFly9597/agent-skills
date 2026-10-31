# Skills Directory

This directory contains reusable skill packages for the workspace.

## Folder Convention

Each skill lives in its own folder with exactly one `SKILL.md` file:

- `.github/skills/<skill-name>/SKILL.md`

Skill names should be lowercase and hyphenated.

Keep this directory flat for the documented Copilot discovery layout. Use descriptive name prefixes and the groups below instead of nested `story/`, `bug/`, or team directories. Every skill's entry file remains `SKILL.md`.

## Skill Groups

| Group | Skills |
| --- | --- |
| Story entry points | [story-planner](./story-planner/SKILL.md), [story-implementer](./story-implementer/SKILL.md), [story-verifier](./story-verifier/SKILL.md) |
| Bug entry points | [bug-investigate](./bug-investigate/SKILL.md), [bug-fix](./bug-fix/SKILL.md), [bug-verify](./bug-verify/SKILL.md) |
| Review entry point | [pr-review](./pr-review/SKILL.md) |
| Workflow support | [workflow-execution](./workflow-execution/SKILL.md) |
| Technology support | [vue-testing](./vue-testing/SKILL.md) |

## Copilot Skill Frontmatter

Each `SKILL.md` must begin with YAML frontmatter containing:

```yaml
---
name: skill-folder-name
description: What the skill does and when to use it.
---
```

`name` must be lowercase, hyphenated, unique, and match the containing folder. `description` should name the capability and trigger conditions. For phase workflows intended to run only on request, add `disable-model-invocation: true`. `argument-hint` is optional and may describe the input expected after the slash command.

Supporting skills use `user-invocable: false` without `disable-model-invocation: true`, allowing relevant loading without another slash command.

Prompt-only metadata such as `agent`, `model`, and `tools` does not transfer to skills. Do not claim that skill text enforces model choice or tool availability. Configure those capabilities separately only when the target harness supports them.

## SKILL.md Baseline Sections

Use this baseline structure unless the skill needs extra sections:

1. `Purpose`
2. `When to use`
3. `Required inputs`
4. `Procedure`
5. `Output contract`
6. `Non-negotiable rules`
7. `Related skills` when a workflow has a direct handoff to another skill

## Authoring Rules

- Make dependencies explicit: direct the agent to read and follow the supporting skill using a relative Markdown link. Do not rely on its name or description implicitly loading the body.
- Use `Related skills` for explicit workflow handoffs, not to duplicate another skill's instructions.
- Record migration provenance in the repository migration map, not in every installed skill.
- Keep public repository content generic; do not include organization names, private URLs, customer data, business operations, or internal policy details.

## Application-Family Guidance

- Keep phase orchestration in story/bug entry points, common gates in `workflow-execution`, and stack or app-family details in narrowly triggered supporting skills.
- Use unique descriptive folder/name pairs, for example `web-testing` and `console-testing`. Those names are examples, not required profiles. Do not encode private product or team names into public skills.
- Keep the six shared entry points for convention differences. Add a prefixed entry point only when the workflow or artifact actually differs, and explicitly load applicable shared rules there too.
- Scope `description` and `When to use` to observable repository traits. Select using repository instructions and relevant code, not guessed team ownership or framework assumptions. Record the selected skills in the plan.
- Scope Testing Library, PrimeVue, e2e-repository, and similar requirements to applicable projects. Never make one team's stack a universal rule.
- Resolve contradictory guidance with the user and repository instructions before proceeding. Keep organization-specific adaptations in the consumer repository; do not publish their details here.
