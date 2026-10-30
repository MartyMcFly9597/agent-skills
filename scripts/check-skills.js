#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const PHASE_SKILLS = new Set([
  'story-planner',
  'story-implementer',
  'story-verifier',
  'bug-investigate',
  'bug-fix',
  'bug-verify',
]);

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage']);

function parseArgs(args) {
  const options = {
    root: process.cwd(),
    packageRoot: undefined,
    shipped: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--root' || argument === '--package-root') {
      const value = args[index + 1];
      if (!value) throw new Error(`${argument} requires a path`);
      options[argument === '--root' ? 'root' : 'packageRoot'] = path.resolve(value);
      index += 1;
    } else if (argument === '--shipped') {
      options.shipped = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  options.root = path.resolve(options.root);
  options.packageRoot = path.resolve(options.packageRoot || options.root);
  return options;
}

function walkFiles(root) {
  const files = [];

  function visit(directory) {
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) visit(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  visit(root);
  return files;
}

function readTextFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.includes(0)) return null;
    return buffer.toString('utf8');
  } catch {
    return null;
  }
}

function relativePath(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end < 0) return null;
  const fields = new Map();
  for (const line of lines.slice(1, end)) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim();
    if (!/^[A-Za-z0-9_-]+$/.test(name)) continue;
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fields.set(name, value);
  }
  return fields;
}

function validateSkillMetadata(skillName, fields, displayPath, seenNames, report) {
  const name = fields.get('name');
  const description = fields.get('description');
  const checks = [
    [Boolean(name) && name === skillName && name.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name), 'name must be a unique lowercase slug matching its folder'],
    [Boolean(description) && description.length <= 1024, 'description is missing or exceeds 1024 characters'],
    [fields.get('disable-model-invocation') === 'true', 'explicit workflow must disable model invocation'],
    [fields.get('user-invocable') !== 'false', 'explicit workflow must remain user-invocable'],
  ];
  let valid = true;
  for (const [passed, message] of checks) {
    if (passed) continue;
    report.fail(displayPath, message);
    valid = false;
  }
  for (const forbidden of ['agent', 'model', 'tools']) {
    if (!fields.has(forbidden)) continue;
    report.fail(displayPath, `unsupported prompt metadata field: ${forbidden}`);
    valid = false;
  }
  if (name && seenNames.has(name)) {
    report.fail(displayPath, 'duplicate skill name');
    valid = false;
  }
  if (name) seenNames.add(name);
  return valid;
}

function validatePhaseSkill(root, skillName, seenNames, report) {
  const filePath = path.join(root, '.github', 'skills', skillName, 'SKILL.md');
  const displayPath = relativePath(root, filePath);
  const content = readTextFile(filePath);
  if (content === null) {
    report.fail(displayPath, 'missing phase skill');
    return false;
  }
  const fields = parseFrontmatter(content);
  if (!fields) {
    report.fail(displayPath, 'missing or invalid YAML frontmatter');
    return false;
  }
  if (!validateSkillMetadata(skillName, fields, displayPath, seenNames, report)) return false;
  report.pass(displayPath, 'frontmatter valid');
  return true;
}

function reviewNonPhaseSkills(root, report) {
  try {
    for (const entry of fs.readdirSync(path.join(root, '.github', 'skills'), { withFileTypes: true })) {
      if (!entry.isDirectory() || PHASE_SKILLS.has(entry.name)) continue;
      const filePath = path.join(root, '.github', 'skills', entry.name, 'SKILL.md');
      if (!fs.existsSync(filePath)) continue;
      const fields = parseFrontmatter(readTextFile(filePath) || '');
      if (!fields) report.review(relativePath(root, filePath), 'non-phase skill lacks frontmatter (out of scope)');
    }
  } catch {
    // Missing phase files are reported above; there are no other skill entries to review.
  }
}

function validatePhaseSkills(root, report) {
  const seenNames = new Set();
  let validCount = 0;
  for (const skillName of PHASE_SKILLS) {
    if (validatePhaseSkill(root, skillName, seenNames, report)) validCount += 1;
  }
  reviewNonPhaseSkills(root, report);
  report.pass('phase skills', `${validCount}/${PHASE_SKILLS.size} valid`);
}

function markdownFiles(files) {
  return files.filter((filePath) => path.extname(filePath).toLowerCase() === '.md');
}

function extractMarkdownLinks(content) {
  const links = [];
  extractInlineMarkdownLinks(content, links);
  extractMarkdownDefinitions(content, links);
  return links;
}

