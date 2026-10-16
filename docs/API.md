# API Documentation

This document describes the internal APIs and integration points of AIT PROfessor.

## Table of Contents

- [Gemini Service API](#gemini-service-api)
- [Local Storage Service API](#local-storage-service-api)
- [Type Definitions](#type-definitions)
- [Constants](#constants)
- [Integration Guide](#integration-guide)

## Gemini Service API

Located at: `services/geminiService.ts`

### getAiResponseStream()

Generates streaming AI responses based on conversation history and mode configuration.

**Signature:**
```typescript
getAiResponseStream(
  history: Message[],
  modeInfo?: ModeInfo
): Promise<AsyncGenerator<{ text: string }>>
```

**Parameters:**
- `history` - Array of conversation messages
- `modeInfo` - Optional mode configuration (uses default if not provided)

**Returns:**
- Async generator yielding response chunks with `text` property

**Usage:**
```typescript
const stream = await getAiResponseStream(messages, MODES[0]);

for await (const chunk of stream) {
  console.log(chunk.text);
}
```

**Model Configuration:**
- **Model:** `gemini-2.5-flash`
- **Temperature:** From mode config (default: 0.7)
- **Top P:** From mode config (default: 0.95)
- **Top K:** From mode config (default: 64)
- **System Instruction:** From mode prompt

**Error Handling:**
```typescript
try {
  const stream = await getAiResponseStream(messages, modeInfo);
  // Process stream
} catch (error) {
  console.error('API Error:', error);
}
```

### convertMessagesToContent()

Internal function that converts application messages to Gemini API format.

**Signature:**
```typescript
convertMessagesToContent(messages: Message[]): Promise<Content[]>
```

**Features:**
- Filters initialization messages
- Handles multimodal content (text, images, audio)
- Decodes text file attachments
- Merges consecutive messages from same role

**Content Structure:**
```typescript
{
  role: 'user' | 'model',
  parts: [
    { text: string } |
    { inlineData: { mimeType: string, data: string } }
  ]
}
```

### base64ToUtf8()

Decodes base64-encoded text files.

**Signature:**
```typescript
base64ToUtf8(base64: string): string | null
```

**Parameters:**
- `base64` - Base64-encoded string

**Returns:**
- Decoded UTF-8 string or null if decoding fails

## Local Storage Service API

Located at: `services/localStorageService.ts`

### getHistory()

Retrieves all conversation history from localStorage.

**Signature:**
```typescript
getHistory(): Conversation[]
```

**Returns:**
- Array of conversation objects
- Empty array if no history exists

**Usage:**
```typescript
const conversations = getHistory();
console.log(`Found ${conversations.length} conversations`);
```

**Storage Key:** `ait-professor-history`

### saveHistory()

Persists conversation history to localStorage.

**Signature:**
```typescript
saveHistory(history: Conversation[]): void
```

**Parameters:**
- `history` - Array of conversations to save

**Usage:**
```typescript
const updatedHistory = [...history, newConversation];
saveHistory(updatedHistory);
```

**Error Handling:**
```typescript
try {
  saveHistory(history);
} catch (error) {
  console.error('Storage quota exceeded or blocked:', error);
}
```

### getActiveConversationId()

Gets the currently active conversation ID.

**Signature:**
```typescript
getActiveConversationId(): string | null
```

**Returns:**
- Conversation ID string or null if none active

**Storage Key:** `ait-professor-active-conversation`

### setActiveConversationId()

Sets the active conversation ID.

**Signature:**
```typescript
setActiveConversationId(id: string | null): void
```

**Parameters:**
- `id` - Conversation ID to set as active, or null to clear

## Type Definitions

Located at: `types.ts`

### Role Enum

```typescript
enum Role {
  User = 'user',
  Model = 'model'
}
```

**Usage:**
```typescript
const userMessage: Message = {
  id: 'msg-1',
  role: Role.User,
  content: 'Hello',
  timestamp: new Date()
};
```

### Message Interface

```typescript
interface Message {
  id: string;              // Unique message identifier
  role: Role;              // User or Model
  content: string;         // Message text
  timestamp: Date;         // Creation timestamp
  attachment?: {           // Optional file attachment
    data: string;          // Base64 data URL
    mimeType: string;      // File MIME type
    name: string;          // Original filename
  };
}
```

**Creating Messages:**
```typescript
// Text-only message
const message: Message = {
  id: crypto.randomUUID(),
  role: Role.User,
  content: 'Explain React hooks',
  timestamp: new Date()
};

// Message with attachment
const messageWithFile: Message = {
  id: crypto.randomUUID(),
  role: Role.User,
  content: 'Review this code',
  timestamp: new Date(),
  attachment: {
    data: 'data:text/plain;base64,SGVsbG8=',
    mimeType: 'text/plain',
    name: 'example.txt'
  }
};
```

### Conversation Interface

```typescript
interface Conversation {
  id: string;              // Unique conversation ID
  title: string;           // Display title
  timestamp: string;       // ISO 8601 timestamp
  messages: Message[];     // Conversation messages
}
```

**Creating Conversations:**
```typescript
const conversation: Conversation = {
  id: crypto.randomUUID(),
  title: 'React Hooks Discussion',
  timestamp: new Date().toISOString(),
  messages: []
};
```

### Mode Enum

```typescript
enum Mode {
  Professor = 'Professor',
  Coder = 'Coder',
  Troubleshooter = 'Troubleshooter',
  Security = 'Security',
  TestCaseGenerator = 'TestCaseGenerator',
  SemanticDebugger = 'SemanticDebugger',
  CodeTranslator = 'CodeTranslator',
  ApiIntegrator = 'ApiIntegrator',
  KnowledgeBaseGenerator = 'KnowledgeBaseGenerator',
  PerformanceAnalyzer = 'PerformanceAnalyzer',
  GenerativeUiUxPrototyper = 'GenerativeUiUxPrototyper',
  SimulatedExperimentation = 'SimulatedExperimentation'
}
```

### ModeInfo Interface

```typescript
interface ModeInfo {
  id: Mode;                           // Mode identifier
  title: string;                      // Display name
  prompt: string;                     // System instruction
  icon: React.ReactElement;           // Mode icon
  color: string;                      // Tailwind color class
  temperature?: number;               // AI temperature (0-1)
  topP?: number;                      // Nucleus sampling
  topK?: number;                      // Top-K sampling
}
```

## Constants

Located at: `constants.tsx`

### MODES Array

```typescript
const MODES: ModeInfo[]
```

Array of all 12 mode configurations.

**Access Specific Mode:**
```typescript
import { MODES } from './constants';
import { Mode } from './types';

const coderMode = MODES.find(m => m.id === Mode.Coder);
```

**Iterate All Modes:**
```typescript
MODES.forEach(mode => {
  console.log(`${mode.title}: ${mode.prompt}`);
});
```

### Wallpapers

Located at: `constants/wallpapers.ts`

```typescript
export const WALLPAPERS: string[]
```

Array of wallpaper image URLs.

## Integration Guide

### Adding AI Capabilities to Your App

**Step 1: Install Dependencies**
```bash
npm install @google/genai react react-dom
```

**Step 2: Copy Core Services**
```
your-app/
├── services/
│   ├── geminiService.ts
│   └── localStorageService.ts
├── types.ts
└── constants.tsx
```

**Step 3: Initialize API**
```typescript
import { getAiResponseStream } from './services/geminiService';
import { MODES } from './constants';

const messages = [
  {
    id: '1',
    role: Role.User,
    content: 'Hello',
    timestamp: new Date()
  }
];

const stream = await getAiResponseStream(messages, MODES[0]);
```

### Custom Mode Configuration

**Create Custom Mode:**
```typescript
const customMode: ModeInfo = {
  id: Mode.Professor,
  title: 'Custom Expert',
  prompt: 'You are a specialized expert in...',
  icon: <CustomIcon />,
  color: 'text-purple-500',
  temperature: 0.4,
  topP: 0.9,
  topK: 50
};

const stream = await getAiResponseStream(messages, customMode);
```

### Streaming Response Handling

**Basic Streaming:**
```typescript
const stream = await getAiResponseStream(messages, modeInfo);
let fullResponse = '';

for await (const chunk of stream) {
  fullResponse += chunk.text;
  console.log(chunk.text); // Display incrementally
}

console.log('Complete:', fullResponse);
```

**React Component Integration:**
```typescript
const [response, setResponse] = useState('');

const streamResponse = async () => {
  const stream = await getAiResponseStream(messages, mode);
  
  for await (const chunk of stream) {
    setResponse(prev => prev + chunk.text);
  }
};
```

### File Attachment Handling

**Reading File as Data URL:**
```typescript
const handleFileSelect = (file: File) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const attachment = {
      data: e.target?.result as string,
      mimeType: file.type,
      name: file.name
    };
    
    // Add to message
  };
  
  reader.readAsDataURL(file);
};
```

### Conversation Management

**Complete Example:**
```typescript
import * as storage from './services/localStorageService';

// Load conversations
const history = storage.getHistory();

// Create new conversation
const newConv: Conversation = {
  id: crypto.randomUUID(),
  title: 'New Chat',
  timestamp: new Date().toISOString(),
  messages: []
};

// Save
storage.saveHistory([...history, newConv]);

// Set active
storage.setActiveConversationId(newConv.id);
```

## Rate Limiting

### Gemini API Limits

**Free Tier (as of Dec 2024):**
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day

**Handling Rate Limits:**
```typescript
async function safeApiCall(messages: Message[], mode: ModeInfo) {
  try {
    return await getAiResponseStream(messages, mode);
  } catch (error) {
    if (error.message?.includes('rate limit')) {
      // Wait and retry
      await new Promise(r => setTimeout(r, 60000));
      return await getAiResponseStream(messages, mode);
    }
    throw error;
  }
}
```

## Environment Variables

### Required

```bash
API_KEY=your_gemini_api_key
```

### Loading in Code

```typescript
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
```

## Error Handling Best Practices

### API Errors

```typescript
try {
  const stream = await getAiResponseStream(messages, mode);
  // Process stream
} catch (error) {
  if (error.message?.includes('API_KEY')) {
    // Handle authentication error
  } else if (error.message?.includes('rate limit')) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
```

### Storage Errors

```typescript
try {
  saveHistory(conversations);
} catch (error) {
  // Storage quota exceeded
  // Clear old conversations or notify user
}
```

## TypeScript Integration

### Strict Type Checking

Enable in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Type Exports

```typescript
// Export types for external use
export type { Message, Conversation, ModeInfo };
export { Role, Mode };
```

## Performance Optimization

### Message History Optimization

```typescript
// Limit context window
const recentMessages = messages.slice(-10);
const stream = await getAiResponseStream(recentMessages, mode);
```

### Lazy Loading Conversations

```typescript
// Load conversation list without full messages
const conversationSummaries = history.map(conv => ({
  id: conv.id,
  title: conv.title,
  timestamp: conv.timestamp,
  messageCount: conv.messages.length
}));
```

## Security Considerations

### API Key Protection

- Never expose API key in client code
- Use environment variables
- Implement backend proxy for production
- Rotate keys regularly

### Input Sanitization

```typescript
const sanitizeInput = (text: string): string => {
  return text.trim().slice(0, 10000); // Limit length
};
```

### File Upload Validation

```typescript
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'text/plain',
  'application/json'
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const validateFile = (file: File): boolean => {
  return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE;
};
```
