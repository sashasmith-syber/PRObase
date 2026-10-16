# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

AIT PROfessor 1.1 — a client-side React + TypeScript SPA (Vite) that provides an AI chat interface powered by Google Gemini. No backend server or database; all persistence uses browser `localStorage`.

### Services

| Service | Command | Port | Notes |
|---|---|---|---|
| Vite dev server | `npm run dev` | 3000 | Host `0.0.0.0`; hot-reloads on file changes |

### Required secret

The app needs `GEMINI_API_KEY` in `.env.local` at the repo root. Vite injects it at build time via `process.env.API_KEY`. Without a valid key, the UI renders but API calls fail.

### Lint / type-check / build

- **Type-check:** `npx tsc --noEmit` (no ESLint config exists)
- **Build:** `npm run build`
- **Preview built output:** `npm run preview`

### Gotchas

- Tailwind CSS loads from CDN (`cdn.tailwindcss.com`) in `index.html`, not from npm. No local Tailwind config file exists.
- The importmap in `index.html` provides esm.sh fallback URLs, but Vite resolves from `node_modules` in dev/build.
- The `<script type="module" src="/index.tsx">` entry-point tag in `index.html` is required for Vite to find and bundle the React app. The original AI Studio export omitted it.