function normalizeInlineTarget(rawTarget) {
  const target = rawTarget.trim();
  if (target.startsWith('<')) {
    const close = target.indexOf('>');
    if (close >= 0) return target.slice(1, close);
  }
  return target.split(/\s+['"]/, 1)[0];
}

function findInlineTargetEnd(content, start) {
  if (content[start] === '<') {
    const angleEnd = content.indexOf('>', start + 1);
    return angleEnd < 0 ? -1 : content.indexOf(')', angleEnd + 1);
  }
  let nestedParens = 0;
  for (let index = start; index < content.length; index += 1) {
    if (content[index] === '\\') {
      index += 1;
      continue;
    }
    if (content[index] === '(') nestedParens += 1;
    if (content[index] !== ')') continue;
    if (nestedParens === 0) return index;
    nestedParens -= 1;
  }
  return -1;
}

function extractInlineMarkdownLinks(content, links) {
  let cursor = 0;
  while (cursor < content.length) {
    const opening = content.indexOf('[', cursor);
    if (opening < 0) return;
    const labelEnd = content.indexOf(']', opening + 1);
    if (labelEnd < 0 || content[labelEnd + 1] !== '(') {
      cursor = opening + 1;
      continue;
    }
    const targetEnd = findInlineTargetEnd(content, labelEnd + 2);
    if (targetEnd < 0) return;
    const rawTarget = content.slice(labelEnd + 2, targetEnd);
    links.push({ target: normalizeInlineTarget(rawTarget), offset: opening });
    cursor = targetEnd + 1;
  }
}

function extractMarkdownDefinitions(content, links) {
  let offset = 0;
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trimStart();
    if (line.length - trimmed.length > 3 || trimmed[0] !== '[') {
      offset += line.length + 1;
      continue;
    }
    const labelEnd = trimmed.indexOf(']');
    if (labelEnd < 1 || trimmed[labelEnd + 1] !== ':') {
      offset += line.length + 1;
      continue;
    }
    const rawTarget = trimmed.slice(labelEnd + 2).trim();
    const target = rawTarget.startsWith('<')
      ? rawTarget.slice(1, rawTarget.indexOf('>'))
      : rawTarget.split(/\s/, 1)[0];
    if (target) links.push({ target, offset });
    offset += line.length + 1;
  }
}

function decodeLinkTarget(target, sourcePath, report) {
  try {
    return decodeURIComponent(target.split(/[?#]/, 1)[0]);
  } catch {
    report.fail(sourcePath, 'invalid percent-encoding in relative Markdown link');
    return null;
  }
}

function validateMarkdownLink(root, filePath, sourcePath, target, report) {
  if (!target || target.startsWith('#') || /^(?:https?:|mailto:|data:)/i.test(target)) return false;
  const destination = decodeLinkTarget(target, sourcePath, report);
  if (destination === null) return false;
  const resolved = path.resolve(path.dirname(filePath), destination);
  const rel = path.relative(root, resolved);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    report.fail(sourcePath, 'relative Markdown link escapes the checked root');
    return false;
  }
  if (!fs.existsSync(resolved)) report.fail(sourcePath, 'relative Markdown link target is missing');
  return true;
}

function validateMarkdownLinks(root, files, report) {
  let checked = 0;
  for (const filePath of markdownFiles(files)) {
    const content = readTextFile(filePath);
    if (content === null) continue;
    const sourcePath = relativePath(root, filePath);
    for (const { target } of extractMarkdownLinks(content)) {
      if (validateMarkdownLink(root, filePath, sourcePath, target, report)) checked += 1;
    }
  }
  report.pass('Markdown links', `${checked} relative links checked`);
}

function escapeRegexCharacter(character) {
  return '^$\\.*+?()[]{}|'.includes(character) ? `\\${character}` : character;
}

function globToRegExp(glob) {
  let expression = String.raw`^`;
  for (let index = 0; index < glob.length; index += 1) {
    if (glob[index] !== '*') {
      expression += escapeRegexCharacter(glob[index]);
      continue;
    }
    if (glob[index + 1] === '*') {
      if (glob[index + 2] === '/') {
        expression += String.raw`(?:.*/)?`;
        index += 2;
      } else {
        expression += String.raw`.*`;
        index += 1;
      }
    } else {
      expression += String.raw`[^/]*`;
    }
  }
  return new RegExp(`${expression}$`);
}

function normalizePackagePattern(entry) {
  if (typeof entry !== 'string') return null;
  const normalized = entry.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, '');
  if (!normalized || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) return null;
  return normalized;
}

function addPackagePatternFiles(pattern, files, included) {
  if (pattern.includes('*')) {
    const matcher = globToRegExp(pattern);
    for (const file of files) if (matcher.test(file)) included.add(file);
    return;
  }
  for (const file of files) {
    if (file === pattern || file.startsWith(`${pattern}/`)) included.add(file);
  }
}

function collectPackageRelativePaths(packageRoot) {
  const packagePath = path.join(packageRoot, 'package.json');
  if (!fs.existsSync(packagePath)) throw new Error(`package.json not found under package root`);
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!Array.isArray(packageJson.files)) throw new Error('package.json must declare a files array');

  const relativeFiles = walkFiles(packageRoot).map((filePath) => relativePath(packageRoot, filePath));
  const included = new Set(['package.json']);
  for (const entry of packageJson.files) {
    const pattern = normalizePackagePattern(entry);
    if (pattern) addPackagePatternFiles(pattern, relativeFiles, included);
  }

  return [...included];
}

function loadDenylist() {
  const denylistPath = process.env.PRIVACY_DENYLIST;
  if (!denylistPath || !fs.existsSync(denylistPath)) return [];
  return fs.readFileSync(denylistPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line, index) => {
      try {
        return new RegExp(line, 'i');
      } catch {
        throw new Error(`Invalid privacy deny-list regular expression on line ${index + 1}`);
      }
    });
}

