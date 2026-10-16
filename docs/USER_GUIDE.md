# User Guide

Welcome to AIT PROfessor! This guide will help you get the most out of your multimodal hybrid AI assistant.

## Table of Contents

- [Getting Started](#getting-started)
- [Interface Overview](#interface-overview)
- [Using Modes](#using-modes)
- [Working with Files](#working-with-files)
- [Managing Conversations](#managing-conversations)
- [Customization](#customization)
- [Tips & Best Practices](#tips--best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch

1. **Select a Mode:** Click on one of the 12 mode cards to begin
2. **Start Chatting:** Type your question or request in the input box
3. **Get Responses:** Watch as AIT PROfessor responds in real-time

### Understanding the Initial Message

When you first open AIT PROfessor, you'll see:
```
AIT PROfessor initialized. I am a multimodal hybrid AI, preloaded with 
humanity's entire corpus of IT knowledge. How may I assist you? 
Select a mode or upload an image to begin.
```

This message confirms the system is ready and waiting for your input.

## Interface Overview

### Main Components

```
┌─────────────────────────────────────────────────────────┐
│  [☰] AIT PROfessor    [Current Mode]    [🎨 Wallpaper] │  ← Header
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  Chat Window                            │  ← Messages
│                  (Messages appear here)                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Mode Selector (12 colored cards)                      │  ← Mode Grid
├─────────────────────────────────────────────────────────┤
│  [Type your message here...]              [Send →]     │  ← Input
└─────────────────────────────────────────────────────────┘
```

### Header Bar

- **Menu Icon (☰):** Opens conversation history panel
- **Application Title:** AIT PROfessor branding
- **Mode Indicator:** Shows currently active mode
- **Wallpaper Button:** Opens background customization

### Chat Window

- Displays conversation messages
- User messages appear with your avatar
- AI responses stream in real-time
- Shows loading indicators
- Displays error messages if needed

### Mode Selector

- Grid of 12 colored cards
- Each card shows mode icon and name
- Click to switch modes
- Active mode is highlighted

### Input Area

- Multiline text input
- File attachment button
- Send button
- Attachment preview (when file selected)

## Using Modes

### Selecting a Mode

1. Scroll to the mode selector section
2. Click on the desired mode card
3. The mode activates immediately
4. Mode indicator updates in header

### Mode Characteristics

Each mode has:
- **Unique Personality:** Tailored communication style
- **Specialized Knowledge:** Domain expertise
- **Custom Configuration:** Optimized AI parameters
- **Perfect Memory:** Remembers conversation context

### When to Switch Modes

Switch modes when your task changes:

```
Starting: Learning → Use Professor mode
After understanding → Switch to Coder to implement
Found a bug? → Switch to Troubleshooter or SDCP
Need tests? → Switch to ATCG
```

### Mode Continuity

**Important:** When you switch modes:
- ✅ Conversation history is preserved
- ✅ New mode remembers previous context
- ✅ Different personality/approach applied
- ❌ Previous mode's specialized focus changes

## Working with Files

### Supported File Types

**Images:**
- JPEG, PNG, GIF, WebP
- Used for visual analysis
- Great with Professor, Coder, or GUUP modes

**Audio:**
- MP3, WAV, OGG
- Transcribed and analyzed
- Useful for accessibility features

**Text Files:**
- TXT, MD, JSON, CSV, etc.
- Content embedded in conversation
- Perfect for code review or analysis

### Attaching Files

1. Click the attachment/clip icon in input area
2. Select file from your computer
3. Preview appears in input area
4. Add your message (optional)
5. Click Send

### File Attachment Tips

- **Code Files:** Use with Coder or SDCP modes
- **Screenshots:** Great for Troubleshooter mode
- **Diagrams:** Excellent with GUUP or PPRA modes
- **Logs:** Perfect for Troubleshooter or Security modes

### Removing Attachments

- Click the ❌ icon on attachment preview
- File is removed without sending

## Managing Conversations

### Starting New Conversations

1. Click menu icon (☰) in header
2. History panel opens
3. Click "+ New Conversation" button
4. Current conversation saved automatically
5. New empty conversation created

### Viewing Conversation History

1. Open history panel (☰ icon)
2. See list of all conversations
3. Each shows:
   - Conversation title (auto-generated)
   - Timestamp
   - Preview of first message

### Loading Previous Conversations

1. Open history panel
2. Click on any conversation
3. Messages load into chat window
4. Continue conversation where you left off

### Deleting Conversations

1. Open history panel
2. Find conversation to delete
3. Click delete/trash icon
4. Confirm deletion
5. Conversation removed permanently

### Conversation Titles

- Auto-generated from conversation content
- Based on first message or topic
- Helps identify conversations quickly

### Data Persistence

- Conversations saved in browser LocalStorage
- Automatically saved after each message
- Survives browser restarts
- Tied to specific browser/computer

## Customization

### Wallpaper Selection

1. Click wallpaper button (🎨) in header
2. Choose from available backgrounds
3. Selection applies immediately
4. Preference saved locally

### Available Wallpapers

Multiple cyberpunk-themed backgrounds including:
- Digital patterns
- Tech aesthetics
- Abstract designs
- Dark/light variations

## Tips & Best Practices

### Getting Better Responses

1. **Be Specific:** Detailed questions get detailed answers
   ```
   ❌ "Fix my code"
   ✅ "This React hook causes infinite re-renders. Can you identify the issue?"
   ```

2. **Provide Context:** Share relevant information
   ```
   ❌ "What's wrong?"
   ✅ "I'm getting a 404 error when calling /api/users endpoint. Here's the error log..."
   ```

3. **Choose Right Mode:** Match mode to task
   ```
   Learning concepts → Professor
   Writing code → Coder
   Fixing bugs → Troubleshooter or SDCP
   ```

4. **Leverage Memory:** Reference previous messages
   ```
   "Based on the architecture you explained earlier, how would I implement authentication?"
   ```

### Working with Code

**When Sharing Code:**
- Include relevant context
- Mention programming language
- Describe expected vs actual behavior
- Share error messages if applicable

**Example:**
```
Mode: Coder
Message: "Create a Python function to calculate factorial recursively with input validation"
```

### File Attachment Strategy

**For Code Review:**
1. Attach the code file
2. Use Coder or SDCP mode
3. Ask specific questions about it

**For Design Feedback:**
1. Attach screenshot/mockup
2. Use GUUP mode
3. Ask for critique or improvements

### Conversation Organization

- Start new conversations for different projects
- Use clear, descriptive initial questions
- Keep related topics in same conversation
- Create new conversation when switching projects

### Maximizing Mode Benefits

**Professor Mode:**
- Ask "why" questions
- Request explanations with examples
- Ask for historical context

**Coder Mode:**
- Request specific implementations
- Ask for code reviews
- Seek optimization suggestions

**Troubleshooter Mode:**
- Provide complete error messages
- Describe steps to reproduce
- Share system information

**ATCG Mode:**
- Share user stories or requirements
- Provide code to test
- Request specific test types

## Troubleshooting

### Common Issues

#### "API_KEY environment variable not set"
**Solution:**
1. Create `.env.local` file in project root
2. Add: `API_KEY=your_gemini_api_key`
3. Restart development server

#### No Response from AI
**Possible Causes:**
- Network connectivity issues
- API key invalid/expired
- API rate limits reached

**Solutions:**
- Check internet connection
- Verify API key is valid
- Wait if rate limited
- Check browser console for errors

#### Conversation Not Saving
**Possible Causes:**
- LocalStorage full
- Browser privacy mode
- LocalStorage disabled

**Solutions:**
- Clear old conversations
- Use normal browser mode
- Enable LocalStorage in settings

#### File Won't Attach
**Possible Causes:**
- File too large
- Unsupported file type
- Browser permissions

**Solutions:**
- Compress large files
- Use supported formats
- Check browser permissions

#### Streaming Response Stops
**Possible Causes:**
- Network interruption
- API timeout
- Browser tab inactive

**Solutions:**
- Refresh page
- Retry request
- Keep tab active during responses

### Getting Help

If issues persist:
1. Check browser console for errors
2. Verify API configuration
3. Test with simple queries first
4. Try different browser
5. Clear browser cache

### Performance Tips

**For Faster Responses:**
- Keep conversations focused
- Avoid extremely long messages
- Use appropriate modes
- Clear old conversations

**For Better Quality:**
- Provide context
- Be specific
- Use correct mode
- Leverage conversation memory

## Keyboard Shortcuts

- **Enter:** New line in message
- **Shift + Enter:** Send message (if configured)
- **Esc:** Close modals/panels

## Privacy & Data

### What's Stored Locally
- Conversation history
- Mode preferences
- Wallpaper selection

### What's Sent to API
- Your messages
- Attached files
- Conversation context
- Selected mode configuration

### What's NOT Stored
- API responses aren't permanently stored by default
- Your API key (kept in environment only)
- Personal identification

## Next Steps

- Read [MODES.md](MODES.md) for detailed mode documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Review [EXAMPLES.md](EXAMPLES.md) for usage examples
- See [API.md](API.md) for integration information

---

**Happy Learning and Building with AIT PROfessor!** 🚀
