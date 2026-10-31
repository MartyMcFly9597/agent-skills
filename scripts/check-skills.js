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

function splitLines(content) {
  return content.split('\n').map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line));
}

function isSkillName(name) {
  if (!name || name.length > 64 || name.startsWith('-') || name.endsWith('-')) return false;
  let previousWasHyphen = false;
  for (const character of name) {
    const isLetter = character >= 'a' && character <= 'z';
    const isDigit = character >= '0' && character <= '9';
    if (character === '-') {
      if (previousWasHyphen) return false;
      previousWasHyphen = true;
      continue;
    }
    if (!isLetter && !isDigit) return false;
    previousWasHyphen = false;
  }
  return true;
}

function parseFrontmatter(content) {
  const lines = splitLines(content);
  if (lines[0] !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end < 0) return null;
  const fields = new Map();
  for (const line of lines.slice(1, end)) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim();
    if (!isMetadataKey(name)) continue;
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

function isMetadataKey(name) {
  for (const character of name) {
    const isUpper = character >= 'A' && character <= 'Z';
    const isLower = character >= 'a' && character <= 'z';
    const isDigit = character >= '0' && character <= '9';
    if (!isUpper && !isLower && !isDigit && character !== '_' && character !== '-') return false;
  }
  return name.length > 0;
}

function validateSkillMetadata(skillName, fields, displayPath, seenNames, report) {
  const name = fields.get('name');
  const description = fields.get('description');
  const checks = [
    [name === skillName && isSkillName(name), 'name must be a unique lowercase slug matching its folder'],
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
  return firstWhitespacePart(target);
}

function firstWhitespacePart(value) {
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === ' ' || value[index] === '\t' || value[index] === '\r' || value[index] === '\n') {
      return value.slice(0, index);
    }
  }
  return value;
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
  for (const line of splitLines(content)) {
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
      : firstWhitespacePart(rawTarget);
    if (target) links.push({ target, offset });
    offset += line.length + 1;
  }
}

function decodeLinkTarget(target, sourcePath, report) {
  const query = target.indexOf('?');
  const fragment = target.indexOf('#');
  let end = target.length;
  if (query >= 0) end = Math.min(end, query);
  if (fragment >= 0) end = Math.min(end, fragment);
  try {
    return decodeURIComponent(target.slice(0, end));
  } catch {
    report.fail(sourcePath, 'invalid percent-encoding in relative Markdown link');
    return null;
  }
}

