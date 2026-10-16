<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AIT PROfessor

A cutting-edge multimodal hybrid AI digital being, preloaded with all human IT knowledge. AIT PROfessor functions as an ultimate pentesting knowledge tool, coder, prompt engineer, troubleshooter, and IT practical course generator.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5-orange.svg)](https://ai.google.dev/)

## Overview

AIT PROfessor is an advanced AI assistant powered by Google's Gemini 2.5 Flash, offering 12 specialized modes for different IT tasks. Each mode is fine-tuned with specific prompts and parameters to provide expert-level assistance in its domain.

**View in AI Studio:** https://ai.studio/apps/drive/1MrISzEPYa68heo6SWQXP9dJEjPb75T35

## ✨ Key Features

- **12 Specialized Modes** - Each with unique expertise and personality
- **Multimodal Support** - Handle text, images, audio, and file attachments
- **Streaming Responses** - Real-time AI response generation
- **Conversation History** - Persistent storage of all conversations
- **Perfect Memory** - Context-aware responses within conversations
- **Customizable UI** - Multiple wallpapers and themes
- **File Attachments** - Upload code, images, documents for analysis
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Gemini API Key** from [Google AI Studio](https://ai.google.dev)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
echo "API_KEY=your_gemini_api_key_here" > .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` to start using AIT PROfessor!

📖 **Detailed Setup:** See [Quick Start Guide](docs/QUICKSTART.md)

## 🎯 The 12 Modes

| Mode | Purpose | Best For |
|------|---------|----------|
| 🎓 **Professor** | IT Education | Learning concepts, explanations |
| 💻 **Coder** | Code Generation | Writing production code |
| 🔧 **Troubleshooter** | Problem Solving | Debugging, diagnostics |
| 🛡️ **Security Analyst** | Cybersecurity | Security audits, defensive strategies |
| 🧪 **ATCG** | Test Generation | Creating comprehensive test cases |
| 🐛 **SDCP** | Semantic Debugging | Understanding and fixing bugs |
| 🔄 **CLFT** | Code Translation | Porting between languages/frameworks |
| 🔌 **AISV** | API Integration | Client generation, schema validation |
| 📚 **CDKBG** | Documentation | Creating project docs and guides |
| ⚡ **PPRA** | Performance Analysis | Optimization recommendations |
| 🎨 **GUUP** | UI/UX Design | Component design, prototyping |
| 🔬 **SEE** | Simulation | System modeling, predictions |

📖 **Detailed Mode Documentation:** [MODES.md](docs/MODES.md)

## 📚 Documentation

### Getting Started
- [Quick Start Guide](docs/QUICKSTART.md) - Get up and running in minutes
- [User Guide](docs/USER_GUIDE.md) - Complete user documentation
- [Usage Examples](docs/EXAMPLES.md) - Real-world usage scenarios

### Technical
- [Architecture](docs/ARCHITECTURE.md) - Technical architecture overview
- [API Documentation](docs/API.md) - API reference and integration guide
- [Contributing](docs/CONTRIBUTING.md) - How to contribute to the project

### Reference
- [Modes Documentation](docs/MODES.md) - Detailed mode descriptions
- [Type Definitions](types.ts) - TypeScript type reference

## 🛠️ Technology Stack

- **Frontend:** React 19.1, TypeScript 5.8
- **Build Tool:** Vite 6.2
- **AI Model:** Google Gemini 2.5 Flash
- **State Management:** React Hooks
- **Storage:** Browser LocalStorage
- **Styling:** Tailwind CSS (via inline classes)

## 💡 Usage Examples

### Learning a Concept
```
Mode: Professor
Question: "Explain how async/await works in JavaScript"
```

### Writing Code
```
Mode: Coder
Request: "Create a REST API endpoint for user authentication in Express.js"
```

### Debugging
```
Mode: SDCP (Semantic Debugger)
Message: "This React component causes infinite re-renders" 
[Attach component code]
```

### Generating Tests
```
Mode: ATCG (Test Case Generator)
Request: "Generate unit tests for a user registration form"
```

More examples: [EXAMPLES.md](docs/EXAMPLES.md)

## 🔧 Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Project Structure
```
AIT-PROfessor/
├── components/          # React components
├── services/            # Business logic
│   ├── geminiService.ts    # AI integration
│   └── localStorageService.ts  # Data persistence
├── docs/                # Documentation
├── constants/           # Configuration
├── App.tsx              # Main application
├── constants.tsx        # Mode definitions
└── types.ts            # TypeScript types
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details on:

- Code standards
- Development workflow
- Submitting pull requests
- Adding new features

## 📝 License

This project is part of AI Studio and follows their terms of service.

## 🔐 Security

- API keys should be stored in `.env.local` only
- Never commit `.env.local` to version control
- File uploads are client-side only
- Consider implementing authentication for production use

## 🐛 Troubleshooting

### Common Issues

**"API_KEY environment variable not set"**
- Create `.env.local` file with `API_KEY=your_key`
- Restart development server

**No AI Response**
- Check internet connection
- Verify API key is valid
- Check browser console for errors

**Conversations Not Saving**
- Ensure LocalStorage is enabled
- Check browser storage quota
- Try normal browsing mode (not incognito)

More help: [User Guide - Troubleshooting](docs/USER_GUIDE.md#troubleshooting)

## 🌟 Key Features in Detail

### Perfect Memory
All modes remember your entire conversation, allowing for context-aware responses and building upon previous interactions.

### Multimodal Capabilities
Upload and analyze:
- **Images** (JPEG, PNG, GIF) - Visual analysis and feedback
- **Audio** (MP3, WAV) - Transcription and analysis
- **Text Files** (Code, logs, configs) - Content analysis and review

### Streaming Responses
Real-time AI responses stream token-by-token for immediate feedback and better user experience.

### Conversation Management
- Automatic conversation saving
- Load previous conversations
- Create multiple conversation threads
- Delete old conversations

## 📊 Performance

- **First Response:** 2-5 seconds (initial API connection)
- **Subsequent Responses:** <1 second start time
- **Streaming:** Real-time token delivery
- **Storage:** Unlimited conversations (browser storage limits apply)

## 🎨 Customization

- **Wallpapers:** Multiple cyberpunk-themed backgrounds
- **Modes:** 12 specialized modes with unique personalities
- **Conversation Organization:** Manage multiple conversation threads

## 🔮 Future Roadmap

- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Custom mode creation
- [ ] Plugin system
- [ ] Team collaboration features
- [ ] Export conversations
- [ ] Advanced search and filtering

## 📞 Support

- **Documentation:** Check the [docs/](docs/) folder
- **Issues:** Report bugs via GitHub Issues
- **API Limits:** See [Gemini API documentation](https://ai.google.dev/pricing)

## 🙏 Acknowledgments

- Built with [Google Gemini](https://ai.google.dev/)
- Powered by [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Created for [AI Studio](https://ai.studio/)

---

**Happy Learning and Building!** 🚀

Made with ❤️ for the developer community
