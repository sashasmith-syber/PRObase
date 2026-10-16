const jsonResponse = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const parseJsonBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const toMessages = (value) => (Array.isArray(value) ? value : []);
const toModeInfo = (value) => (value && typeof value === "object" ? value : {});
const isAttachmentMessage = (message) => !!(message && typeof message === "object" && message.attachment);

const normalizeAttachmentData = (dataUrlOrBase64) => {
  if (typeof dataUrlOrBase64 !== "string") {
    return "";
  }
  const splitData = dataUrlOrBase64.split(",");
  return splitData[1] ?? dataUrlOrBase64;
};

const base64ToUtf8 = (base64) => {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
};

const convertMessagesToGeminiContent = (messages) => {
  const history = [];
  const cleanMessages = messages.filter(
    (message) => !(message && message.id === "init" && messages.length > 1),
  );

  for (const message of cleanMessages) {
    if (!message || (message.role !== "user" && message.role !== "model")) continue;

    const parts = [];
    let textContent = typeof message.content === "string" ? message.content : "";

    if (isAttachmentMessage(message)) {
      const mimeType = message.attachment?.mimeType;
      const fileType = typeof mimeType === "string" ? mimeType.split("/")[0] : "";
      const rawData = message.attachment?.data;
      const base64Data = normalizeAttachmentData(rawData);

      if ((fileType === "image" || fileType === "audio") && mimeType && base64Data) {
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      } else if (base64Data) {
        const decodedText = base64ToUtf8(base64Data);
        if (decodedText !== null) {
          textContent += `\n\n--- Attached File: ${message.attachment?.name || "attachment"} ---\n\n${decodedText}`;
        } else {
          textContent += `\n\n[ERROR: Could not read attached file: ${message.attachment?.name || "attachment"}]`;
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

const handleGeminiChat = async (request, env) => {
  if (!env.GEMINI_API_KEY) {
    return jsonResponse(501, {
      error: "GEMINI_API_KEY is not configured on the server.",
    });
  }

  const payload = await parseJsonBody(request);
  const messages = toMessages(payload.messages);
  const modeInfo = toModeInfo(payload.modeInfo);
  const contents = convertMessagesToGeminiContent(messages);

  if (contents.length === 0) {
    return jsonResponse(200, { text: "I can't respond to that. Please send a message or an attachment." });
  }

  const systemInstruction =
    typeof modeInfo.prompt === "string" && modeInfo.prompt.trim()
      ? modeInfo.prompt
      : "You are a helpful AI assistant.";
  const temperature = typeof modeInfo.temperature === "number" ? modeInfo.temperature : 0.7;
  const topP = typeof modeInfo.topP === "number" ? modeInfo.topP : 0.95;
  const topK = typeof modeInfo.topK === "number" ? modeInfo.topK : 64;
  const model =
    typeof modeInfo.model === "string" && modeInfo.model.trim() ? modeInfo.model : "gemini-2.5-flash";

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

  const providerResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature,
        topP,
        topK,
      },
    }),
  });

  const providerJson = await providerResponse.json();
  if (!providerResponse.ok) {
    return jsonResponse(providerResponse.status, {
      error: providerJson?.error?.message || "Gemini request failed.",
    });
  }

  const text =
    providerJson?.candidates?.[0]?.content?.parts
      ?.map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("") ?? "";

  return jsonResponse(200, { text });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/gemini/chat") {
      return handleGeminiChat(request, env);
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return jsonResponse(200, { status: "ok" });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
