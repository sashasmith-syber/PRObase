import { GoogleGenAI, Content } from "@google/genai";
import { Message, Role, ModeInfo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
  

export const getAiResponseStream = async (
  history: Message[],
  modeInfo?: ModeInfo
) => {
  const contents = await convertMessagesToContent(history);

  // If there are no valid contents to send, return a user-friendly message.
  if (contents.length === 0) {
      return (async function* () {
        yield { text: "I can't respond to that. Please send a message or an attachment." };
      })();
  }
  
  const systemInstruction = modeInfo?.prompt ?? 'You are a helpful AI assistant.';
  const temperature = modeInfo?.temperature ?? 0.7;
  const topP = modeInfo?.topP ?? 0.95;
  const topK = modeInfo?.topK ?? 64;
  const model = modeInfo?.model ?? 'gemini-2.5-flash'; // Use mode-specific model or default to flash

  const response = await ai.models.generateContentStream({
    model: model, // Use the dynamically selected model
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      temperature: temperature,
      topP: topP,
      topK: topK,
    },
  });

  return response;
};