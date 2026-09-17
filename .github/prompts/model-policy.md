# Model Selection Policy

Portable policy pinning model + thinking level per work phase. Goal: frontier reasoning only where wrong answers are expensive; cheapest capable model everywhere else; cross-vendor verification always.

Cost basis: VACV Copilot Cost & Value Report (Confluence PAT/5183799418, 2026-09-15). 100 credits = 1.00 USD, prices per 1M input tokens.

---

## Hard rules

1. NEVER use Auto. Explicit model selection only.
2. NEVER verify/review with the vendor that authored the change. Cross-vendor is mandatory.
3. NEVER use unknown-cost models without explicit user approval: GPT-6 Astra, GPT-5.6 Sol/Terra/Luna, GPT-5.3-Codex (pricing undocumented — uncontrolled spend).
4. Claude Fable 5/5.1 (1,000 cr) is fallback-only — use when Claude Opus 5 (500 cr, rated higher) and Sonnet 5 are unavailable.
5. Extended thinking only where the phase table grants it — it multiplies cost 1.5–2.5x.
6. At the start of any phase, state the model you are running as. If it does not match the phase table, STOP and ask the user to switch. Do not proceed on a mismatched model.

---

## Cost tiers (credits / 1M input)

| Tier | Models |
| --- | --- |
| Mechanical | MAI-Code-1.1-Flash 20 · Gemini 3.7/3.6 Flash 75 · GPT-5.4 mini 75 · Claude Haiku 4.5 100 |
| Workhorse | Claude Sonnet 5 200 (ext 300–500) · Grok 4.6/4.5 200 · GPT-5.4 250 (ext 375–625) |
| Frontier | Claude Opus 5 500 (ext 750–1,250) · GPT-5.4 long-context 500 |
| Restricted | Claude Fable 5/5.1 1,000 · Opus 4.8 fast 1,000 · GPT-6 Astra ? · GPT-5.6 family ? |

---

## Phase → model table (ENFORCED)

| Phase | Model | Thinking | Fallback |
| --- | --- | --- | --- |
| Story planning (PLAN.md) / architecture | Claude Opus 5 | Extended | Claude Fable 5 |
| Implementation step (SPA or e2e) | Claude Sonnet 5 | Standard | GPT-5.4 |
| Unit / e2e test authoring | Claude Sonnet 5 | Standard | Grok 4.6 |
| Mechanical: renames, boilerplate, formatting, checklist updates, commit messages | Gemini 3.7 Flash | Low | Claude Haiku 4.5, GPT-5.4 mini |
| Verify / gate review (story verify, bug verify) | GPT-5.4 | Extended | Grok 4.6 |
| PR review (complex diff) | GPT-5.4 | Extended | Grok 4.6 |
| Second opinion (high-stakes) | Gemini 3.7 Flash | High | Grok 4.6 |
| Bug investigation (root cause) | Claude Sonnet 5 | Standard | GPT-5.4 |
| Bug fix execution | Claude Sonnet 5 | Standard | GPT-5.4 |
| Large-context analysis (>200K, whole-repo, migration mapping) | Gemini 3.7 Flash (1M ctx) | Medium | GPT-5.4 long context |
| Docs / summaries / Jira comments | Claude Haiku 4.5 | Low | Gemini 3.7 Flash |

Vendor lanes (fixed): **Anthropic authors code. OpenAI / xAI / Google verify, review, and give second opinions.** Never ask a bigger model of the same vendor for a second opinion — change vendor.

---

## Escalation ladder

- A step fails verification twice at its assigned tier → escalate ONE tier for that step only, then drop back. Record the escalation in the plan file's completion notes.
- Straight to Frontier (Claude Opus 5 extended) when any of: security-sensitive path, data integrity, concurrency/state machines, API contracts across systems, refactor spanning 5+ files cross-module, irreversible operations.
- Tricky production bug where Sonnet 5 stalls → Claude Opus 5 extended for diagnosis only; fix returns to Sonnet 5.
- Never escalate mechanical work. Never de-escalate verification below Workhorse.
- Restricted tier requires explicit user approval per run.

## Cross-vendor verification

- Author vendor ≠ reviewer vendor, always. Claude-authored code → OpenAI, xAI, or Google reviews.
- High-stakes changes: two reviewers from two different non-author vendors. Distinct vendors find distinct real issues.
- Reviewer disagreement = investigate before merging. Agreement = ship.
- Subagent reviews must pass the cross-vendor model explicitly (e.g. runSubagent `model` param) — never inherit the authoring model.
- Verify every reviewer claim against source before implementing it; each review round typically contains at least one refuted finding.

## Token hygiene

- Fresh context per step/phase (multi-context execution): PLAN.md / BUGFIX.md carries all state; never drag prior chat history forward.
- Order steps touching the same files back-to-back — cached input tokens are only discounted within back-to-back calls in one session.
- Read large file ranges once; never re-paste content the model already has in context.
- Keep PLAN.md / BUGFIX.md lean — they are re-read on every step and resume.
- Reviews get the diff, not the repo. Scope context to changed files plus direct dependencies.
- Batch related questions into one message; single clear instructions beat ping-pong turns.

---

## Consuming this policy

- Prompts reference this file and name their phase, e.g. `Model per [model policy](model-policy.md) — phase: implementation`.
- Planning prompts MUST stamp every plan step with a `model:` field from the phase table so each step is executable in a fresh context on the correct (cheapest capable) model.
- Executing prompts MUST honor the step's `model:` field and apply rule 6 before doing any work.
- Verifying prompts MUST flag steps executed on the wrong tier and any Restricted-tier usage lacking recorded approval.
