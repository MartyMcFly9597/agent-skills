# Skills Quality Review Checklist

Use this checklist for every migrated skill and prompt pair.

## 1. Clarity

- Is the skill purpose explicit and single-purpose?
- Are trigger conditions in "When to use" concrete?
- Are required inputs specific and complete?

## 2. Enforceability

- Does the procedure include actionable steps?
- Are output requirements measurable?
- Are non-negotiable rules testable in review?

## 3. Overlap and Conflict

- Does this skill duplicate another skill's scope?
- Are shared constraints centralized in one shared-context skill?
- Do prompt and skill rules conflict anywhere?

## 4. Source Traceability

- Does the skill list source prompt files?
- Is mapping recorded in `docs/migration/MIGRATION_MAP.md`?
- Are source prompts retained for backward compatibility?

## 5. Safety and Regression Risk

- Does the skill prevent risky shortcuts?
- Are verification/testing expectations explicit where needed?
- Is scope creep prevented by constraints?

## 6. Completeness

- Are all mapped files migrated?
- Are names and paths consistent with repo conventions?
- Is README/docs updated where discoverability is needed?

## Decision

- PASS: all sections acceptable; no blocking findings.
- PASS WITH CHANGES: non-blocking improvements required.
- FAIL: blocking ambiguity, conflicts, or missing controls.
