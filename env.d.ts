interface ImportMetaEnv {
  readonly VITE_SAFE_BUBBLE_ALLOWED_ORIGINS?: string;
  readonly SAFE_BUBBLE_ALLOWED_ORIGINS?: string;

  readonly VITE_MAX_TOKENS?: string;
  readonly MAX_TOKENS?: string;
  readonly VITE_MAX_PAYLOAD_SIZE?: string;
  readonly MAX_PAYLOAD_SIZE?: string;
  readonly VITE_SAFE_BUBBLE_RATE_LIMIT_WINDOW_MS?: string;
  readonly SAFE_BUBBLE_RATE_LIMIT_WINDOW_MS?: string;
  readonly VITE_SAFE_BUBBLE_RATE_LIMIT_MAX_REQUESTS?: string;
  readonly SAFE_BUBBLE_RATE_LIMIT_MAX_REQUESTS?: string;

  readonly VITE_KEY_MAX_AGE_DAYS?: string;
  readonly KEY_MAX_AGE_DAYS?: string;

  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_ANTHROPIC_API_KEY?: string;
  readonly GEMINI_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
  readonly ANTHROPIC_API_KEY?: string;

  readonly VITE_API_KEY_VERSION_GEMINI?: string;
  readonly API_KEY_VERSION_GEMINI?: string;
  readonly VITE_API_KEY_VERSION_OPENAI?: string;
  readonly API_KEY_VERSION_OPENAI?: string;
  readonly VITE_API_KEY_VERSION_ANTHROPIC?: string;
  readonly API_KEY_VERSION_ANTHROPIC?: string;

  readonly VITE_API_KEY_ROTATION_DATE_GEMINI?: string;
  readonly API_KEY_ROTATION_DATE_GEMINI?: string;
  readonly VITE_API_KEY_ROTATION_DATE_OPENAI?: string;
  readonly API_KEY_ROTATION_DATE_OPENAI?: string;
  readonly VITE_API_KEY_ROTATION_DATE_ANTHROPIC?: string;
  readonly API_KEY_ROTATION_DATE_ANTHROPIC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
