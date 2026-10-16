import { GoogleGenAI } from "@google/genai";
import type { Content, GenerateContentResponse, Part } from "@google/genai";
import { Message, Mode, ModeInfo } from '../types';
import { API_TIMEOUT_MS } from '../constants/api';
import { sanitizeTextInput } from '../utils/validation';
import { getPersonaRegistryEntry } from './protos-1-persona-registry';
import { PROTOS_1_CONFIG } from './initialize-protos-1';

let cachedAi: GoogleGenAI | null = null;
const lastRequestByPersona = new Map<Mode, number>();

/**
 * @returns API key from environment or throws if missing.
 */
export const getApiKey = (): string => {
    const envKey = (import.meta.env['API_KEY'] || import.meta.env['GEMINI_API_KEY'] || '').trim();
    const processKey =
      typeof process !== 'undefined'
        ? (process.env.API_KEY || process.env.GEMINI_API_KEY || '').trim()
        : '';
    const apiKey = envKey || processKey;
    if (!apiKey) {
        throw new Error('Missing API key. Set API_KEY or GEMINI_API_KEY in your environment.');
    }
    return apiKey;
};

const getAiClient = (timeoutMs: number): GoogleGenAI => {
    if (!cachedAi) {
        cachedAi = new GoogleGenAI({ apiKey: getApiKey(), httpOptions: { timeout: timeoutMs } });
    }
    return cachedAi;
};

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
      const parts: Part[] = []; 
  
      let textContent = sanitizeTextInput(message.content || '');

      if (message.attachment) {
        const base64Data = message.attachment.data.split(',')[1];
        if (!base64Data) {
          throw new Error('Invalid attachment data.');
        }
        const mimeType = message.attachment.mimeType;
        const category = mimeType.split('/')[0];

        if (category === 'image' || category === 'audio') {
            parts.push({
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            });
        } else { // Text-based attachments
            const decodedText = base64ToUtf8(base64Data);
            if (decodedText !== null) {
                textContent += `\n\n--- Attached File: ${message.attachment.name} ---\n\n${decodedText}`;
            } else {
                textContent += `\n\n[ERROR: Could not read attached file: ${message.attachment.name}]`;
            }
        }
      }

      // Add text content if it exists or is required for multimodal
      if (textContent || parts.some((part) => 'inlineData' in part)) {
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
  

/**
 * @param history - Message history to send.
 * @param modeInfo - Optional mode configuration.
 * @returns Streaming response generator.
 */
export const getAiResponseStream = async (
  history: Message[],
  modeInfo?: ModeInfo
): Promise<AsyncGenerator<GenerateContentResponse>> => {
  const personaId = modeInfo?.id ?? Mode.Professor;
  const personaEntry = getPersonaRegistryEntry(personaId);
  const guardRails = personaEntry.guardRails;

  const lastRequestAt = lastRequestByPersona.get(personaId) ?? 0;
  if (Date.now() - lastRequestAt < guardRails.minRequestIntervalMs) {
    throw new Error(PROTOS_1_CONFIG.rateLimit.message);
  }
  lastRequestByPersona.set(personaId, Date.now());

  for (const message of history) {
    const promptValidation = personaEntry.validation.prompt(message.content || '');
    if (!promptValidation.isValid) {
      throw new Error(promptValidation.error || 'Invalid prompt.');
    }

    if (message.attachment) {
      const attachmentValidation = personaEntry.validation.attachment(
        message.attachment.data,
        message.attachment.mimeType
      );
      if (!attachmentValidation.isValid) {
        throw new Error(attachmentValidation.error || 'Invalid attachment.');
      }
    }
  }

  const contents = await convertMessagesToContent(history);

  // If there are no valid contents to send, return a user-friendly message.
  if (contents.length === 0) {
      return (async function* () {
        yield { text: "I can't respond to that. Please send a message or an attachment." };
      })();
  }
  
  const groundingPointers = personaEntry.groundedCognition.sanctuaryPointers
    .map((pointer) => `${pointer.path} (${pointer.description})`)
    .join(', ');
  const systemInstruction = `${modeInfo?.prompt ?? 'You are a helpful AI assistant.'}\n\nGround your responses in Local Sanctuary pointers: ${groundingPointers}. If unsure, say so.`;
  const temperature = modeInfo?.temperature ?? 0.7;
  const topP = modeInfo?.topP ?? 0.95;
  const topK = modeInfo?.topK ?? 64;
  const model = modeInfo?.model ?? personaEntry.apiSchema.modelPreference;

  const requestPayload = {
    model,
    contents,
    config: {
      systemInstruction,
      temperature,
      topP,
      topK,
    },
  };

  if (personaEntry.apiSchema.enforceFlashSchema) {
    const schemaValidation = personaEntry.apiSchema.validateRequest(requestPayload);
    if (!schemaValidation.isValid) {
      throw new Error(schemaValidation.error || 'Invalid Gemini request schema.');
    }
  }

  const response = await getAiClient(guardRails.timeoutMs).models.generateContentStream(requestPayload);

  const validatedStream = async function* (): AsyncGenerator<GenerateContentResponse> {
    for await (const chunk of response) {
      const responseValidation = personaEntry.apiSchema.validateResponse(chunk);
      if (!responseValidation.isValid) {
        throw new Error(responseValidation.error || 'Invalid Gemini response schema.');
      }
      yield chunk;
    }
  };

  return validatedStream();
};