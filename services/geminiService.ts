import { Content } from "@google/genai";
import { Message, ModeInfo } from '../types';

const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';

const base64ToUtf8 = (base64: string): string | null => {
    try {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    } catch (e) {
        console.error("Failed to decode base64 string:", e);
        // It might not be a text file, so we can ignore this error for now
        // and let the caller handle the null response.
        return null;
    }
}


const convertMessagesToContent = async (messages: Message[]): Promise<Content[]> => {
    const history: Content[] = [];
    // Filter out temporary model messages or initial messages without user interaction
    const cleanMessages = messages.filter(m => !(m.id === 'init' && messages.length > 1));
  
    for (const message of cleanMessages) {
      const role = message.role;
      const parts: any[] = []; 
  
      let textContent = message.content || '';

      if (message.attachment) {
        const mimeType = message.attachment.mimeType;
        const fileType = mimeType.split('/')[0];
        const base64Data = message.attachment.data.split(',')[1];
        
        if (fileType === 'image' || fileType === 'audio') {
            parts.push({
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            });
        } else { // Assume text-based for others
            const decodedText = base64ToUtf8(base64Data);
            if (decodedText !== null) {
                textContent += `\n\n--- Attached File: ${message.attachment.name} ---\n\n${decodedText}`;
            } else {
                textContent += `\n\n[ERROR: Could not read attached file: ${message.attachment.name}]`;
            }
        }
      }

      // Add text content if it exists or is required for multimodal
      if (textContent || parts.some(p => 'inlineData' in p)) {
        parts.unshift({ text: textContent }); // Add text part first
      }
  
      if (parts.length > 0) {
        history.push({ role, parts });
      }
    }
  
    // Merge consecutive messages of the same role for API optimization
    const mergedHistory: Content[] = [];
    if (history.length > 0) {
      mergedHistory.push(JSON.parse(JSON.stringify(history[0])));
      for (let i = 1; i < history.length; i++) {
        const last = mergedHistory[mergedHistory.length - 1];
        const current = history[i];
        if (last.role === current.role) {
          last.parts.push(...current.parts);
        } else {
          mergedHistory.push(JSON.parse(JSON.stringify(current)));
        }
      }
    }
  
    return mergedHistory;
  };
  

export const getAiResponseStream = async function* (
  history: Message[],
  modeInfo?: ModeInfo
): AsyncGenerator<{ text: string }> {
  const contents = await convertMessagesToContent(history);

  // If there are no valid contents to send, return a user-friendly message.
  if (contents.length === 0) {
    yield { text: "I can't respond to that. Please send a message or an attachment." };
    return;
  }

  const model = modeInfo?.model ?? 'gemini-2.5-flash';
  const requestBody = {
    model,
    contents,
    generationConfig: {
      temperature: modeInfo?.temperature ?? 0.6,
      topK: modeInfo?.topK ?? 64,
      topP: modeInfo?.topP ?? 0.95,
    },
    ...(modeInfo?.prompt
      ? { systemInstruction: { parts: [{ text: modeInfo.prompt }] } }
      : {}),
  };

  const customerId = localStorage.getItem('stripe_customer_id');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (customerId) headers['Authorization'] = `Bearer ${customerId}`;

  const resp = await fetch(`${WORKER_URL}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });

  if (resp.status === 402) {
    throw new Error('SUBSCRIPTION_REQUIRED');
  }

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Worker error ${resp.status}: ${errText}`);
  }

  if (!resp.body) {
    throw new Error('No response body from worker.');
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    // Keep the last (potentially incomplete) line in the buffer
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const dataStr = line.slice(6).trim();
      if (dataStr === '[DONE]' || dataStr === '') continue;
      try {
        const parsed = JSON.parse(dataStr) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield { text };
      } catch {
        // Ignore malformed SSE chunks
      }
    }
  }

  // Flush remaining buffer
  if (buffer.startsWith('data: ')) {
    const dataStr = buffer.slice(6).trim();
    if (dataStr && dataStr !== '[DONE]') {
      try {
        const parsed = JSON.parse(dataStr) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield { text };
      } catch {
        // Ignore
      }
    }
  }
};