#!/usr/bin/env node

const MAX_AGE_DAYS = Number.parseInt(process.env.KEY_MAX_AGE_DAYS ?? "90", 10);

const providers = [
  {
    provider: "gemini",
    key: process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY ?? "",
    version: process.env.API_KEY_VERSION_GEMINI ?? process.env.VITE_API_KEY_VERSION_GEMINI ?? "",
    rotationDate:
      process.env.API_KEY_ROTATION_DATE_GEMINI ?? process.env.VITE_API_KEY_ROTATION_DATE_GEMINI ?? "",
  },
  {
    provider: "openai",
    key: process.env.OPENAI_API_KEY ?? process.env.VITE_OPENAI_API_KEY ?? "",
    version: process.env.API_KEY_VERSION_OPENAI ?? process.env.VITE_API_KEY_VERSION_OPENAI ?? "",
    rotationDate:
      process.env.API_KEY_ROTATION_DATE_OPENAI ?? process.env.VITE_API_KEY_ROTATION_DATE_OPENAI ?? "",
  },
  {
    provider: "anthropic",
    key: process.env.ANTHROPIC_API_KEY ?? process.env.VITE_ANTHROPIC_API_KEY ?? "",
    version: process.env.API_KEY_VERSION_ANTHROPIC ?? process.env.VITE_API_KEY_VERSION_ANTHROPIC ?? "",
    rotationDate:
      process.env.API_KEY_ROTATION_DATE_ANTHROPIC ?? process.env.VITE_API_KEY_ROTATION_DATE_ANTHROPIC ?? "",
  },
];

const PLACEHOLDERS = new Set(["", "REPLACE_WITH_REAL_KEY", "VITE_API_KEY_PLACEHOLDER"]);

const ageDays = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
};

const overdue = [];
for (const item of providers) {
  if (PLACEHOLDERS.has(item.key.trim())) continue;
  const days = ageDays(item.rotationDate);
  if (days > MAX_AGE_DAYS) {
    overdue.push({
      provider: item.provider,
      version: item.version || "unknown",
      rotationDate: item.rotationDate || "missing",
      ageDays: Number.isFinite(days) ? days : "invalid",
    });
  }
}

if (overdue.length > 0) {
  console.error("Key rotation check failed. Overdue providers:");
  for (const item of overdue) {
    console.error(
      `- ${item.provider}: version=${item.version}, rotationDate=${item.rotationDate}, ageDays=${item.ageDays}`,
    );
  }
  process.exit(1);
}

console.log("Key rotation check passed.");
