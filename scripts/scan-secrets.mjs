#!/usr/bin/env node

import { execSync } from "node:child_process";

const patterns = [
  {
    name: "Generic secret assignment",
    regex: /\b(API[_-]?KEY|SECRET|TOKEN|PASSWORD)\b\s*[:=]\s*["'][^"']{8,}["']/i,
  },
  {
    name: "Google API key pattern",
    regex: /\bAIza[0-9A-Za-z\-_]{20,}\b/,
  },
  {
    name: "OpenAI key pattern",
    regex: /\bsk-[A-Za-z0-9]{20,}\b/,
  },
  {
    name: "Anthropic key pattern",
    regex: /\bsk-ant-[A-Za-z0-9\-_]{20,}\b/,
  },
];

const run = (command) => execSync(command, { stdio: ["ignore", "pipe", "pipe"] }).toString();

let candidateFiles = [];
const stagedMode = process.argv.includes("--staged");

try {
  if (stagedMode) {
    candidateFiles = run("git diff --cached --name-only --diff-filter=ACM")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } else {
    candidateFiles = run("git ls-files")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
} catch (error) {
  console.error("Failed to list files for secret scanning.", error);
  process.exit(2);
}

if (candidateFiles.length === 0) {
  console.log(stagedMode ? "No staged files to scan." : "No tracked files to scan.");
  process.exit(0);
}

const offenders = [];

for (const file of candidateFiles) {
  let content = "";
  try {
    content = stagedMode ? run(`git show :${file}`) : run(`git show HEAD:${file}`);
  } catch {
    continue;
  }

  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      offenders.push({ file, pattern: pattern.name });
      break;
    }
  }
}

if (offenders.length > 0) {
  console.error("Secret scan failed. Potential secrets detected:");
  for (const offender of offenders) {
    console.error(`- ${offender.file}: ${offender.pattern}`);
  }
  console.error(
    "Remove secrets from source and keep real values in local env files or your secrets manager.",
  );
  process.exit(1);
}

console.log(
  `Secret scan passed (${candidateFiles.length} ${stagedMode ? "staged" : "tracked"} file(s) checked).`,
);
