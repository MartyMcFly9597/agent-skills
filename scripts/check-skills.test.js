const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const PHASE_SKILLS = [
  'story-planner',
  'story-implementer',
  'story-verifier',
  'bug-investigate',
  'bug-fix',
  'bug-verify',
];

function runChecker(readme, extraFiles = {}, args = [], packageFiles = ['.github/skills', 'README.md'], includeSkills = true, env = process.env) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-skills-check-'));
  try {
    if (includeSkills) {
      for (const name of PHASE_SKILLS) {
        const directory = path.join(root, '.github', 'skills', name);
        fs.mkdirSync(directory, { recursive: true });
        fs.writeFileSync(path.join(directory, 'SKILL.md'), [
          '---',
          `name: ${name}`,
          'description: Test skill description',
          'disable-model-invocation: true',
          '---',
          '',
        ].join('\n'));
      }
    }

    fs.writeFileSync(path.join(root, 'README.md'), readme);
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ files: packageFiles }));
    for (const [relativePath, content] of Object.entries(extraFiles)) {
      const filePath = path.join(root, relativePath);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
    }

    return spawnSync(process.execPath, [
      path.join(__dirname, 'check-skills.js'),
      '--root',
      root,
      ...args.map((argument) => {
        if (argument === '__ROOT__') return root;
        if (argument === '__PACKAGE_ROOT__') return path.join(root, 'package-source');
        return argument;
      }),
    ], { encoding: 'utf8', env });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('validates reference-style relative Markdown targets', () => {
  const result = runChecker('[guide][docs]\n\n[docs]: docs/guide.md\n');

  assert.equal(result.status, 1);
  assert.match(result.stderr, /relative Markdown link target is missing/);
});

test('counts existing reference-style relative Markdown targets', () => {
  const result = runChecker('[guide][docs]\n\n[docs]: docs/guide.md\n', {
    'docs/guide.md': '# Guide\n',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 relative links checked/);
});

test('limits shipped Markdown link checks to package allowlist files', () => {
  const result = runChecker('# Public package\n', {
    'notes.md': '[missing](not-shipped.md)\n',
  }, ['--shipped', '--package-root', '__ROOT__']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /0 relative links checked/);
});

test('expands package allowlist globs for shipped Markdown checks', () => {
  const result = runChecker('# Public package\n', {
    'docs/index.md': '[guide](guide.md)\n',
    'docs/guide.md': '# Guide\n',
  }, ['--shipped', '--package-root', '__ROOT__'], ['docs/*.md']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 relative links checked/);
});

test('globstar includes matching files at the current and nested directory levels', () => {
  const result = runChecker('# Public package\n', {
    'docs/index.md': '[guide](guide.md)\n',
    'docs/guide.md': '# Guide\n',
    'docs/nested/index.md': '[guide](../guide.md)\n',
  }, ['--shipped', '--package-root', '__ROOT__'], ['docs/**/*.md']);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 relative links checked/);
});

test('fails when a phase skill disables explicit invocation', () => {
  const result = runChecker('# Public package\n', {
    '.github/skills/bug-fix/SKILL.md': [
      '---',
      'name: bug-fix',
      'description: Test skill description',
      'disable-model-invocation: false',
      '---',
      '',
    ].join('\n'),
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /explicit workflow must disable model invocation/);
});

test('fails on a private-looking host without echoing the matched text', () => {
  const simulatedHost = ['private', 'invalid', 'internal'].join('.');
  const result = runChecker(`host: ${simulatedHost}.\n`);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.equal(result.status, 1);
  assert.match(output, /private-looking host/);
  assert.doesNotMatch(output, new RegExp(simulatedHost.replaceAll('.', '\\.')));
});

test('validates inline relative Markdown targets', () => {
  const result = runChecker('[guide](docs/missing.md)\n');

  assert.equal(result.status, 1);
  assert.match(result.stderr, /relative Markdown link target is missing/);
});

test('accepts angle-bracket and titled inline Markdown targets', () => {
  const result = runChecker('[angle](<docs/guide.md>) [titled](docs/guide.md "title")\n', {
    'docs/guide.md': '# Guide\n',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 relative links checked/);
});

test('accepts parentheses in an angle-bracket Markdown destination', () => {
  const result = runChecker('[guide](<docs/guide(v2).md>)\n', {
    'docs/guide(v2).md': '# Guide\n',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 relative links checked/);
});

test('reports missing phase skills without crashing when the skills directory is absent', () => {
  const result = runChecker('# Public package\n', {}, [], ['README.md'], false);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing phase skill/);
  assert.match(`${result.stdout}\n${result.stderr}`, /Summary:/);
});

test('scans the checked root in shipped mode when package metadata comes from another root', () => {
  const simulatedHost = ['private', 'invalid', 'internal'].join('.');
  const result = runChecker(`host: ${simulatedHost}\n`, {
    'package-source/package.json': JSON.stringify({ files: ['README.md'] }),
    'package-source/README.md': '# Package source\n',
  }, ['--shipped', '--package-root', '__PACKAGE_ROOT__']);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.equal(result.status, 1);
  assert.match(output, /private-looking host/);
  assert.doesNotMatch(output, new RegExp(simulatedHost.replaceAll('.', '\\.')));
});

test('fails on wiki document identifiers without echoing matched text', () => {
  const documentId = ['PAGE', '12345'].join('/');
  const result = runChecker(`wiki reference: ${documentId}\n`);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.equal(result.status, 1);
  assert.match(output, /wiki\/document identifier/);
  assert.doesNotMatch(output, new RegExp(documentId.replace('/', '\\/')));
});

test('reports review-only privacy patterns with accurate line numbers', () => {
  const result = runChecker('# Heading\nExternal reference: https://example.com\n');

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REVIEW README\.md:2 external URL or email/);
});

test('reports issue, numeric, pricing, and context patterns without failing', () => {
  const issueKey = ['AB', '123'].join('-');
  const longNumber = ['1234', '5678'].join('');
  const result = runChecker([
    `Issue: ${issueKey}`,
    `Reference: ${longNumber}`,
    'Estimate: 12 USD cost',
    'Context: customer workflow',
  ].join('\n'));

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /REVIEW README\.md:1 issue-key-shaped identifier/);
  assert.match(result.stdout, /REVIEW README\.md:2 long numeric identifier/);
  assert.match(result.stdout, /REVIEW README\.md:3 pricing or cost terminology/);
  assert.match(result.stdout, /REVIEW README\.md:4 sensitive-context terminology/);
});

test('fails on an external privacy denylist match with its line number', () => {
  const denylistPath = path.join(os.tmpdir(), `skills-denylist-${process.pid}`);
  fs.writeFileSync(denylistPath, 'never-public-token');
  try {
    const result = runChecker('# Heading\nMarker: never-public-token\n', {}, [], undefined, true, {
      ...process.env,
      PRIVACY_DENYLIST: denylistPath,
    });
    const output = `${result.stdout}\n${result.stderr}`;

    assert.equal(result.status, 1);
    assert.match(output, /FAIL README\.md:2 privacy deny-list match/);
    assert.doesNotMatch(output, /never-public-token/);
  } finally {
    fs.rmSync(denylistPath, { force: true });
  }
});