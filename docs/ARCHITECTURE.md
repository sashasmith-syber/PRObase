# Architecture

This document describes the technical architecture of AIT PROfessor.

## Overview

AIT PROfessor is a multimodal hybrid AI application built with React and TypeScript, powered by Google's Gemini 2.5 Flash model. It provides 12 specialized AI modes for various IT tasks.

## Technology Stack

### Frontend
- **React 19.x** - UI framework
- **TypeScript 5.x** - Type safety
- **Vite 6.x** - Build tool and dev server

### AI/ML
- **Google Gemini 2.5 Flash** - LLM model
- **@google/genai** - Gemini API client

### Development Tools
- **@vitejs/plugin-react** - React integration for Vite
- **@types/node** - Node.js type definitions

## Project Structure

```
AIT-PROfessor/
├── components/          # React components
│   ├── ChatWindow.tsx   # Main chat interface
│   ├── Header.tsx       # Application header
│   ├── HistoryPanel.tsx # Conversation history sidebar
│   ├── Message.tsx      # Individual message display
│   ├── ModeSelector.tsx # Mode selection interface
│   ├── PromptInput.tsx  # User input component
│   ├── ResetConfirmationModal.tsx  # Reset dialog
│   ├── WallpaperSelector.tsx       # Background selector
│   ├── icons/           # Icon components
│   └── ui/              # Reusable UI components
├── constants/           # Application constants
│   └── wallpapers.ts    # Wallpaper definitions
├── services/            # Business logic services
│   ├── geminiService.ts     # AI integration
│   └── localStorageService.ts  # Data persistence
├── docs/                # Documentation
├── App.tsx              # Main application component
├── constants.tsx        # Mode definitions and configs
├── types.ts             # TypeScript type definitions
├── index.tsx            # Application entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Core Components

### Application Entry Point

**index.tsx**
- Initializes React root
- Renders the App component in StrictMode

### Main Application

**App.tsx**
- State management for messages, modes, and UI
- Conversation history management
- Wallpaper customization
- File attachment handling
- Streaming response coordination

### Component Details

#### ChatWindow
- Displays conversation messages
- Handles streaming responses
- Shows loading states
- Manages error display

#### PromptInput
- Text input with multiline support
- File attachment capabilities
- Send button with keyboard shortcuts
- Attachment preview and removal

#### ModeSelector
- Grid display of all 12 modes
- Visual mode indicators
- Mode switching functionality
- Active mode highlighting

#### HistoryPanel
- Conversation list sidebar
- New conversation creation
- Conversation loading
- Conversation deletion
- Search/filter functionality

#### Header
- Application branding
- History panel toggle
- Mode indicator
- Wallpaper selector access

### Services

#### geminiService.ts

Handles all AI model interactions:

**Key Functions:**
- `getAiResponseStream()` - Streams AI responses
- `convertMessagesToContent()` - Formats messages for API
- `base64ToUtf8()` - Decodes text file attachments

**Features:**
- Multimodal support (text, images, audio)
- File attachment handling
- Message history conversion
- Role-based content merging
- Streaming response handling

**Model Configuration:**
- Model: `gemini-2.5-flash`
- Dynamic system instructions per mode
- Configurable temperature, topP, topK

#### localStorageService.ts

Manages persistent storage:

**Key Functions:**
- `getHistory()` - Load conversation history
- `saveHistory()` - Persist conversations
- `getActiveConversationId()` - Get current conversation
- `setActiveConversationId()` - Set active conversation

**Data Structure:**
```typescript
{
  conversations: Conversation[],
  activeConversationId: string | null
}
```

## Type System

### Core Types (types.ts)

**Role**
```typescript
enum Role {
  User = 'user',
  Model = 'model'
}
```

**Message**
```typescript
interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  attachment?: {
    data: string;      // base64 data URL
    mimeType: string;
    name: string;
  };
}
```

**Conversation**
```typescript
interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}
```

**Mode**
```typescript
enum Mode {
  Professor = 'Professor',
  Coder = 'Coder',
  Troubleshooter = 'Troubleshooter',
  Security = 'Security',
  // ... 8 more modes
}
```

**ModeInfo**
```typescript
interface ModeInfo {
  id: Mode;
  title: string;
  prompt: string;           // System instruction
  icon: React.ReactElement;
  color: string;            // Tailwind color class
  temperature?: number;
  topP?: number;
  topK?: number;
}
```

## State Management

### Application State (App.tsx)

**Message State:**
- `messages` - Current conversation messages
- `streamingResponse` - Real-time AI response
- `isLoading` - API request state
- `error` - Error messages

**Mode State:**
- `activeMode` - Currently selected mode
- Mode-specific configurations loaded from MODES array

**UI State:**
- `isHistoryPanelOpen` - History sidebar visibility
- `isResetModalOpen` - Confirmation dialog state
- `activeWallpaper` - Selected background

**History State:**
- `history` - All saved conversations
- `activeConversationId` - Current conversation ID

**Attachment State:**
- `attachment` - Current file attachment
- Includes data URL, MIME type, and filename

## Data Flow

### Message Sending Flow

1. User enters text/attaches file in `PromptInput`
2. User submits (click or Enter)
3. `App.tsx` creates new user message
4. Message added to state and conversation
5. `geminiService.getAiResponseStream()` called
6. Streaming response displayed in real-time
7. Complete response saved as model message
8. Conversation auto-saved to localStorage

### Mode Switching Flow

1. User clicks mode in `ModeSelector`
2. `activeMode` state updated in `App.tsx`
3. New mode's configuration applied
4. Subsequent messages use new mode's prompt
5. Mode indicator updated in UI

### History Management Flow

1. Conversations auto-saved after each exchange
2. User can create new conversation
3. Loading conversation restores messages
4. Deleting conversation removes from storage
5. Active conversation tracked separately

## API Integration

### Gemini API

**Endpoint:** Google Gemini 2.5 Flash
**Method:** Streaming generation
**Authentication:** API Key via environment variable

**Request Structure:**
```typescript
{
  model: 'gemini-2.5-flash',
  contents: Content[],
  config: {
    systemInstruction: string,
    temperature: number,
    topP: number,
    topK: number
  }
}
```

**Content Format:**
```typescript
{
  role: 'user' | 'model',
  parts: [
    { text: string } |
    { inlineData: { mimeType: string, data: string } }
  ]
}
```

## Configuration

### Environment Variables

**Required:**
- `API_KEY` - Gemini API key (set in `.env.local`)

### Vite Configuration (vite.config.ts)

```typescript
{
  plugins: [react()],
  define: {
    'process.env': process.env
  }
}
```

### TypeScript Configuration (tsconfig.json)

- **target:** ES2020
- **jsx:** react-jsx
- **module:** ESNext
- **moduleResolution:** bundler
- **strict:** true

## Build & Deployment

### Development
```bash
npm run dev
```
Starts Vite dev server with HMR

### Production Build
```bash
npm run build
```
Creates optimized production bundle in `dist/`

### Preview Production Build
```bash
npm run preview
```
Serves production build locally

## Performance Considerations

### Optimizations
- Streaming responses for immediate feedback
- LocalStorage for offline conversation access
- Message history merging to reduce API calls
- Base64 file handling for small attachments

### Potential Improvements
- Message pagination for long conversations
- Conversation search indexing
- Image compression before upload
- Conversation export functionality

## Security

### Current Measures
- API key stored in environment variables
- No API key in client-side code
- Input sanitization for file uploads

### Recommendations
- Implement rate limiting
- Add authentication layer
- Encrypt localStorage data
- Validate file types and sizes
- Implement CORS policies

## Browser Compatibility

- Modern browsers supporting ES2020
- LocalStorage API required
- File API for attachments
- TextDecoder API for file reading

## Future Architecture Considerations

- Backend API layer for enhanced security
- Database for conversation persistence
- User authentication system
- Real-time collaboration features
- Plugin system for custom modes
- Vector database for semantic search
