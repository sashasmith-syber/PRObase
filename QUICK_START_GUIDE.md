# AIT PROfessor - Quick Start Guide
*Get up and running in 5 minutes*

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env.local` file in the project root:

```bash
# .env.local
GEMINI_API_KEY=your_api_key_here
```

**⚠️ SECURITY WARNING:** Never commit `.env.local` to git!

### Step 3: Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📖 Basic Usage

### 1. Select an AI Mode
Click the mode dropdown at the bottom of the screen. Choose from:
- **Professor** - Teaching and explanations
- **Coder** - Code generation and review
- **Troubleshooter** - IT problem solving
- **Security Analyst** - Cybersecurity guidance
- **And 8 more specialized modes!**

### 2. Send a Message
Type your question or request in the input box and press Enter or click Send.

### 3. Attach Files (Optional)
- Click the 📎 icon to upload files
- Or paste images directly (Ctrl+V / Cmd+V)
- Supported: Images, audio, text files, JSON, CSV, Markdown

### 4. View Response
The AI will stream its response in real-time. Code blocks are automatically syntax-highlighted.

### 5. Manage Conversations
- Click the history icon (📜) to view past conversations
- Click "New Chat" to start fresh
- Delete conversations with the trash icon

---

## 🎨 UI Customization

### Change Wallpaper
1. Click the wallpaper icon in the header
2. Choose from 8 presets or enter a custom URL
3. Background changes instantly

### Available Themes
- Matrix (default hacker aesthetic)
- Digital Rain
- Cyberpunk City
- Neural Network
- Binary Code
- Glitch Art
- Holographic
- Quantum Field

---

## 🔧 Configuration

### Modify AI Behavior
Edit `constants.tsx` to adjust mode parameters:

```typescript
{
  id: Mode.Coder,
  temperature: 0.2,  // Lower = more deterministic (0.0-1.0)
  topK: 40,          // Limits token sampling
  topP: 0.9,         // Nucleus sampling threshold
  prompt: "Your custom system prompt here..."
}
```

### Add a New Mode
1. Add enum value to `types.ts`:
   ```typescript
   export enum Mode {
     // ... existing modes
     MyCustomMode = 'MyCustomMode',
   }
   ```

2. Add mode configuration to `constants.tsx`:
   ```typescript
   {
     id: Mode.MyCustomMode,
     title: 'My Custom Mode',
     prompt: 'You are a...',
     icon: <CustomIcon />,
     color: 'text-purple-400',
     temperature: 0.5,
   }
   ```

3. Create icon component in `components/icons/CustomIcon.tsx`

---

## 🐛 Troubleshooting

### "API_KEY environment variable not set"
**Solution:** Create `.env.local` file with your Gemini API key.

### Messages not saving
**Solution:** Check browser localStorage is enabled. Some privacy modes disable it.

### Slow responses
**Possible causes:**
- Network latency
- API rate limiting
- Large file attachments

**Solutions:**
- Check your internet connection
- Compress images before uploading
- Wait a moment between requests

### Storage quota exceeded
**Solution:** Delete old conversations from history panel.

```javascript
// Check current usage (Developer Console)
const usage = JSON.stringify(localStorage).length;
console.log(`Using ${(usage / 1024 / 1024).toFixed(2)} MB`);
```

---

## 🧪 Development Commands

### Start Dev Server
```bash
npm run dev
```
- Hot reload enabled
- Runs on port 3000

### Build for Production
```bash
npm run build
```
- Output: `dist/` folder
- Optimized and minified

### Preview Production Build
```bash
npm run preview
```
- Test production build locally

### Lint Code (Future)
```bash
npm run lint
```
- Not yet configured

### Run Tests (Future)
```bash
npm test
```
- Not yet implemented

---

## 📂 Project Structure Quick Reference

```
/workspace
├── App.tsx                    # ← Main app component, start here
├── types.ts                   # ← All TypeScript types
├── constants.tsx              # ← Mode configurations
│
├── components/
│   ├── ChatWindow.tsx        # Message display
│   ├── PromptInput.tsx       # User input
│   └── ...
│
├── services/
│   ├── geminiService.ts      # AI API calls
│   └── localStorageService.ts # Data persistence
│
└── package.json              # Dependencies
```

---

## 🎯 Common Tasks

### Task: Add a Custom System Prompt
**File:** `constants.tsx`

```typescript
// Find the mode you want to customize
{
  id: Mode.Professor,
  prompt: 'Your custom instructions here...'
}
```

### Task: Change the Color Scheme
**File:** `index.html`

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'electric-lime': '#39ff14',  // ← Change this
        'hacker-dark': '#040504',    // ← And this
      }
    }
  }
}
```

