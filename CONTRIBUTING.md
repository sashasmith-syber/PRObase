# Contributing to AIT PROfessor

> This project is authored and maintained by Sasha Smith ([@sashasmith-syber](https://github.com/sashasmith-syber)).

Thank you for your interest in contributing! Please read these guidelines before submitting any pull requests or issues.

---

## How to Contribute

### 1. Fork the Repository

```bash
git clone https://github.com/sashasmith-syber/AIT-PROfessor.git
cd AIT-PROfessor
npm install
```

Fork the repo on GitHub and set your fork as the `origin` remote.

### 2. Create a Branch

Use the following branch naming conventions:

| Type | Pattern | Example |
|------|---------|---------|
| New feature | `feature/*` | `feature/add-dark-mode-toggle` |
| Bug fix | `fix/*` | `fix/conversation-reset-bug` |
| Documentation | `docs/*` | `docs/update-architecture` |

### 3. Make Your Changes

- Follow existing code style and conventions
- **TypeScript strict mode is required** — all code must pass `tsc --noEmit` with no errors
- Keep changes focused and minimal — one concern per PR
- Add or update relevant documentation when changing functionality

### 4. Code Quality Requirements

- **No AI-generated code submitted without thorough human review.** You are responsible for every line you submit.
- All TypeScript must compile without errors under `strict` mode
- Avoid introducing new dependencies without prior discussion in an Issue
- Run `npm run build` to verify the build passes before opening a PR

### 5. Submit a Pull Request

- Open your PR against the `main` branch
- Fill in the PR template with a clear description of what changed and why
- Reference any related Issues (e.g., `Closes #12`)
- Keep PRs small and focused — large, unfocused PRs are difficult to review

---

## Issue Templates

When opening an Issue, use one of the following prefixes in the title:

| Prefix | Use case |
|--------|----------|
| `[BUG]` | Something is broken |
| `[FEATURE]` | Request a new feature |
| `[DOCS]` | Documentation improvement |
| `[SECURITY]` | Security vulnerability (see SECURITY.md) |
| `[QUESTION]` | General question |

---

## Code of Conduct

- Be respectful and constructive
- No harassment, discrimination, or personal attacks
- Disagreements about code should be resolved professionally

---

## Attribution

All contributions are made under the [MIT License](LICENSE). By submitting a pull request, you agree that your contributions will be licensed under the same terms.

This project is authored and maintained by **Sasha Smith** ([@sashasmith-syber](https://github.com/sashasmith-syber)).
© 2025–2026 Sasha Smith. All rights reserved.
