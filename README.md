<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AIT PROfessor AI

Client-side Vite + React + TypeScript app with a backend-for-frontend (BFF) API boundary for provider requests.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `GEMINI_API_KEY` in `.env.local`
4. Start app + BFF: `npm run dev`

The web app runs on `http://localhost:3000` and proxies `/api/*` to the BFF on `http://localhost:8787`.

## Cloudflare deployment

This repository deploys as a Worker + static assets:

- Worker entry: `server/worker.mjs`
- Static assets: `dist/` (configured in `wrangler.toml`)
- Frontend calls: `POST /api/gemini/chat`

Required runtime secret:

```bash
wrangler secret put GEMINI_API_KEY
```

Deploy command:

```bash
npm run deploy
```

## Environment & Secrets Policy

### Layered env strategy

- `.env.example` is committed and contains placeholders/comments only.
- `.env` is optional and should contain non-sensitive defaults only.
- `.env.local`, `.env.development`, `.env.staging`, `.env.production`, `env.d`, and `env.d.ts` are gitignored by policy.

### DO

- DO store real keys only in local env files or a secrets manager.
- DO use `.env.example` as the template.
- DO rotate keys and update metadata (`*_VERSION_*`, `*_ROTATION_DATE_*`).

### DON'T

- DON'T commit real keys to git.
- DON'T hardcode keys in source.
- DON'T expose provider keys in browser bundles.

## Security modules

- `src/security/safeBubble.ts`
  - Origin allowlist enforcement
  - Token/payload ceilings
  - Sliding-window rate limiting
  - Basic prompt/payload sanitization
  - Structured result contract (`ALLOW` | `DENY` | `WARN`)
- `src/security/keyRotation.ts`
  - Provider key lookup (`getCurrentApiKey`)
  - Rotation due checks (`isKeyRotationDue`)
  - Metadata inspection (`getKeyMetadata`)
- `src/security/auditLog.ts`
  - Circular in-memory buffer (500 events)
  - Tamper-evident SHA-256 event chain

### Rotation workflow

When rotating a provider key, update:

- key: `GEMINI_API_KEY` (or `VITE_GEMINI_API_KEY` if browser mode is explicitly used)
- version: `API_KEY_VERSION_GEMINI` or `VITE_API_KEY_VERSION_GEMINI`
- rotation date: `API_KEY_ROTATION_DATE_GEMINI` or `VITE_API_KEY_ROTATION_DATE_GEMINI` (ISO format)

Run:

```bash
npm run security:check-rotation
```

It exits non-zero if active key age exceeds `KEY_MAX_AGE_DAYS` (default 90 days).

## Performance notes

- Route/component-level lazy loading:
  - `App.tsx` lazy-loads `PromptInput` and `HistoryPanel`
  - `Header.tsx` lazy-loads `WallpaperSelector`
  - `PromptInput.tsx` lazy-loads `ModeSelector`
  - API service (`geminiService`) is imported dynamically on send
- Rollup manual chunking in `vite.config.ts`:
  - `react-vendor` for React/ReactDOM
  - `genai-sdk` for `@google/genai`
- Chunk budget enforcement:
  - `npm run build:analyze`
  - Fails when main chunk exceeds `MAX_MAIN_CHUNK_BYTES` (default 450000)

Trade-off: smaller initial payload with deferred fetches for non-critical UI/service modules.

## Tooling scripts

- `npm run typecheck` — TypeScript checks
- `npm run test` — Security module tests (Vitest)
- `npm run security:scan-secrets` — staged-file secret pattern scan
- `npm run security:check-rotation` — key rotation gate
- `npm run build:analyze` — build + chunk-budget verification
- `npm run ci:validate` — typecheck + tests + rotation + build + chunk budget

## Troubleshooting cloud reconnect issues

- `// SYSTEM_ERROR: GEMINI_API_KEY is not configured on the server.`
  - Add `GEMINI_API_KEY` as a Worker secret and redeploy.
- `Request failed with status 404` on `/api/gemini/chat`
  - Ensure Worker deploy uses `wrangler.toml` with `main = "server/worker.mjs"`.
- Browser sees network errors to `/api/gemini/chat`
  - Confirm Worker is reachable and API route is not blocked by firewall/domain routing.
