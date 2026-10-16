# Security Environment Doctrine — AIT PROfessor

> **Standard alignment:** SOC 2 Type II (CC6.1, CC6.6, CC6.7) · ISO 27001:2022 (A.8.9, A.8.24, A.8.33) · NIST 800-53 rev 5 (SC-8, SC-12, SC-13, SC-28, SI-10)

---

## 1. Environment File Classification

| File | Committed | Contains secrets | Purpose |
|---|---|---|---|
| `.env` | YES | MUST NOT | Non-sensitive defaults (feature flags, public URLs, log levels) |
| `.env.example` | YES | MUST NOT | Template with placeholder keys — onboarding reference |
| `.env.local` | NO (gitignored via `*.local`) | YES | Developer-local secrets (e.g. `GEMINI_API_KEY`) |
| `.env.production` | NO | MUST NOT exist in repo | Prod secrets injected at deploy time only |
| `.env.*.local` | NO (gitignored via `*.local`) | YES | Per-environment local overrides |

### Rules

- **MUST** — `.gitignore` includes `*.local`, `.env.production`, `.env.staging`, and catch-all patterns for common secret file names (see §5).
- **MUST NOT** — Secrets appear in any committed file, Docker image layer, CI log, or client-side bundle.
- **MUST NOT** — `.env.local` or any file matching `*.local` ever be committed. Pre-commit hooks SHOULD enforce this.

---

## 2. Secret Injection Model

### 2.1 Development (Vite dev server)

```
.env.local  →  Vite loadEnv()  →  vite.config.ts `define`  →  process.env.API_KEY
```

**Current state (KNOWN RISK):** Vite `define` statically inlines the key into the JS bundle. The key is extractable from browser DevTools or the `dist/` output.

**Target state (Safe Bubble):** The client MUST NOT hold the raw API key. A thin server-side proxy (`safe-bubble/`) intercepts all AI requests, attaches the key server-side, and enforces controls before forwarding to Gemini. See §3.

### 2.2 Production / Staging

- Secrets MUST be injected via the hosting platform's secret manager (e.g. Cloudflare Workers Secrets, Vercel Environment Variables, GCP Secret Manager).
- Secrets MUST NOT be baked into Docker images, static bundles, or CI artifacts.
- The build step MUST NOT receive the raw Gemini API key; only the Safe Bubble backend holds it.

### 2.3 CI / Cloud Agents (Cursor Cloud)

- Secrets are provided through the Cursor Cloud Secrets panel and injected as environment variables at runtime.
- Secrets MUST be scoped (repo-scoped or team-scoped) and MUST NOT appear in CI logs.

---

## 3. Safe Bubble Isolation Layer

### 3.1 Architecture

```
Browser  ──HTTPS──▶  safe-bubble/proxy  ──server-side──▶  Gemini API
                        │
                        ├── origin allowlist
                        ├── rate limiter
                        ├── input sanitizer
                        ├── audit logger
                        └── key rotation manager
```

### 3.2 Directory & File Layout

```
safe-bubble/
├── index.ts              # Proxy entry point (Express / Hono / Cloudflare Worker)
├── middleware/
│   ├── originAllowlist.ts    # Rejects requests from non-allowlisted origins
│   ├── rateLimiter.ts        # Per-IP / per-session sliding-window limiter
│   └── inputSanitizer.ts     # Strips prompt injection markers, enforces max length
├── rotation/
│   ├── keyRotation.ts        # Reads active key, checks expiry, triggers rotation
│   └── keyStore.ts           # Adapter for secret backend (env var / Vault / GCP SM)
├── audit/
│   ├── auditLog.ts           # Append-only structured log emitter
│   └── integrityCheck.ts     # SHA-256 hash chain for log tamper detection
└── config.ts                 # Safe Bubble configuration constants
```

### 3.3 Controls

| Control | Requirement | Standard ref |
|---|---|---|
| **Origin allowlist** | MUST reject requests where `Origin` / `Referer` is not in the allowlist. Default: `localhost:3000` (dev), production domain (prod). | NIST SC-8 |
| **Rate limiter** | MUST enforce per-IP sliding window: ≤ 30 req/min, ≤ 500 req/day. Configurable via env. | SOC 2 CC6.6 |
| **Input sanitizer** | MUST reject payloads > 100 KB. MUST strip or escape known prompt-injection patterns. MUST validate MIME types for attachments against an allowlist. | NIST SI-10 |
| **Key isolation** | The API key MUST exist only in server memory. MUST NOT be logged, returned in responses, or written to disk beyond the secret store. | ISO A.8.9 |
| **TLS only** | All proxy endpoints MUST serve over HTTPS. HTTP MUST redirect or reject. | NIST SC-8 |

---

## 4. Key Rotation & Audit

### 4.1 Rotation Policy

| Parameter | Value | Rationale |
|---|---|---|
| **Maximum key age** | 90 days | SYBER-AIsystent / NIST SC-12 |
| **Rotation trigger** | Automatic on expiry OR manual on suspected compromise | SOC 2 CC6.1 |
| **Overlap window** | 24 hours dual-key acceptance during rotation | Zero-downtime requirement |
| **Rotation procedure** | 1. Generate new key in provider console → 2. Write to secret store → 3. `keyRotation.ts` detects new key → 4. Old key marked deprecated → 5. After overlap window, old key revoked | — |

