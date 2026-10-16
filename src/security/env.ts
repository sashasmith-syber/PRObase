const toInt = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getEnv = (key: string): string | undefined => {
  return (import.meta.env as Record<string, string | undefined>)[key];
};

const pickEnv = (...keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = getEnv(key);
    if (value !== undefined && value !== "") return value;
  }
  return undefined;
};

export const SECURITY_ENV = {
  SAFE_BUBBLE_ALLOWED_ORIGINS: pickEnv(
    "VITE_SAFE_BUBBLE_ALLOWED_ORIGINS",
    "SAFE_BUBBLE_ALLOWED_ORIGINS",
  ) ?? "",
  MAX_TOKENS: toInt(pickEnv("VITE_MAX_TOKENS", "MAX_TOKENS"), 4096),
  MAX_PAYLOAD_SIZE: toInt(
    pickEnv("VITE_MAX_PAYLOAD_SIZE", "MAX_PAYLOAD_SIZE"),
    250_000,
  ),
  SAFE_BUBBLE_RATE_LIMIT_WINDOW_MS: toInt(
    pickEnv("VITE_SAFE_BUBBLE_RATE_LIMIT_WINDOW_MS", "SAFE_BUBBLE_RATE_LIMIT_WINDOW_MS"),
    60_000,
  ),
  SAFE_BUBBLE_RATE_LIMIT_MAX_REQUESTS: toInt(
    pickEnv("VITE_SAFE_BUBBLE_RATE_LIMIT_MAX_REQUESTS", "SAFE_BUBBLE_RATE_LIMIT_MAX_REQUESTS"),
    30,
  ),
  KEY_MAX_AGE_DAYS: toInt(pickEnv("VITE_KEY_MAX_AGE_DAYS", "KEY_MAX_AGE_DAYS"), 90),
  API_KEY_GEMINI: pickEnv("VITE_GEMINI_API_KEY", "GEMINI_API_KEY") ?? "",
  API_KEY_VERSION_GEMINI: pickEnv("VITE_API_KEY_VERSION_GEMINI", "API_KEY_VERSION_GEMINI") ?? "",
  API_KEY_ROTATION_DATE_GEMINI: pickEnv(
    "VITE_API_KEY_ROTATION_DATE_GEMINI",
    "API_KEY_ROTATION_DATE_GEMINI",
  ) ?? "",
  API_KEY_OPENAI: pickEnv("VITE_OPENAI_API_KEY", "OPENAI_API_KEY") ?? "",
  API_KEY_VERSION_OPENAI: pickEnv("VITE_API_KEY_VERSION_OPENAI", "API_KEY_VERSION_OPENAI") ?? "",
  API_KEY_ROTATION_DATE_OPENAI: pickEnv(
    "VITE_API_KEY_ROTATION_DATE_OPENAI",
    "API_KEY_ROTATION_DATE_OPENAI",
  ) ?? "",
  API_KEY_ANTHROPIC: pickEnv("VITE_ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY") ?? "",
  API_KEY_VERSION_ANTHROPIC: pickEnv(
    "VITE_API_KEY_VERSION_ANTHROPIC",
    "API_KEY_VERSION_ANTHROPIC",
  ) ?? "",
  API_KEY_ROTATION_DATE_ANTHROPIC: pickEnv(
    "VITE_API_KEY_ROTATION_DATE_ANTHROPIC",
    "API_KEY_ROTATION_DATE_ANTHROPIC",
  ) ?? "",
};

