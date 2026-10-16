# Quick Start Guide

Get up and running with AIT PROfessor in minutes!

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Gemini API Key** (from Google AI Studio)

## Step 1: Get Your API Key

1. Visit [Google AI Studio](https://ai.google.dev)
2. Sign in with your Google account
3. Navigate to "Get API Key"
4. Create a new API key
5. Copy the key (you'll need it in Step 3)

## Step 2: Install Dependencies

```bash
# Clone or download the repository
cd AIT-PROfessor

# Install all dependencies
npm install
```

Expected output:
```
added 133 packages, and audited 134 packages in 20s
found 0 vulnerabilities
```

## Step 3: Configure API Key

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Or create manually
touch .env.local
```

Then edit `.env.local` and add your API key:
```
API_KEY=your_actual_api_key_here
```

**Security Note:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Step 4: Start the Application

```bash
npm run dev
```

Expected output:
```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Step 5: Open in Browser

1. Open your browser
2. Navigate to `http://localhost:5173/`
3. You should see the AIT PROfessor interface!

## Step 6: Start Using!

### Your First Interaction

1. **Click a mode** - Try "Professor" for learning
2. **Type a question** - Example: "Explain how React hooks work"
3. **Press Enter or click Send**
4. **Watch the response stream** - Real-time AI response appears

### Try Different Features

**Upload a file:**
1. Click the attachment icon (📎)
2. Select an image, code file, or document
3. Add a message: "Analyze this file"
4. Send

**Switch modes:**
1. Scroll to the mode selector
2. Click "Coder" mode
3. Ask: "Create a REST API endpoint in Express"

**Manage conversations:**
1. Click the menu icon (☰) in the header
2. View conversation history
3. Start new conversations
4. Load previous ones

## Troubleshooting Setup

### Issue: "API_KEY environment variable not set"

**Solution:**
- Ensure `.env.local` exists in project root
- Check the file contains: `API_KEY=your_key`
- Restart the dev server (`Ctrl+C`, then `npm run dev`)

### Issue: "Port 5173 already in use"

**Solution:**
```bash
# Kill the process using port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- --port 3000
```

### Issue: Dependencies won't install

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Blank page after starting

**Solution:**
1. Check browser console for errors (F12)
2. Verify `.env.local` is configured correctly
3. Check that you're accessing `http://localhost:5173/`
4. Try a different browser
5. Clear browser cache

## Next Steps

Now that you're up and running:

1. **Explore Modes** - Try all 12 modes to see their unique capabilities
2. **Read Documentation:**
   - [MODES.md](MODES.md) - Detailed mode descriptions
   - [USER_GUIDE.md](USER_GUIDE.md) - Complete user guide
   - [EXAMPLES.md](EXAMPLES.md) - Usage examples
3. **Experiment with Files** - Upload code, images, or documents
4. **Customize** - Change wallpapers, create conversations
5. **Build Something** - Use Coder mode to create a project!

## Development Tips

### Hot Module Replacement (HMR)

Changes to `.tsx` and `.ts` files reload automatically. No need to restart the server!

### Viewing the Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Code Structure

```
src/
├── App.tsx              # Main app component
├── components/          # UI components
├── services/            # Business logic
├── constants.tsx        # Mode configurations
└── types.ts            # TypeScript types
```

## Common First Tasks

### Task 1: Learn a Concept (Professor Mode)

```
Mode: Professor
Question: "Explain the difference between let, const, and var in JavaScript"
```

### Task 2: Write Code (Coder Mode)

```
Mode: Coder
Request: "Create a function to validate email addresses using regex"
```

### Task 3: Debug Code (SDCP Mode)

```
Mode: SDCP
Message: "This code throws 'Cannot read property of undefined'. 
Can you identify the issue?" 
[Attach code file]
```

### Task 4: Generate Tests (ATCG Mode)

```
Mode: ATCG
Request: "Generate test cases for a login form with username and password"
```

## API Usage Limits

**Gemini 2.5 Flash** (as of Dec 2024):
- Free tier: Generous limits for development
- Rate limits: Varies by tier
- For production: Consider upgrading to paid tier

Check current limits at: https://ai.google.dev/pricing

## Getting Help

If you're stuck:

1. **Check Console:** Browser DevTools (F12) → Console tab
2. **Read Docs:** `/docs` folder has comprehensive guides
3. **Check Examples:** `EXAMPLES.md` has many use cases
4. **Review Issues:** GitHub repository issues

## Performance Notes

### First Response Might Be Slow

The first AI response after starting the app may take a few seconds. This is normal - subsequent responses are faster.

### Browser Performance

For best performance:
- Use Chrome or Firefox (latest versions)
- Keep DevTools closed during normal use
- Close other resource-heavy tabs

## Security Reminders

- ✅ Keep API key in `.env.local` only
- ✅ Never commit `.env.local` to Git
- ✅ Don't share your API key
- ✅ Rotate keys if compromised
- ✅ Use environment variables in production

## What's Next?

You're ready to explore AIT PROfessor! Try:

1. **Learning Path:** Use Professor → Coder → ATCG workflow
2. **Real Project:** Build something with Coder mode assistance
3. **Code Review:** Have SDCP review your existing code
4. **Documentation:** Generate docs with CDKBG mode
5. **Design:** Create UI components with GUUP mode

**Happy coding! 🚀**
