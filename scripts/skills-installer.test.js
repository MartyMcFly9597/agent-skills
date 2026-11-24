const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const YAML = require('yaml');

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
      const lines = content.split(/\r?\n/);
      assert.equal(lines[0], '---', `${phase} frontmatter starts with YAML delimiter`);
      const end = lines.indexOf('---', 1);
      assert.notEqual(end, -1, `${phase} frontmatter closes`);
      const document = YAML.parseDocument(lines.slice(1, end).join('\n'), { uniqueKeys: true });
      assert.deepEqual(document.errors, [], `${phase} frontmatter is valid YAML`);
      assert.ok(YAML.isMap(document.contents), `${phase} frontmatter is a mapping`);
      const fields = document.toJS();
      assert.equal(fields.name, phase);
      assert.equal(typeof fields.description, 'string');
      assert.ok(fields.description.length > 0);
      assert.equal(fields['disable-model-invocation'], true);
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

test('installed skills tree passes the Markdown link check', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'installed-skills-link-check-'));
  try {
    const installed = runInstaller([target]);
    assert.equal(installed.status, 0, installed.stderr);

    const checkedInstall = spawnSync(process.execPath, [
      path.join(__dirname, 'check-skills.js'),
      '--root',
      target,
    ], { encoding: 'utf8' });
    assert.equal(checkedInstall.status, 0, [checkedInstall.stdout, checkedInstall.stderr].filter(Boolean).join('\n'));
    assert.match(checkedInstall.stdout, /Markdown links: \d+ relative links checked/);
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

test('package and lockfile require Node 22 or newer', () => {
  const packageJson = require('../package.json');
  const lockfile = require('../package-lock.json');

  assert.equal(packageJson.engines.node, '>=22');
  assert.equal(lockfile.packages[''].engines.node, '>=22');
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

// libuv resolves os.homedir() from USERPROFILE on Windows and HOME elsewhere.
function userInstallEnv(home) {
  return { ...process.env, HOME: home, USERPROFILE: home };
}

test('workspace installs copy only skills and never write to the user home', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-workspace-scope-test-'));
  try {
    const source = path.join(root, 'source');
    const files = {
      '.github/skills/sample/SKILL.md': '# Skill\n',
      '.github/agents/reviewer.agent.md': '# Agent\n',
      '.github/instructions/review.instructions.md': '# Instructions\n',
      '.github/copilot-instructions.md': '# Repository instructions\n',
      'AGENTS.md': '# Project instructions\n',
      '.agents/skills/other/SKILL.md': '# Other harness skill\n',
    };
    for (const [relative, content] of Object.entries(files)) {
      const file = path.join(source, relative);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
    }

    for (const mode of ['explicit', 'default']) {
      const target = path.join(root, mode);
      const home = path.join(root, `${mode}-home`);
      fs.mkdirSync(target);
      fs.mkdirSync(home);
      const args = mode === 'explicit' ? [target, '--source', source] : ['--source', source];
      const result = runInstaller(args, { cwd: target, env: userInstallEnv(home) });

      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /Scope: workspace/);
      assert.equal(fs.readFileSync(path.join(target, '.github', 'skills', 'sample', 'SKILL.md'), 'utf8'), '# Skill\n');
      assert.deepEqual(fs.readdirSync(target), ['.github'], mode);
      assert.deepEqual(fs.readdirSync(path.join(target, '.github')), ['skills'], mode);
      assert.deepEqual(fs.readdirSync(home), [], `${mode} install must leave HOME and USERPROFILE untouched`);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('user install writes personal Copilot skills and keeps dry-run side-effect free', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-user-install-test-'));
  try {
    const source = path.join(root, 'source');
    const home = path.join(root, 'home');
    fs.mkdirSync(path.join(source, '.github', 'skills', 'sample'), { recursive: true });
    fs.mkdirSync(home);
    fs.writeFileSync(path.join(source, '.github', 'skills', 'sample', 'SKILL.md'), '# Skill\n');
    const env = userInstallEnv(home);

    const dryRun = runInstaller(['--user', '--source', source, '--dry-run'], { env });
    assert.equal(dryRun.status, 0, dryRun.stderr);
    assert.match(dryRun.stdout, /Scope: user/);
    assert.match(dryRun.stdout, /skills copied: 1/);
    assert.equal(fs.existsSync(path.join(home, '.copilot')), false);

    const installed = runInstaller(['--user', '--source', source], { env });
    assert.equal(installed.status, 0, installed.stderr);
    assert.equal(fs.readFileSync(path.join(home, '.copilot', 'skills', 'sample', 'SKILL.md'), 'utf8'), '# Skill\n');
    assert.equal(fs.existsSync(path.join(home, '.copilot', 'skills', '.github')), false);
    assert.equal(fs.existsSync(path.join(home, '.github')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('user install rejects a target path', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-user-install-test-'));
  try {
    const source = path.join(root, 'source');
    const home = path.join(root, 'home');
    const target = path.join(root, 'target');
    fs.mkdirSync(path.join(source, '.github', 'skills', 'sample'), { recursive: true });
    fs.mkdirSync(home);
    fs.writeFileSync(path.join(source, '.github', 'skills', 'sample', 'SKILL.md'), '# Skill\n');

    const result = runInstaller(['--user', target, '--source', source], { env: userInstallEnv(home) });

    assert.equal(result.status, 2);
    assert.match(result.stderr, /--user cannot be combined with a target path/);
    assert.equal(fs.existsSync(target), false);
    assert.equal(fs.existsSync(path.join(home, '.copilot')), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('user install from a dependency-free copy installs every repository skill', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-clean-clone-test-'));
  try {
    const repoRoot = path.join(__dirname, '..');
    const clone = path.join(root, 'clone');
    const home = path.join(root, 'home');
    fs.cpSync(path.join(repoRoot, 'bin'), path.join(clone, 'bin'), { recursive: true });
    fs.cpSync(path.join(repoRoot, '.github', 'skills'), path.join(clone, '.github', 'skills'), { recursive: true });
    fs.mkdirSync(home);

    const result = spawnSync(process.execPath, [path.join(clone, 'bin', 'skills.js'), 'install', '--user'], {
      cwd: root,
      encoding: 'utf8',
      env: userInstallEnv(home),
    });

    assert.equal(result.status, 0, result.stderr);
    const sourceSkills = path.join(repoRoot, '.github', 'skills');
    const installedSkills = path.join(home, '.copilot', 'skills');
    const sourceFiles = fs.readdirSync(sourceSkills, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile());
    assert.ok(sourceFiles.length > 0);
    for (const entry of sourceFiles) {
      const relative = path.relative(sourceSkills, path.join(entry.parentPath, entry.name));
      assert.equal(
        fs.readFileSync(path.join(installedSkills, relative), 'utf8'),
        fs.readFileSync(path.join(sourceSkills, relative), 'utf8'),
        relative,
      );
    }
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
