# Grey Swan Integration Guide

## Security Note

**Provider API keys must never be exposed in frontend code or client-visible assets.**

- `GEMINI_API_KEY`, `GREY_SWAN_API_KEY`, and similar secrets belong only on server-side runtime.
- Any example that injects keys with Vite `define` or sends provider `Authorization` headers directly from the browser is **deprecated**.
- Use backend-only API routes (BFF pattern) for all provider communication.

## Backend-only API usage

- Route all provider traffic through server endpoints such as `POST /api/grey-swan/chat`.
- Store provider keys in server environment variables or a secret manager.
- Apply request validation, rate limits, and RBAC checks in backend handlers.
- Log security-sensitive route usage with audit metadata.
- Return only safe provider output and non-sensitive metadata to clients.

## Legacy/unsafe pattern — do NOT use

```ts
// ❌ Legacy/unsafe: exposes provider keys in browser bundles
define: {
  'process.env.GREY_SWAN_API_KEY': JSON.stringify(env.GREY_SWAN_API_KEY),
}

await fetch(`${GREY_SWAN_API_URL}/chat/completions`, {
  headers: {
    Authorization: `Bearer ${process.env.GREY_SWAN_API_KEY}`,
  },
});
```

## Safe pattern (backend-only)

### Server handler example

```ts
// server/index.mjs (simplified)
const providerResponse = await fetch(`${process.env.GREY_SWAN_API_URL}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GREY_SWAN_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'grey-swan-red-team-v1',
    messages,
    stream: false,
  }),
});
```

### Frontend call example (no keys client-side)

```ts
const response = await fetch('/api/grey-swan/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: userInput,
    context: 'defensive, authorized-lab context',
  }),
});
```

## Safe Pentesting Lab guidance

Pentesting-related prompts are for defensive education and authorized lab environments only.

- Use only on systems you own or are explicitly authorized to test.
- Enforce server-side policy filters for high-risk requests.
- Add deny-lists for misuse-oriented prompt patterns.
- Apply per-user and per-IP rate limits on backend endpoints.
- Capture audit logs for pentest-lab route access and moderation outcomes.

### Prompt framing recommendations

- Prefer: "Review this authentication flow and suggest defensive controls."
- Prefer: "Create a legal, contained lab exercise for detection and mitigation practice."
- Avoid direct offensive step-by-step exploitation requests in unrestricted environments.
