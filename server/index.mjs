import { createServer } from 'node:http';
import { config as loadEnv } from 'dotenv';
import { GoogleGenAI } from '@google/genai';

loadEnv({ path: '.env.local' });
loadEnv();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GREY_SWAN_API_KEY = process.env.GREY_SWAN_API_KEY;
const GREY_SWAN_API_URL = process.env.GREY_SWAN_API_URL;
const PORT = Number(process.env.BFF_PORT ?? 8787);
const HOST = process.env.BFF_HOST;

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const json = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
};

const parseJsonBody = async (req) => {
  const body = await readBody(req);
  if (!body) return {};
  return JSON.parse(body);
};

const toMessages = (value) => (Array.isArray(value) ? value : []);
const toModeInfo = (value) => (value && typeof value === 'object' ? value : {});
const isAttachmentMessage = (message) => !!(message && typeof message === 'object' && message.attachment);

const normalizeAttachmentData = (dataUrlOrBase64) => {
  const maybeData = typeof dataUrlOrBase64 === 'string' ? dataUrlOrBase64.split(',')[1] : '';
  return maybeData ?? dataUrlOrBase64;
};

const base64ToUtf8 = (base64) => {
  try {
    return Buffer.from(base64, 'base64').toString('utf8');
  } catch {
    return null;
  }
};

const convertMessagesToGeminiContent = (messages) => {
  const history = [];
  const cleanMessages = messages.filter(
    (message) => !(message && message.id === 'init' && messages.length > 1)
  );

  for (const message of cleanMessages) {
    if (!message || (message.role !== 'user' && message.role !== 'model')) continue;

    const parts = [];
    let textContent = typeof message.content === 'string' ? message.content : '';

    if (isAttachmentMessage(message)) {
      const mimeType = message.attachment?.mimeType;
      const fileType = typeof mimeType === 'string' ? mimeType.split('/')[0] : '';
      const rawData = message.attachment?.data;
      const base64Data = normalizeAttachmentData(rawData);

      if ((fileType === 'image' || fileType === 'audio') && mimeType && base64Data) {
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      } else if (base64Data) {
        const decodedText = base64ToUtf8(base64Data);
        if (decodedText !== null) {
          textContent += `\n\n--- Attached File: ${message.attachment?.name || 'attachment'} ---\n\n${decodedText}`;
        } else {
          textContent += `\n\n[ERROR: Could not read attached file: ${message.attachment?.name || 'attachment'}]`;
        }
      }
    }

    if (textContent || parts.some((part) => part.inlineData)) {
      parts.unshift({ text: textContent });
    }

    if (parts.length > 0) {
      history.push({ role: message.role, parts });
    }
  }

  const mergedHistory = [];
  if (history.length > 0) {
    mergedHistory.push(structuredClone(history[0]));
    for (let i = 1; i < history.length; i += 1) {
      const last = mergedHistory[mergedHistory.length - 1];
      const current = history[i];
      if (last.role === current.role) {
        last.parts.push(...current.parts);
      } else {
        mergedHistory.push(structuredClone(current));
      }
    }
  }

  return mergedHistory;
};

const toGreySwanMessages = (input, context) => {
  const output = [];
  if (typeof context === 'string' && context.trim()) {
    output.push({ role: 'system', content: context.trim() });
  }
  if (typeof input === 'string' && input.trim()) {
    output.push({ role: 'user', content: input.trim() });
  }
  return output;
};

const handleGeminiChat = async (req, res) => {
  try {
    if (!ai) {
      return json(res, 501, {
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const payload = await parseJsonBody(req);
    const messages = toMessages(payload.messages);
    const modeInfo = toModeInfo(payload.modeInfo);
    const contents = convertMessagesToGeminiContent(messages);

    if (contents.length === 0) {
      return json(res, 200, { text: "I can't respond to that. Please send a message or an attachment." });
    }

    const systemInstruction =
      typeof modeInfo.prompt === 'string' && modeInfo.prompt.trim()
        ? modeInfo.prompt
        : 'You are a helpful AI assistant.';
    const temperature = typeof modeInfo.temperature === 'number' ? modeInfo.temperature : 0.7;
    const topP = typeof modeInfo.topP === 'number' ? modeInfo.topP : 0.95;
    const topK = typeof modeInfo.topK === 'number' ? modeInfo.topK : 64;
    const model =
      typeof modeInfo.model === 'string' && modeInfo.model.trim() ? modeInfo.model : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature,
        topP,
        topK,
      },
    });

    return json(res, 200, { text: response.text ?? '' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return json(res, 500, { error: message });
  }
};

const handleGreySwanChat = async (req, res) => {
  try {
    if (!GREY_SWAN_API_KEY || !GREY_SWAN_API_URL) {
      return json(res, 501, {
        error: 'GREY_SWAN_API_KEY or GREY_SWAN_API_URL is not configured on the server.',
      });
    }

    const payload = await parseJsonBody(req);
    const input = typeof payload.input === 'string' ? payload.input : '';
    const context = typeof payload.context === 'string' ? payload.context : '';
    const model = typeof payload.model === 'string' && payload.model.trim() ? payload.model : 'grey-swan-red-team-v1';
    const temperature = typeof payload.temperature === 'number' ? payload.temperature : 0.2;

    const messages = toGreySwanMessages(input, context);
    if (messages.length === 0) {
      return json(res, 400, { error: 'input is required.' });
    }

    const providerResponse = await fetch(`${GREY_SWAN_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GREY_SWAN_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: false,
      }),
    });

    const providerJson = await providerResponse.json();
    if (!providerResponse.ok) {
      return json(res, providerResponse.status, {
        error: providerJson?.error?.message || 'Grey Swan request failed.',
      });
    }

    const text = providerJson?.choices?.[0]?.message?.content ?? '';
    return json(res, 200, {
      text,
      provider: 'grey-swan',
      model,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return json(res, 500, { error: message });
  }
};

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    return json(res, 404, { error: 'Not found' });
  }

  if (req.method === 'POST' && req.url === '/api/gemini/chat') {
    return handleGeminiChat(req, res);
  }

  if (req.method === 'POST' && req.url === '/api/grey-swan/chat') {
    return handleGreySwanChat(req, res);
  }

  return json(res, 404, { error: 'Not found' });
});

const onListening = () => {
  const address = HOST || '0.0.0.0';
  console.log(`BFF listening on http://${address}:${PORT}`);
};

if (HOST) {
  server.listen(PORT, HOST, onListening);
} else {
  server.listen(PORT, onListening);
}
