# Contributing

Thanks for your interest in contributing to AIT PROfessor!

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example` and add your key.
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Development Guidelines

- **Security first**: never commit real API keys or secrets.
- **Tests**: add/adjust tests for new behavior.
- **Type safety**: keep TypeScript strict.
- **Accessibility**: include ARIA labels and keyboard support.
- **Small commits**: prefer focused commits with clear messages.

## Branching Strategy

We follow a **trunk‑based** flow with short‑lived feature branches:

- Branch from `main`.
- Keep branches small and focused.
- Open a PR early and keep it updated.
- Require CI to pass before merge.

## Running Tests

```bash
npm run test -- --run
```

## Pull Requests

- Describe the change and testing performed.
- Include screenshots or recordings for UI changes when possible.
- Ensure lint/test checks pass.
- Use the PR template and link to related issues.

## Issues

Please use the provided issue templates for bug reports and feature requests.
