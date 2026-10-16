# Security Policy

**Author/Maintainer:** Sasha Smith ([@sashasmith-syber](https://github.com/sashasmith-syber))

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.1.x   | ✅ Yes    |
| < 1.1   | ❌ No     |

---

## API Key Safety

> ⚠️ **CRITICAL: Never commit your `GEMINI_API_KEY` to version control.**

Your Gemini API key must only ever be stored in `.env.local`. This file is listed in `.gitignore` (via the `*.local` glob pattern) and must never be committed to any repository, public or private.

### Rules

- Store your API key **only** in `.env.local`
- Use `.env.local.example` as a template — it contains no real credentials
- Confirm `.env.local` is covered by your `.gitignore` before every commit

### If You Accidentally Commit an API Key

1. **Immediately revoke the exposed key** at [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Generate a new API key
3. Update your `.env.local` with the new key
4. Remove the key from git history using `git filter-repo` or BFG Repo Cleaner
5. Force-push the cleaned history and notify any collaborators

Treat any accidentally committed key as permanently compromised, regardless of how quickly it was removed.

---

## Reporting a Vulnerability

If you discover a security vulnerability in AIT PROfessor:

1. **Open a GitHub Issue** with the prefix `[SECURITY]` in the title
2. Or **contact the maintainer directly** via GitHub: [@sashasmith-syber](https://github.com/sashasmith-syber)

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations (optional)

Do not publicly disclose security issues before the maintainer has had a chance to address them.

---

## Security Considerations

- This application runs entirely client-side. The `GEMINI_API_KEY` is passed directly from the browser to the Google Gemini API. **Do not deploy this app publicly without implementing a backend proxy** to keep your API key secret.
- See `DEVELOPMENT_ROADMAP_AND_ANALYTICS_REPORT.md` for the planned backend proxy implementation.
- Conversation history is stored in `localStorage`. Clear it if using a shared or public device.

---

*Maintained by Sasha Smith ([@sashasmith-syber](https://github.com/sashasmith-syber))*
*© 2025–2026 Sasha Smith. All rights reserved.*