### Task: Modify Streaming Behavior
**File:** `services/geminiService.ts`

```typescript
const response = await ai.models.generateContentStream({
  model: 'gemini-2.5-flash',  // ← Try different models
  contents: contents,
  config: {
    temperature: temperature,  // ← Adjust creativity
    topP: topP,               // ← Adjust randomness
    topK: topK,               // ← Adjust diversity
  },
});
```

### Task: Add File Type Support
**File:** `components/PromptInput.tsx`

```typescript
<input 
  type="file" 
  accept="image/*,audio/*,text/*,.json,.csv,.md,.pdf,.docx"  // ← Add types
/>
```

Then handle in `services/geminiService.ts`:
```typescript
if (fileType === 'pdf') {
  // Add PDF parsing logic
}
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep `.env.local` out of version control
- Rotate API keys regularly
- Use HTTPS in production
- Validate user inputs
- Sanitize file uploads

### ❌ DON'T:
- Commit API keys to git
- Use API key in client-side code (production)
- Trust user-provided URLs without validation
- Store sensitive data in localStorage

---

## 🤝 Contributing

### Before Making Changes
1. Read `DEVELOPMENT_ROADMAP_AND_ANALYTICS_REPORT.md`
2. Check existing issues/PRs
3. Follow the existing code style

### Making Changes
1. Create a feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes

3. Test thoroughly

4. Commit with clear messages
   ```bash
   git commit -m "feat: Add PDF upload support"
   ```

5. Push and create PR
   ```bash
   git push origin feature/my-feature
   ```

---

## 📚 Learning Resources

### Understanding the Codebase
1. **Start with:** `App.tsx` - See how components connect
2. **Then read:** `types.ts` - Understand the data model
3. **Explore:** `constants.tsx` - See mode configurations
4. **Deep dive:** `services/geminiService.ts` - AI integration

### React 19 Features Used
- `useState` - Component state management
- `useEffect` - Side effects (scroll, localStorage)
- `useCallback` - Memoized callbacks
- `useRef` - DOM references (scroll, file input)

### External Documentation
- [Gemini API Docs](https://ai.google.dev/docs)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🎓 Example Use Cases

### 1. Code Review
```
Mode: Coder
Prompt: "Review this function for security issues and performance"
Attach: myFunction.js
```

### 2. Learn a Concept
```
Mode: Professor
Prompt: "Explain how JWT authentication works with examples"
```

### 3. Debug an Error
```
Mode: Semantic Debugger
Prompt: "Why am I getting 'Cannot read property of undefined'?"
Attach: errorCode.ts
```

### 4. Generate Tests
```
Mode: Test Case Generator
Prompt: "Create unit tests for this React component"
Attach: MyComponent.tsx
```

### 5. Translate Code
```
Mode: Code Translator
Prompt: "Convert this Python script to TypeScript"
Attach: script.py
```

---

## ⚡ Performance Tips

### Faster Responses
- Use more specific prompts
- Choose the right mode for your task
- Avoid extremely long conversations (split into new chats)

### Lower Costs
- Compress images before uploading
- Use Professor mode for simple questions (lower token usage)
- Avoid redundant context in prompts

### Better Results
- Be specific in your requests
- Provide context when needed
- Use attachments for code instead of pasting
- Give feedback if the response isn't what you wanted

---

## 🆘 Getting Help

### Common Questions
- **Q: Can I use offline?**  
  A: No, requires internet for AI API. Offline mode is on the roadmap.

- **Q: How much does it cost?**  
  A: Depends on Gemini API usage. Check [Google AI Pricing](https://ai.google.dev/pricing).

- **Q: Can I self-host?**  
  A: Yes! Build and deploy anywhere that supports Node.js.

- **Q: Mobile app available?**  
  A: Not yet. Web app is mobile-responsive. Native apps planned for 2026.

### Need Support?
1. Check `DEVELOPMENT_ROADMAP_AND_ANALYTICS_REPORT.md`
2. Check `ARCHITECTURE.md` for technical details
3. Read `EXECUTIVE_SUMMARY.md` for overview
4. Create an issue on GitHub (if available)

---

## 🎉 You're Ready!

Start by selecting a mode and asking a question. The AI will guide you from there.

**Pro Tip:** Try the command `/AIT_PROFESSOR_FORGET_ME` to reset all data and start fresh.

---

*Last Updated: 2025-11-20*
*Version: 1.1*
