# Contributing to AIT PROfessor

Thank you for your interest in contributing to AIT PROfessor! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Adding New Features](#adding-new-features)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers warmly
- Provide constructive feedback
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Git
- A code editor (VS Code recommended)
- Gemini API key for testing

### Fork and Clone

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/your-username/AIT-PROfessor.git
cd AIT-PROfessor

# Add upstream remote
git remote add upstream https://github.com/sashasmith-syber/AIT-PROfessor.git
```

## Development Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
# Create .env.local
cp .env.example .env.local  # If example exists, or create manually

# Add your API key
echo "API_KEY=your_gemini_api_key" > .env.local
```

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your changes live.

## Project Structure

```
AIT-PROfessor/
├── components/              # React components
│   ├── ChatWindow.tsx       # Main chat display
│   ├── Header.tsx           # App header
│   ├── ModeSelector.tsx     # Mode selection UI
│   ├── PromptInput.tsx      # User input component
│   ├── icons/               # Icon components
│   └── ui/                  # Reusable UI elements
├── services/                # Business logic
│   ├── geminiService.ts     # AI API integration
│   └── localStorageService.ts  # Storage management
├── docs/                    # Documentation
│   ├── MODES.md            # Mode documentation
│   ├── ARCHITECTURE.md     # Technical architecture
│   ├── USER_GUIDE.md       # User documentation
│   └── ...                 # Other docs
├── constants/              # Configuration constants
│   └── wallpapers.ts       # Wallpaper definitions
├── App.tsx                 # Main application
├── constants.tsx           # Mode definitions
├── types.ts                # TypeScript types
└── index.tsx               # Entry point
```

## Making Changes

### Branch Naming

Use descriptive branch names:

```bash
# Features
git checkout -b feature/add-new-mode

# Bug fixes
git checkout -b fix/resolve-streaming-issue

# Documentation
git checkout -b docs/improve-readme

# Refactoring
git checkout -b refactor/simplify-message-handling
```

### Commit Messages

Follow conventional commits format:

```
type(scope): brief description

Longer description if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(modes): add new code optimization mode

fix(chat): resolve infinite scroll issue

docs(readme): update installation instructions

refactor(services): simplify API error handling
```

### Keep Changes Focused

- One feature/fix per pull request
- Keep PRs small and reviewable
- Split large changes into multiple PRs

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

**Good:**
```typescript
interface MessageProps {
  content: string;
  role: Role;
  timestamp: Date;
}

function Message({ content, role, timestamp }: MessageProps) {
  // ...
}
```

**Avoid:**
```typescript
function Message(props: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Keep components focused and small
- Extract reusable logic to custom hooks

**Example:**
```typescript
import React, { useState } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  disabled = false 
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use meaningful variable names

### File Organization

- One component per file
- Co-locate related files
- Use index files for clean imports
- Keep files under 300 lines

## Testing

### Manual Testing Checklist

Before submitting:

- [ ] App starts without errors
- [ ] All modes are selectable
- [ ] Messages send and receive correctly
- [ ] File attachments work
- [ ] Conversation history persists
- [ ] No console errors
- [ ] Works in Chrome and Firefox
- [ ] Responsive on mobile sizes

### Testing Your Changes

```bash
# Run dev server
npm run dev

# Build production version
npm run build

# Preview production build
npm run preview
```

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (if on Mac)

### Responsive Testing

Test at these breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1440px, 1920px

## Submitting Changes

### Before Submitting

1. **Update from upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Build successfully:**
   ```bash
   npm run build
   ```

3. **No TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature
   ```

### Creating Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill out PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How to test these changes

## Checklist
- [ ] Code follows project style
- [ ] Tested locally
- [ ] Updated documentation
- [ ] No breaking changes
```

### PR Review Process

1. Maintainers review your PR
2. Address feedback if requested
3. Make additional commits to your branch
4. Once approved, PR will be merged

## Adding New Features

### Adding a New Mode

1. **Define mode in constants.tsx:**
```typescript
{
  id: Mode.YourNewMode,
  title: 'Your Mode Name',
  prompt: 'System instruction for AI...',
  icon: <YourIcon />,
  color: 'text-color-class',
  temperature: 0.5,
  topK: 50,
  topP: 0.95,
}
```

2. **Add to Mode enum in types.ts:**
```typescript
export enum Mode {
  // ... existing modes
  YourNewMode = 'YourNewMode',
}
```

3. **Create icon component:**
```typescript
// components/icons/YourIcon.tsx
export const YourIcon = () => (
  <svg>...</svg>
);
```

4. **Update documentation:**
   - Add mode to `docs/MODES.md`
   - Add examples to `docs/EXAMPLES.md`

5. **Test thoroughly:**
   - Mode selection works
   - AI responds appropriately
   - Icon displays correctly

### Adding a New Component

1. Create in `components/` directory
2. Use TypeScript and proper types
3. Export as named export
4. Document props with comments
5. Make responsive if UI component

### Adding Documentation

1. Create `.md` file in `docs/`
2. Follow existing format
3. Include code examples
4. Add to relevant README links
5. Keep concise and clear

## Code Review Guidelines

### For Contributors

- Respond to feedback promptly
- Don't take criticism personally
- Ask questions if unclear
- Make requested changes
- Thank reviewers

### For Reviewers

- Be respectful and constructive
- Explain reasoning for changes
- Acknowledge good work
- Focus on code, not person
- Approve when satisfied

## Questions?

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎉
