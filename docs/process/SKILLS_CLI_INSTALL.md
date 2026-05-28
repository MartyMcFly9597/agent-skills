# Skills CLI Install and Publish Guide

This repo now includes a CLI command named `skills`.

## Local (no publish required)

From this repo:

1. Install dependencies (none external right now):
   - `npm install`
2. Run directly:
   - `npm run skills:list`
   - `npm run skills:install -- . --with-prompts`
3. Optional global link for local machine:
   - `npm link`
   - `skills list`

## NPX (after npm publish)

Once published, users can run:

- `npx @martymcfly9597/agent-skills list`
- `npx @martymcfly9597/agent-skills install . --with-prompts`

If you later own the unscoped package name `skills`, users can run:

- `npx skills list`
- `npx skills install . --with-prompts`

## Commands

- `skills list`: list available skill packages in the source repo/package
- `skills install [target]`: copy `.github/skills` into target workspace
- `skills install [target] --with-prompts`: also copy `.github/prompts`
- `skills doctor`: print environment and source directory checks

## Common flags

- `--force`: overwrite existing files
- `--dry-run`: show what would be copied without writing files
- `--source <path>`: override source root (useful during development)