function validateMarkdownLink(root, filePath, sourcePath, target, report) {
  const lowered = target.toLowerCase();
  if (!target || target.startsWith('#') || lowered.startsWith('http:') || lowered.startsWith('https:') || lowered.startsWith('mailto:') || lowered.startsWith('data:')) return false;
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

function matchPathSegment(pattern, value) {
  let patternIndex = 0;
  let valueIndex = 0;
  let starIndex = -1;
  let retryIndex = 0;
  while (valueIndex < value.length) {
    if (pattern[patternIndex] === value[valueIndex]) {
      patternIndex += 1;
      valueIndex += 1;
    } else if (pattern[patternIndex] === '*') {
      starIndex = patternIndex;
      retryIndex = valueIndex;
      patternIndex += 1;
    } else if (starIndex >= 0) {
      patternIndex = starIndex + 1;
      retryIndex += 1;
      valueIndex = retryIndex;
    } else {
      return false;
    }
  }
  while (pattern[patternIndex] === '*') patternIndex += 1;
  return patternIndex === pattern.length;
}

function includeGlobstarSkips(patternSegments, positions) {
  for (let index = 0; index < patternSegments.length; index += 1) {
    if (patternSegments[index] === '**' && positions.has(index)) positions.add(index + 1);
  }
}

function matchesPathPattern(pattern, filePath) {
  const patternSegments = pattern.split('/');
  const fileSegments = filePath.split('/');
  let positions = new Set([0]);
  includeGlobstarSkips(patternSegments, positions);
  for (const fileSegment of fileSegments) {
    const nextPositions = new Set();
    for (const index of positions) {
      if (index >= patternSegments.length) continue;
      if (patternSegments[index] === '**') nextPositions.add(index);
      else if (matchPathSegment(patternSegments[index], fileSegment)) nextPositions.add(index + 1);
    }
    positions = nextPositions;
    includeGlobstarSkips(patternSegments, positions);
  }
  return positions.has(patternSegments.length);
}

function normalizePackagePattern(entry) {
  if (typeof entry !== 'string') return null;
  let normalized = entry.replaceAll('\\', '/');
  if (normalized.startsWith('./')) normalized = normalized.slice(2);
  if (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
  if (!normalized || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) return null;
  return normalized;
}

function addPackagePatternFiles(pattern, files, included) {
  if (pattern.includes('*')) {
    for (const file of files) if (matchesPathPattern(pattern, file)) included.add(file);
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
  return splitLines(fs.readFileSync(denylistPath, 'utf8'))
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

function isWordCharacter(character) {
  if (!character) return false;
  const code = character.toLowerCase().codePointAt(0);
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57) || character === '_';
}

function containsWord(line, word) {
  const lowered = line.toLowerCase();
  let index = lowered.indexOf(word);
  while (index >= 0) {
    const before = index === 0 ? '' : lowered[index - 1];
    const afterIndex = index + word.length;
    const after = afterIndex >= lowered.length ? '' : lowered[afterIndex];
    if (!isWordCharacter(before) && !isWordCharacter(after)) return true;
    index = lowered.indexOf(word, index + 1);
  }
  return false;
}

function hasPrivateLookingHost(line) {
  const suffixes = ['.corp', '.internal', '.intranet', '.local'];
  const candidates = collectTokens(line, isHostCharacter);
  return candidates.some((candidate) => {
    let hostname = candidate.toLowerCase();
    while (hostname.endsWith('.') || hostname.endsWith('-')) hostname = hostname.slice(0, -1);
    return suffixes.some((suffix) => hostname.endsWith(suffix) && hostname.length > suffix.length);
  });
}

function isDocumentIdentifier(candidate) {
  const prefix = ['PAT', 'DOC', 'PAGE'].find((value) => candidate.startsWith(value));
  if (!prefix) return false;
  const separator = candidate[prefix.length];
  if (separator !== '/' && separator !== '-') return false;
  let trailingDigits = 0;
  for (const character of candidate.slice(prefix.length + 1)) {
    const code = character.codePointAt(0);
    if (code >= 48 && code <= 57) trailingDigits += 1;
    else if ((code >= 65 && code <= 90) || character === '_' || character === '-' || character === '/') trailingDigits = 0;
    else return false;
  }
  return trailingDigits >= 4;
}

function hasWikiDocumentIdentifier(line) {
  if (!containsWord(line, 'wiki') && !containsWord(line, 'confluence')) return false;
  return collectTokens(line, isDocumentIdCharacter).some((part) => isDocumentIdentifier(part.toUpperCase()));
}

function collectTokens(value, isTokenCharacter) {
  const tokens = [];
  let tokenStart = -1;
  for (let index = 0; index <= value.length; index += 1) {
    const isToken = index < value.length && isTokenCharacter(value[index]);
    if (isToken && tokenStart < 0) tokenStart = index;
    if (!isToken && tokenStart >= 0) {
      tokens.push(value.slice(tokenStart, index));
      tokenStart = -1;
    }
  }
  return tokens;
}

function isAsciiLetterOrDigit(character) {
  const code = character.toLowerCase().codePointAt(0);
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
}

function isHostCharacter(character) {
  return isAsciiLetterOrDigit(character) || character === '.' || character === '-';
}

function isDocumentIdCharacter(character) {
  return isAsciiLetterOrDigit(character) || character === '_' || character === '/' || character === '-';
}

function hasExternalUrlOrEmail(line) {
  const lowered = line.toLowerCase();
  if (lowered.includes('http://') || lowered.includes('https://')) return true;
  const at = line.indexOf('@');
  if (at <= 0) return false;
  const dot = line.indexOf('.', at + 1);
  return dot > at + 1 && dot < line.length - 1;
}

function isAsciiDigit(code) {
  return code >= 48 && code <= 57;
}

function isProjectKeyCharacter(code) {
  return (code >= 65 && code <= 90) || isAsciiDigit(code);
}

function issueKeyEnd(line, start) {
  let cursor = start;
  while (cursor < line.length && cursor - start < 10 && isProjectKeyCharacter(line.codePointAt(cursor))) cursor += 1;
  if (cursor - start < 2 || line[cursor] !== '-') return -1;
  cursor += 1;
  const numberStart = cursor;
  while (cursor < line.length && isAsciiDigit(line.codePointAt(cursor))) cursor += 1;
  return cursor > numberStart ? cursor : -1;
}

function isIssueKeyBoundary(line, start, end) {
  const previous = start === 0 ? '' : line[start - 1];
  const next = end === line.length ? '' : line[end];
  return !isWordCharacter(previous) && !isWordCharacter(next);
}

function hasIssueKey(line) {
  for (let index = 0; index < line.length; index += 1) {
    const code = line.codePointAt(index);
    if (code < 65 || code > 90) continue;
    const end = issueKeyEnd(line, index);
    if (end > 0 && isIssueKeyBoundary(line, index, end)) return true;
  }
  return false;
}

function hasLongNumber(line) {
  let digitCount = 0;
  for (const character of line) {
    const code = character.codePointAt(0);
    digitCount = code >= 48 && code <= 57 ? digitCount + 1 : 0;
    if (digitCount >= 7) return true;
  }
  return false;
}

function hasDollarAmount(line) {
  for (let index = 0; index < line.length; index += 1) {
    if (line[index] !== '$') continue;
    if (isAsciiDigit(line.codePointAt(skipHorizontalWhitespace(line, index + 1)))) return true;
  }
  return false;
}

function numberEnd(line, start) {
  let cursor = start;
  while (cursor < line.length) {
    const character = line[cursor];
    if (isAsciiDigit(line.codePointAt(cursor)) || character === ',' || character === '.') cursor += 1;
    else return cursor;
  }
  return cursor;
}

function skipHorizontalWhitespace(line, start) {
  let cursor = start;
  while (line[cursor] === ' ' || line[cursor] === '\t') cursor += 1;
  return cursor;
}

function hasCurrencySuffix(line, start) {
  const tail = line.slice(start).toLowerCase();
  return (tail.startsWith('usd') && !isWordCharacter(tail[3])) ||
    (tail.startsWith('credit') && !isWordCharacter(tail[6]));
}

function hasCurrencyAmount(line) {
  for (let index = 0; index < line.length; index += 1) {
    if (!isAsciiDigit(line.codePointAt(index))) continue;
    const suffixStart = skipHorizontalWhitespace(line, numberEnd(line, index));
    if (hasCurrencySuffix(line, suffixStart)) return true;
  }
  return false;
}

function hasPricingOrCostTerm(line) {
  const terms = ['price', 'pricing', 'cost', 'credit', 'credits'];
  return hasDollarAmount(line) || hasCurrencyAmount(line) || terms.some((term) => containsWord(line, term));
}

function matchesPrivacyPattern(line, pattern) {
  switch (pattern) {
    case 'private-looking host': return hasPrivateLookingHost(line);
    case 'wiki/document identifier': return hasWikiDocumentIdentifier(line);
    case 'external URL or email': return hasExternalUrlOrEmail(line);
    case 'issue-key-shaped identifier': return hasIssueKey(line);
    case 'long numeric identifier': return hasLongNumber(line);
    case 'pricing or cost terminology': return hasPricingOrCostTerm(line);
    case 'sensitive-context terminology':
      return ['internal', 'confidential', 'proprietary', 'customer', 'business process'].some((term) => containsWord(line, term));
    default: return false;
  }
}

const PRIVACY_PATTERNS = [
  { category: 'private-looking host', fail: true },
  { category: 'wiki/document identifier', fail: true },
  { category: 'external URL or email', fail: false },
  { category: 'issue-key-shaped identifier', fail: false },
  { category: 'long numeric identifier', fail: false },
  { category: 'pricing or cost terminology', fail: false },
  { category: 'sensitive-context terminology', fail: false },
];

function scanPrivacyLine(root, filePath, line, lineNumber, denylist, report) {
  const displayPath = relativePath(root, filePath);
  for (const pattern of PRIVACY_PATTERNS) {
    if (matchesPrivacyPattern(line, pattern.category)) {
      report[pattern.fail ? 'fail' : 'review'](displayPath, pattern.category, lineNumber);
    }
  }
  if (denylist.some((regex) => regex.test(line))) report.fail(displayPath, 'privacy deny-list match', lineNumber);
}

function scanPrivacy(root, files, report) {
  const denylist = loadDenylist();
  let scanned = 0;
  for (const filePath of files) {
    const content = readTextFile(filePath);
    if (content === null) continue;
    scanned += 1;
    splitLines(content).forEach((line, index) => scanPrivacyLine(root, filePath, line, index + 1, denylist, report));
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