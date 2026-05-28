# Prompt-to-Skill Migration Map

This map tracks source prompt assets from `C:/WebDevelopment/ws/call-center/ah-vacv-spa/.codex` to this repository's target skill packages.

## Mappings

- `.codex/prompts/pr-review.md` -> `.github/skills/pr-review/SKILL.md`
- `.codex/prompts/story-agent.md` -> split into:
  - `.github/skills/story-planner/SKILL.md`
  - `.github/skills/story-implementer/SKILL.md`
  - `.github/skills/story-verifier/SKILL.md`
- `.codex/prompts/story/plan.md` -> `.github/skills/story-planner/SKILL.md`
- `.codex/prompts/story/implement.md` -> `.github/skills/story-implementer/SKILL.md`
- `.codex/prompts/story/verify.md` -> `.github/skills/story-verifier/SKILL.md`
- `.codex/prompts/vue/vue-bug-fix-reviewer.md` -> `.github/skills/vue-bug-fix-reviewer/SKILL.md`
- `.codex/prompts/vue/vue-bug-fixer-regression-guard.md` -> `.github/skills/vue-bug-fixer-regression-guard/SKILL.md`
- `.codex/prompts/vue/vue-testing-library-black-box.md` -> `.github/skills/vue-testing-library-black-box/SKILL.md`
- `.codex/prompts/vue/vue-testing-shared-context.md` -> `.github/skills/shared-vue-testing-context/SKILL.md`

## Rollout Order

1. Scaffold repository structure and migration docs.
2. Migrate story workflow skills.
3. Migrate Vue workflow skills.
4. Run quality gate review and resolve findings.
5. Continue issue-by-issue branch and PR delivery.
