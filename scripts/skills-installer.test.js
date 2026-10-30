const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const INSTALLER = path.join(__dirname, '..', 'bin', 'skills.js');

function runInstaller(args) {
  return spawnSync(process.execPath, [INSTALLER, 'install', ...args], { encoding: 'utf8' });
}

test('installer dry-run counts nested files without writing them', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-install-test-'));
  try {
    const source = path.join(root, 'source');
    const target = path.join(root, 'target');
    fs.mkdirSync(path.join(source, '.github', 'skills', 'sample'), { recursive: true });
    fs.mkdirSync(path.join(source, '.github', 'prompts'), { recursive: true });
    fs.writeFileSync(path.join(source, '.github', 'skills', 'sample', 'SKILL.md'), '# Skill\n');
    fs.writeFileSync(path.join(source, '.github', 'prompts', 'sample.prompt.md'), '# Prompt\n');

    const result = runInstaller([target, '--source', source, '--with-prompts', '--dry-run']);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /skills copied: 1/);
    assert.match(result.stdout, /prompts copied: 1/);
    assert.equal(fs.existsSync(target), false);

    const existingSkill = path.join(target, '.github', 'skills', 'sample', 'SKILL.md');
    fs.mkdirSync(path.dirname(existingSkill), { recursive: true });
    fs.writeFileSync(existingSkill, '# Existing\n');

    const skipped = runInstaller([target, '--source', source, '--with-prompts', '--dry-run']);
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
