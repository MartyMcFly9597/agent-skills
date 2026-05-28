# NPM Publish Checklist

Use this checklist before publishing the `skills` CLI package.

## Preflight

- [ ] Confirm you are on `main` and up to date:
  - `git checkout main`
  - `git pull --ff-only`
- [ ] Ensure working tree is clean:
  - `git status --short`
- [ ] Run CLI checks:
  - `npm run skills:list`
  - `npm run skills:doctor`
  - `npm run skills:install -- . --dry-run --with-prompts`

## Package Metadata

- [ ] Verify package name in `package.json`
  - current: `@martymcfly9597/agent-skills`
- [ ] Verify `bin.skills` points to `bin/skills.js`
- [ ] Verify `files` includes required runtime assets:
  - `bin`
  - `.github/skills`
  - `.github/prompts`

## NPM Auth and Access

- [ ] Log in to npm:
  - `npm login`
- [ ] Confirm account and scope access:
  - `npm whoami`
- [ ] Check package name availability if changing names:
  - `npm view @martymcfly9597/agent-skills version`

## Version and Publish

- [ ] Bump version (choose one):
  - `npm version patch`
  - `npm version minor`
  - `npm version major`
- [ ] Publish:
  - `npm publish --access public`

## Post Publish Validation

- [ ] Validate package metadata:
  - `npm view @martymcfly9597/agent-skills version`
- [ ] Validate npx execution:
  - `npx @martymcfly9597/agent-skills list`
  - `npx @martymcfly9597/agent-skills doctor`
- [ ] Validate install flow in a test workspace:
  - `npx @martymcfly9597/agent-skills install . --with-prompts`

## Optional: Unscoped Name (`skills`)

- [ ] Check whether package name `skills` is available.
- [ ] If acquired, publish and test:
  - `npx skills list`
  - `npx skills install . --with-prompts`