function scanPrivacyLine(root, filePath, line, lineNumber, patterns, denylist, report) {
  const displayPath = relativePath(root, filePath);
  for (const pattern of patterns) {
    if (pattern.regex.test(line)) report[pattern.fail ? 'fail' : 'review'](displayPath, pattern.category, lineNumber);
  }
  if (denylist.some((regex) => regex.test(line))) report.fail(displayPath, 'privacy deny-list match', lineNumber);
}

function scanPrivacy(root, files, report) {
  const denylist = loadDenylist();
  const patterns = [
    { regex: /\b[a-z0-9.-]+\.(?:corp|internal|intranet|local)\b/i, category: 'private-looking host', fail: true },
    { regex: /\b(?:confluence|wiki)\b[^\n]{0,100}\b(?:PAT|DOC|PAGE)[\/-][A-Z0-9_-]*\d{4,}\b/i, category: 'wiki/document identifier', fail: true },
    { regex: /\b(?:https?:\/\/[^\s)]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})\b/i, category: 'external URL or email', fail: false },
    { regex: /\b[A-Z][A-Z0-9]{1,9}-\d+\b/, category: 'issue-key-shaped identifier', fail: false },
    { regex: /\b\d{7,}\b/, category: 'long numeric identifier', fail: false },
    { regex: /(?:\$\s?\d|\b\d[\d,.]*\s?(?:USD|credits?)\b|\b(?:price|pricing|cost|credits?)\b)/i, category: 'pricing or cost terminology', fail: false },
    { regex: /\b(?:internal|confidential|proprietary|customer|business process)\b/i, category: 'sensitive-context terminology', fail: false },
  ];
  let scanned = 0;
  for (const filePath of files) {
    const content = readTextFile(filePath);
    if (content === null) continue;
    scanned += 1;
    content.split(/\r?\n/).forEach((line, index) => scanPrivacyLine(root, filePath, line, index + 1, patterns, denylist, report));
  }
  report.pass('privacy scan', `${scanned} text files scanned`);
}

function createReporter() {
  const counts = { pass: 0, review: 0, fail: 0 };
  return {
    counts,
    pass: (file, message) => {
      counts.pass += 1;
      console.log(`PASS ${file}: ${message}`);
    },
    review: (file, category, line) => {
      counts.review += 1;
      console.log(`REVIEW ${file}:${line || 1} ${category}`);
    },
    fail: (file, category, line) => {
      counts.fail += 1;
      console.error(`FAIL ${file}:${line || 1} ${category}`);
    },
  };
}

function printHelp() {
  console.log('Usage: node scripts/check-skills.js [--root <dir>] [--shipped] [--package-root <dir>]');
}

function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    printHelp();
    process.exitCode = 2;
    return;
  }
  if (options.help) {
    printHelp();
    return;
  }
  if (!fs.existsSync(options.root)) {
    console.error('Checked root does not exist');
    process.exitCode = 2;
    return;
  }

  const report = createReporter();
  const files = walkFiles(options.root);
  validatePhaseSkills(options.root, report);

  let linkFiles = files;
  let privacyFiles = files;
  if (options.shipped) {
    try {
      const packagePaths = collectPackageRelativePaths(options.packageRoot);
      linkFiles = packagePaths
        .map((relative) => path.join(options.root, ...relative.split('/')))
        .filter((filePath) => fs.existsSync(filePath) && fs.statSync(filePath).isFile());
      privacyFiles = linkFiles;
    } catch (error) {
      report.fail('package.json', 'unable to resolve package allowlist');
      console.error(`Checker error: ${error.message}`);
    }
  }
  validateMarkdownLinks(options.root, linkFiles, report);
  scanPrivacy(options.root, privacyFiles, report);

  console.log(`Summary: ${report.counts.pass} pass, ${report.counts.review} review, ${report.counts.fail} fail`);
  if (report.counts.fail > 0) process.exitCode = 1;
}

main();