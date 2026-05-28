# External AI Review Prompt

Use this prompt with a non-Copilot AI reviewer (for example, ChatGPT, Claude, or Gemini) to get an independent quality pass.

## Prompt

Review this repository's migrated skills and prompts for quality risks.

Scope:
- `.github/skills/**/SKILL.md`
- `.github/prompts/**/*.md`
- `docs/migration/MIGRATION_MAP.md`
- `docs/quality/REVIEW_CHECKLIST.md`

Review goals:
1. Identify ambiguity that could cause inconsistent execution.
2. Detect overlaps/conflicts across skills.
3. Flag missing constraints that could cause unsafe behavior.
4. Evaluate whether each skill has a measurable output contract.
5. Check whether source traceability is preserved.

Output format:
- issue: must fix
- concern: should fix or discuss
- suggestion: optional improvement
- verified: solid pattern to keep

Extra requirement:
- Include concrete file paths and quote exact problematic lines where possible.
- Propose concise rewrites for must-fix items.
