const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const INSTALLER = path.join(__dirname, '..', 'bin', 'skills.js');

test('CLI help does not advertise prompt installation', () => {
  const result = spawnSync(process.execPath, [INSTALLER, '--help'], { encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /--with-prompts|\.github\/prompts/);
});

test('install -h shows help instead of creating a target directory', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-install-help-test-'));
  try {
    const result = runInstaller(['-h'], { cwd });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Usage:/);
    assert.equal(fs.existsSync(path.join(cwd, '-h')), false);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('list rejects a missing source path', () => {
  const result = spawnSync(process.execPath, [INSTALLER, 'list', '--source'], { encoding: 'utf8' });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--source requires a path/);
});

test('installed workflows retain distinct Jira and Vue entry points', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'workflow-skills-test-'));
  try {
    const installed = runInstaller([target]);
    assert.equal(installed.status, 0, installed.stderr);
    const skillsRoot = path.join(target, '.github', 'skills');
    assert.equal(fs.existsSync(path.join(target, '.github', 'prompts')), false);
    const phases = ['story-planner', 'story-implementer', 'story-verifier', 'bug-investigate', 'bug-fix', 'bug-verify'];
    for (const phase of phases) {
      const content = fs.readFileSync(path.join(skillsRoot, phase, 'SKILL.md'), 'utf8');
      assert.match(content, /disable-model-invocation: true/);
      assert.match(content, /Read and follow.*\[workflow-execution\]\(\.\.\/workflow-execution\/SKILL\.md\)/);
    }
    for (const name of ['vue-bug-fixer-regression-guard', 'vue-bug-fix-reviewer']) {
      const content = fs.readFileSync(path.join(skillsRoot, name, 'SKILL.md'), 'utf8');
      assert.match(content, new RegExp(`name: ${name}`));
      assert.match(content, /disable-model-invocation: true/);
      assert.match(content, /\[vue-testing\]\(\.\.\/vue-testing\/SKILL\.md\)/);
    }
    for (const supporting of ['workflow-execution', 'vue-testing']) {
      const content = fs.readFileSync(path.join(skillsRoot, supporting, 'SKILL.md'), 'utf8');
      assert.match(content, new RegExp(`name: ${supporting}`));
      assert.match(content, /user-invocable: false/);
      assert.doesNotMatch(content, /disable-model-invocation: true/);
    }
    for (const retired of ['shared-vue-testing-context', 'vue-testing-library-black-box']) {
      assert.equal(fs.existsSync(path.join(skillsRoot, retired)), false, retired);
    }
    for (const phase of phases) {
      const content = fs.readFileSync(path.join(skillsRoot, phase, 'SKILL.md'), 'utf8');
      assert.match(content, /\[vue-testing\]\(\.\.\/vue-testing\/SKILL\.md\)/);
    }
    const bugFix = fs.readFileSync(path.join(skillsRoot, 'bug-fix', 'SKILL.md'), 'utf8');
    assert.match(bugFix, /fails for the expected reason before changing implementation code/);
    const storyReview = fs.readFileSync(path.join(skillsRoot, 'story-verifier', 'SKILL.md'), 'utf8');
    assert.match(storyReview, /acceptance criteria/);
    const bugReview = fs.readFileSync(path.join(skillsRoot, 'bug-verify', 'SKILL.md'), 'utf8');
    assert.match(bugReview, /root cause/);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

function runInstaller(args, options = {}) {
  return spawnSync(process.execPath, [INSTALLER, 'install', ...args], { encoding: 'utf8', ...options });
}

test('installer copies skills only and keeps dry-run side-effect free', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-install-test-'));
  try {
    const source = path.join(root, 'source');
    const target = path.join(root, 'target');
    fs.mkdirSync(path.join(source, '.github', 'skills', 'sample'), { recursive: true });
    fs.writeFileSync(path.join(source, '.github', 'skills', 'sample', 'SKILL.md'), '# Skill\n');

    const result = runInstaller([target, '--source', source, '--dry-run']);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /skills copied: 1/);
    assert.equal(fs.existsSync(target), false);

    const installed = runInstaller([target, '--source', source]);
    assert.equal(installed.status, 0, installed.stderr);
    assert.equal(fs.existsSync(path.join(target, '.github', 'skills', 'sample', 'SKILL.md')), true);
    assert.equal(fs.existsSync(path.join(target, '.github', 'prompts')), false);

    const existingSkill = path.join(target, '.github', 'skills', 'sample', 'SKILL.md');
    fs.mkdirSync(path.dirname(existingSkill), { recursive: true });
    fs.writeFileSync(existingSkill, '# Existing\n');

    const skipped = runInstaller([target, '--source', source, '--dry-run']);
    assert.equal(skipped.status, 0, skipped.stderr);
    assert.match(skipped.stdout, /skills copied: 0/);
    assert.match(skipped.stdout, /skills skipped: 1/);
    assert.equal(fs.readFileSync(existingSkill, 'utf8'), '# Existing\n');

    const forced = runInstaller([target, '--source', source, '--dry-run', '--force']);
    assert.equal(forced.status, 0, forced.stderr);
    assert.match(forced.stdout, /skills copied: 1/);
    assert.equal(fs.readFileSync(existingSkill, 'utf8'), '# Existing\n');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('installer rejects the removed --with-prompts option', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-install-test-'));
  try {
    const source = path.join(root, 'source');
    const target = path.join(root, 'target');
    fs.mkdirSync(path.join(source, '.github', 'skills', 'sample'), { recursive: true });
    fs.writeFileSync(path.join(source, '.github', 'skills', 'sample', 'SKILL.md'), '# Skill\n');

    const result = runInstaller([target, '--source', source, '--with-prompts']);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unknown option: --with-prompts/i);
    assert.equal(fs.existsSync(target), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('npm package allowlist contains Copilot skills but no prompt files', () => {
  const packageJson = require('../package.json');

  assert.deepEqual(packageJson.files, ['bin', '.github/skills', 'README.md']);
  assert.equal(fs.existsSync(path.join(__dirname, '..', '.github', 'prompts', 'story-plan.prompt.md')), false);
  assert.equal(fs.existsSync(path.join(__dirname, '..', '.codex', 'prompts')), false);
});

test('installer skips --source values when selecting a positional target', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-source-order-test-'));
  try {
    const source = path.join(root, 'source');
    const target = path.join(root, 'target');
    const sourceSkill = path.join(source, '.github', 'skills', 'sample', 'SKILL.md');
    fs.mkdirSync(path.dirname(sourceSkill), { recursive: true });
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(sourceSkill, '# Source skill\n');

    const result = runInstaller(['--source', source, target]);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(path.join(target, '.github', 'skills', 'sample', 'SKILL.md'), 'utf8'), '# Source skill\n');
    assert.equal(fs.existsSync(path.join(source, '.github', 'skills', 'sample', 'SKILL.md')), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('installer defaults target to cwd when --source is the only path argument', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-source-default-test-'));
  try {
    const source = path.join(root, 'source');
    const target = path.join(root, 'target');
    const sourceSkill = path.join(source, '.github', 'skills', 'sample', 'SKILL.md');
    fs.mkdirSync(path.dirname(sourceSkill), { recursive: true });
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(sourceSkill, '# Source skill\n');

    const result = runInstaller(['--source', source], { cwd: target });

    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(path.join(target, '.github', 'skills', 'sample', 'SKILL.md'), 'utf8'), '# Source skill\n');
    assert.equal(fs.existsSync(path.join(source, '.github', 'skills', 'sample', 'SKILL.md')), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('lockfile resolves dependencies from the public npm registry', () => {
  const lockfile = require('../package-lock.json');

  for (const [name, dependency] of Object.entries(lockfile.packages)) {
    if (!name.startsWith('node_modules/')) continue;
    assert.match(dependency.resolved, /^https:\/\/registry\.npmjs\.org\//, name);
  }
});

test('installer preserves existing files unless force is specified', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-install-test-'));
  try {
    const source = path.join(root, 'source');
    const target = path.join(root, 'target');
    const sourceSkill = path.join(source, '.github', 'skills', 'sample', 'SKILL.md');
    const targetSkill = path.join(target, '.github', 'skills', 'sample', 'SKILL.md');
    fs.mkdirSync(path.dirname(sourceSkill), { recursive: true });
    fs.mkdirSync(path.dirname(targetSkill), { recursive: true });
    fs.writeFileSync(sourceSkill, '# Updated skill\n');
    fs.writeFileSync(targetSkill, '# Existing skill\n');

    const skipped = runInstaller([target, '--source', source]);
    assert.equal(skipped.status, 0, skipped.stderr);
    assert.match(skipped.stdout, /skills skipped: 1/);
    assert.equal(fs.readFileSync(targetSkill, 'utf8'), '# Existing skill\n');

    const forced = runInstaller([target, '--source', source, '--force']);
    assert.equal(forced.status, 0, forced.stderr);
    assert.equal(fs.readFileSync(targetSkill, 'utf8'), '# Updated skill\n');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('skill inventory excludes directories without a SKILL.md file', () => {
  const source = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-list-test-'));
  try {
    const skillsRoot = path.join(source, '.github', 'skills');
    fs.mkdirSync(path.join(skillsRoot, 'real-skill'), { recursive: true });
    fs.mkdirSync(path.join(skillsRoot, 'empty-retired-skill'), { recursive: true });
    fs.writeFileSync(path.join(skillsRoot, 'real-skill', 'SKILL.md'), '# Skill\n');

    const result = spawnSync(process.execPath, [INSTALLER, 'list', '--source', source], { encoding: 'utf8' });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Found 1 skill\(s\):/);
    assert.match(result.stdout, /- real-skill/);
    assert.doesNotMatch(result.stdout, /empty-retired-skill/);
  } finally {
    fs.rmSync(source, { recursive: true, force: true });
  }
});
