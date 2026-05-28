#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function printHelp() {
  console.log(`skills - install and manage workspace skills

Usage:
  skills list [--source <path>]
  skills install [target] [--with-prompts] [--force] [--dry-run] [--source <path>]
  skills doctor [--source <path>]

Examples:
  skills list
  skills install .
  skills install ../my-workspace --with-prompts
  skills install . --with-prompts --force
  skills doctor
`);
}

function getArgValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function hasFlag(args, flag) {
  return args.includes(flag);
}

function normalize(p) {
  return path.resolve(p);
}

function defaultSourceRoot() {
  return normalize(path.join(__dirname, ".."));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(src, dest, force) {
  if (fs.existsSync(dest) && !force) {
    return { copied: false, skipped: true, reason: "exists" };
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return { copied: true, skipped: false };
}

function copyDirRecursive(srcDir, destDir, options) {
  let copied = 0;
  let skipped = 0;

  if (!fs.existsSync(srcDir)) {
    return { copied, skipped, missing: true };
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      const nested = copyDirRecursive(srcPath, destPath, options);
      copied += nested.copied;
      skipped += nested.skipped;
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (options.dryRun) {
      if (fs.existsSync(destPath) && !options.force) {
        skipped += 1;
      } else {
        copied += 1;
      }
      continue;
    }

    const result = copyFile(srcPath, destPath, options.force);
    if (result.copied) copied += 1;
    if (result.skipped) skipped += 1;
  }

  return { copied, skipped, missing: false };
}

function listSkills(sourceRoot) {
  const skillsDir = path.join(sourceRoot, ".github", "skills");
  if (!fs.existsSync(skillsDir)) {
    console.error(`No skills directory found at ${skillsDir}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const skillNames = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

  if (skillNames.length === 0) {
    console.log("No skills found.");
    return;
  }

  console.log(`Found ${skillNames.length} skill(s):`);
  for (const name of skillNames) {
    console.log(`- ${name}`);
  }
}

function runInstall(args) {
  const targetArg = args.find((a) => !a.startsWith("--"));
  const targetRoot = normalize(targetArg || process.cwd());
  const sourceRoot = normalize(getArgValue(args, "--source") || defaultSourceRoot());
  const includePrompts = hasFlag(args, "--with-prompts");
  const force = hasFlag(args, "--force");
  const dryRun = hasFlag(args, "--dry-run");

  const srcSkills = path.join(sourceRoot, ".github", "skills");
  const srcPrompts = path.join(sourceRoot, ".github", "prompts");

  const destSkills = path.join(targetRoot, ".github", "skills");
  const destPrompts = path.join(targetRoot, ".github", "prompts");

  if (!fs.existsSync(srcSkills)) {
    console.error(`Source skills directory not found: ${srcSkills}`);
    process.exit(1);
  }

  console.log(`Source: ${sourceRoot}`);
  console.log(`Target: ${targetRoot}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "copy"}`);

  const skillResult = copyDirRecursive(srcSkills, destSkills, { force, dryRun });
  if (skillResult.missing) {
    console.error("No source skills directory found.");
    process.exit(1);
  }

  let promptResult = { copied: 0, skipped: 0, missing: false };
  if (includePrompts) {
    promptResult = copyDirRecursive(srcPrompts, destPrompts, { force, dryRun });
  }

  console.log("");
  console.log("Install summary:");
  console.log(`- skills copied: ${skillResult.copied}`);
  console.log(`- skills skipped: ${skillResult.skipped}`);

  if (includePrompts) {
    console.log(`- prompts copied: ${promptResult.copied}`);
    console.log(`- prompts skipped: ${promptResult.skipped}`);
    if (promptResult.missing) {
      console.log("- prompts source missing: yes");
    }
  } else {
    console.log("- prompts: not included (use --with-prompts)");
  }

  if (dryRun) {
    console.log("\nDry run complete. No files were written.");
  } else {
    console.log("\nInstall complete.");
  }
}

function runDoctor(args) {
  const sourceRoot = normalize(getArgValue(args, "--source") || defaultSourceRoot());
  const skillsDir = path.join(sourceRoot, ".github", "skills");
  const promptsDir = path.join(sourceRoot, ".github", "prompts");

  console.log("skills doctor");
  console.log(`- source root: ${sourceRoot}`);
  console.log(`- skills dir: ${skillsDir} (${fs.existsSync(skillsDir) ? "ok" : "missing"})`);
  console.log(`- prompts dir: ${promptsDir} (${fs.existsSync(promptsDir) ? "ok" : "missing"})`);
  console.log(`- node: ${process.version}`);
}

(function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const rest = args.slice(1);

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "list") {
    const sourceRoot = normalize(getArgValue(rest, "--source") || defaultSourceRoot());
    listSkills(sourceRoot);
    return;
  }

  if (command === "install") {
    runInstall(rest);
    return;
  }

  if (command === "doctor") {
    runDoctor(rest);
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.log("");
  printHelp();
  process.exit(1);
})();