### 4.2 Audit Logging

| Field | Description |
|---|---|
| `timestamp` | ISO-8601 UTC |
| `requestId` | UUID v4 per request |
| `sourceIp` | Client IP (hashed for PII compliance if required) |
| `origin` | Request `Origin` header |
| `action` | `ai_request` · `key_rotation` · `rate_limit_exceeded` · `origin_rejected` · `input_rejected` |
| `model` | Gemini model used |
| `tokenEstimate` | Approximate prompt + response tokens |
| `status` | `success` · `error` · `blocked` |
| `integrityHash` | SHA-256 of `previousHash + currentEntry` (hash chain) |

### 4.3 Rules

- **MUST** — Every AI request, key rotation event, and security rejection is logged.
- **MUST** — Logs are append-only. No log entry may be modified or deleted.
- **MUST** — Each entry includes a SHA-256 integrity hash chained to the previous entry (tamper evidence).
- **MUST** — Alerts fire on: key age > 80 days, rate-limit breach spike (> 10 blocks/min), origin-allowlist violation, integrity hash mismatch.
- **SHOULD** — Logs are forwarded to a centralized SIEM (e.g. Datadog, Splunk, GCP Cloud Logging).

---

## 5. Gitignore Hardening

The following patterns MUST be present in `.gitignore`:

```gitignore
# Secrets — MUST NOT be committed
*.local
.env.production
.env.staging
.env.*.local
*.pem
*.key
*.p12
*.pfx
*.jks
service-account*.json
*-credentials.json
*.secret

# Safe Bubble audit logs (contain request metadata)
safe-bubble/logs/

# Build output
dist/
dist-ssr/
```

---

## 6. Content Security Policy (CSP)

When deploying with the Safe Bubble proxy, the server SHOULD set the following response headers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.tailwindcss.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  connect-src 'self';
  img-src 'self' data: https:;
  frame-ancestors 'none';
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

Key point: `connect-src 'self'` ensures the browser can only call the Safe Bubble proxy, never the Gemini API directly.

---

## 7. Red Team / Blue Team Checklist

### 7.1 Red Team — Attack Scenarios to Attempt

- [ ] **RT-01** — Extract API key from production JS bundle (DevTools, `dist/` files, source maps).
- [ ] **RT-02** — Extract API key from git history (`git log -p`, `git show`, BFG Repo-Cleaner scan).
- [ ] **RT-03** — Extract API key from Docker image layers (`docker history`, `dive`).
- [ ] **RT-04** — Bypass origin allowlist by spoofing `Origin` / `Referer` headers from curl / Postman.
- [ ] **RT-05** — Exceed rate limits via distributed IPs or session cycling.
- [ ] **RT-06** — Send oversized payload (> 100 KB) to crash or bypass the proxy.
- [ ] **RT-07** — Prompt injection via crafted attachment filenames or content to exfiltrate system prompt / key.
- [ ] **RT-08** — Tamper with audit log entries and verify integrity hash detection.
- [ ] **RT-09** — Use an expired / rotated key and confirm it is rejected.
- [ ] **RT-10** — Access `.env.local` or `safe-bubble/logs/` via path traversal against the dev server.

### 7.2 Blue Team — Invariants That MUST Hold

- [ ] **BT-01** — API key MUST NOT appear in any committed file, bundle, image, or CI log.
- [ ] **BT-02** — API key MUST NOT be accessible from client-side JavaScript in production.
- [ ] **BT-03** — All Gemini API traffic MUST route through the Safe Bubble proxy in production.
- [ ] **BT-04** — Rate limiter MUST block requests beyond configured thresholds and log the event.
- [ ] **BT-05** — Origin allowlist MUST reject requests from unlisted origins and log the event.
- [ ] **BT-06** — Input sanitizer MUST reject payloads exceeding size limits.
- [ ] **BT-07** — Key rotation MUST complete within 24-hour overlap window with zero downtime.
- [ ] **BT-08** — Audit log integrity hash chain MUST detect any insertion, deletion, or modification.
- [ ] **BT-09** — Alerts MUST fire when key age exceeds 80 days.
- [ ] **BT-10** — `*.local` files MUST be blocked from commit by gitignore (and optionally pre-commit hook).
- [ ] **BT-11** — CSP headers MUST prevent direct `connect-src` to `generativelanguage.googleapis.com`.
- [ ] **BT-12** — Source maps MUST NOT be deployed to production.

---

## Appendix: Migration Path from Current State

The current codebase inlines the API key into the client bundle via Vite `define`. This is the expected migration sequence:

1. **Phase 1 (Immediate)** — Harden `.gitignore`, commit `.env.example`, add this doctrine.
2. **Phase 2 (Safe Bubble)** — Implement `safe-bubble/` proxy. Reroute `geminiService.ts` to call the proxy instead of the Gemini API directly. Remove `GEMINI_API_KEY` from the Vite `define` block.
3. **Phase 3 (Rotation + Audit)** — Implement `keyRotation.ts` and `auditLog.ts`. Connect to secret store. Enable alerting.
4. **Phase 4 (Hardening)** — Add CSP headers, pre-commit hooks, CI secret scanning (e.g. `gitleaks`, `trufflehog`), and source-map exclusion from production builds.
