<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# AIT PROfessor v1.1

**A cutting-edge multimodal hybrid AI assistant for IT professionals, pentesters, and developers**

[![Author](https://img.shields.io/badge/Author-Sasha%20Smith-blueviolet?style=flat-square)](https://github.com/sashasmith-syber)
[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen?style=flat-square)](https://github.com/sashasmith-syber/AIT-PROfessor/releases)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Live App](https://img.shields.io/badge/Live%20App-AI%20Studio-orange?style=flat-square)](https://ai.studio/apps/drive/1MrISzEPYa68heo6SWQXP9dJEjPb75T35)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Live App](#live-app)
- [Documentation](#documentation)
- [Security](#security)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## About

AIT PROfessor is a cutting-edge multimodal hybrid AI digital being, preloaded with all human IT knowledge. It functions as an ultimate pentesting knowledge tool, coder, prompt engineer, troubleshooter, and IT practical course generator.

Built on React 19 and powered by Google Gemini 2.5 Flash, AIT PROfessor provides 12 specialized AI modes tailored to the full spectrum of IT and security workflows — from hands-on pentesting and secure code review to API integration, performance analysis, and UI/UX prototyping.

---

## Features

### 12 Specialized AI Modes

| Mode | Description |
|------|-------------|
| 🎓 **Professor** | Deep IT knowledge tutor — explains concepts, protocols, and architectures |
| 💻 **Coder** | Full-stack code generation, review, and optimization |
| 🔧 **Troubleshooter** | Systematic diagnostics and root-cause analysis |
| 🔐 **Security Analyst** | Penetration testing guidance, CVE analysis, threat modeling |
| 🧪 **Test Case Generator** | Automated unit, integration, and E2E test scaffolding |
| 🐛 **Semantic Debugger** | Deep semantic analysis to find logic and runtime bugs |
| 🔄 **Code Translator** | Cross-language code migration (Python ↔ TypeScript ↔ Go, etc.) |
| 🔗 **API Integrator** | API design, integration patterns, and OpenAPI spec generation |
| 📚 **Documentation Generator** | Auto-generate README, JSDoc, and technical docs |
| ⚡ **Performance Analyzer** | Profiling, bottleneck detection, and optimization strategies |
| 🎨 **UI/UX Prototyper** | Wireframes, component design, and accessibility reviews |
| 🖥️ **Simulation Environment** | Simulate environments, scenarios, and attack/defense exercises |

### Additional Capabilities

- **Multimodal Input** — text, images, audio, JSON, CSV, and Markdown
- **Conversation Management** — persistent chat history via `localStorage`
- **Cyberpunk / hacker aesthetic UI** — dark theme built for the terminal mindset

---

## Tech Stack

| Technology | Version |
|------------|---------|
| React | 19.1.0 |
| TypeScript | 5.8 |
| Vite | 6.2 |
| Google Gemini | 2.5 Flash |
| @google/genai | 1.8.0 |

---

## Prerequisites

- **Node.js** 18 or higher
- **Google Gemini API key** — free at [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

## Installation

```bash
git clone https://github.com/sashasmith-syber/AIT-PROfessor.git
cd AIT-PROfessor
npm install
```

---

## Configuration

Create a `.env.local` file in the project root (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and set your API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **WARNING:** Never commit `.env.local` or any file containing your API key to version control. `.env.local` is listed in `.gitignore` and must stay there.

---

## Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173` by default.

---

## Project Structure

```
AIT-PROfessor/
├── components/          # Reusable React UI components
├── constants/           # App-wide constants and configuration
├── services/            # API service layer (Gemini integration)
├── App.tsx              # Root application component
├── index.tsx            # React entry point
├── types.ts             # TypeScript type definitions
├── constants.tsx        # Top-level constants
├── vite.config.ts       # Vite build configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project metadata and dependencies
├── metadata.json        # AI Studio metadata
├── index.html           # HTML entry point
├── .env.local.example   # Environment variable template
└── .gitignore           # Git ignore rules
```

---

## Live App

🚀 **[Launch AIT PROfessor on AI Studio](https://ai.studio/apps/drive/1MrISzEPYa68heo6SWQXP9dJEjPb75T35)**

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and design decisions |
| [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) | Project overview and business context |
| [DEVELOPMENT_ROADMAP_AND_ANALYTICS_REPORT.md](DEVELOPMENT_ROADMAP_AND_ANALYTICS_REPORT.md) | Full development roadmap and analytics |
| [METRICS_AND_ANALYTICS.md](METRICS_AND_ANALYTICS.md) | Performance metrics and analytics data |
| [MULTI_AI_PROVIDER_STRATEGY.md](MULTI_AI_PROVIDER_STRATEGY.md) | Strategy for multi-provider AI support |
| [GREY_SWAN_INTEGRATION_GUIDE.md](GREY_SWAN_INTEGRATION_GUIDE.md) | Grey Swan AI integration guide |
| [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) | Quick start instructions |
| [INDEX.md](INDEX.md) | Documentation index |

---

## Security

> ⚠️ **IMPORTANT:** Your `GEMINI_API_KEY` must only ever be stored in `.env.local`. Never commit it to any repository.

See [SECURITY.md](SECURITY.md) for the full security policy, including how to report vulnerabilities and what to do if an API key is accidentally exposed.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to fork, branch, and submit pull requests.

---

## Author

**Sasha Smith** — <a href="https://github.com/sashasmith-syber">@sashasmith-syber</a>

> Creator, architect, and sole author of AIT PROfessor.

© 2025–2026 Sasha Smith (sashasmith-syber). All rights reserved.

---

## License

This project is licensed under the [MIT License](LICENSE).

© 2025–2026 Sasha Smith (sashasmith-syber)
