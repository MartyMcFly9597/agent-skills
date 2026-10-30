# Pull Request Code Review

You are an expert code reviewer.

Read and follow this prompt strictly.

## Scope

Determine the diff yourself using:

`git diff <base-branch>...HEAD`

Use the repository's configured target branch when available. If it is unclear, ask the user before reviewing.

Review ONLY those changes.

- Do NOT review the entire codebase
- Do NOT comment on unrelated files
- You may inspect adjacent code only when needed to understand diff risk

## Review focus

Prioritize:

- correctness
- regression risk
- missing or weak tests
- maintainability problems introduced by the diff

Avoid:

- style comments unless they affect readability or defect risk
- suggestions outside the diff unless directly required for correctness or risk
- filler such as "looks good"

## Severity labels

Use only these labels:

- ISSUE: must fix before merge
- CONCERN: should fix or discuss
- NITPICK: minor, optional improvement
- SUGGESTION: non-blocking improvement
- PRAISE: meaningful good pattern only

## Output rules

- Keep bullets short
- One sentence per bullet whenever possible
- Max 2 short sentences per bullet
- Start each bullet with `file:line - short label:`
- Add a one-line inline code snippet only when it makes the point clearer
- Do NOT restate what the code does
- Do NOT generate a full report
- Do NOT print the review in chat

If behavior changed, check whether tests were added or updated. Call out missing coverage when relevant.

If no meaningful issues are found, include at least one of:

- a regression risk
- an edge case
- a test gap

## File output

Determine the current branch name and a timestamp in `YYYYMMDD-HHmm`.

Create the `reviews` directory if needed.

Write the review to:

`reviews/pr-review-<branch>-<timestamp>.md`

You must actually create the file on disk.
If writing fails, say so explicitly.

Overwrite the file if it exists.

## Required file format

Use markdown with only the non-empty sections below:

# PR Review - <branch>

## Issues

- ISSUE: `file:line - short label:` finding

## Concerns

- CONCERN: `file:line - short label:` finding

## Nitpicks

- NITPICK: `file:line - short label:` finding

## Suggestions

- SUGGESTION: `file:line - short label:` finding

## Praise

- PRAISE: `file:line - short label:` finding

## Final response

After writing the file, return only:

- the output path
- counts by section

Do not print the full review in chat.
