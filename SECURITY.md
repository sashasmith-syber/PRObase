# Security Policy

## Reporting a Vulnerability

If you discover a security issue, please report it responsibly.

- Do **not** open a public issue.
- Email the maintainers with a clear description and steps to reproduce.

## Best Practices

- Never commit API keys or secrets.
- Use `.env.local` and environment‑specific files for credentials.
- Validate all user input and attachments.
- Keep dependencies up to date.

## Recommended Security Headers

If you deploy behind a server/CDN, consider adding:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
