import { Message, ModeInfo } from "../types";

interface ChatChunk {
  text: string;
}

type SerializableModeInfo = Pick<
  ModeInfo,
  "id" | "prompt" | "temperature" | "topP" | "topK" | "model"
>;

const toSerializableModeInfo = (modeInfo?: ModeInfo): SerializableModeInfo | undefined => {
  if (!modeInfo) return undefined;

  return {
    id: modeInfo.id,
    prompt: modeInfo.prompt,
    temperature: modeInfo.temperature,
    topP: modeInfo.topP,
    topK: modeInfo.topK,
    model: modeInfo.model,
  };
};

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const postGeminiChat = async (
  history: Message[],
  modeInfo?: ModeInfo,
  attempt = 0,
): Promise<string> => {
  try {
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: history,
        modeInfo: toSerializableModeInfo(modeInfo),
      }),
    });

    if (!response.ok) {
      let serverError = `Request failed with status ${response.status}`;
      try {
        const payload = (await response.json()) as { error?: string };
        if (payload.error) {
          serverError = payload.error;
        }
      } catch {
        // Ignore parse errors and return the default server error.
      }
      throw new Error(serverError);
    }

    const payload = (await response.json()) as { text?: string };
    return typeof payload.text === "string" ? payload.text : "";
  } catch (error) {
    const isNetworkFailure = error instanceof TypeError;
    if (isNetworkFailure && attempt < 2) {
      await delay(300 * (attempt + 1));
      return postGeminiChat(history, modeInfo, attempt + 1);
    }
    throw error;
  }
};

export const getAiResponseStream = async (
  history: Message[],
  modeInfo?: ModeInfo,
) => {
  const text = await postGeminiChat(history, modeInfo);

  return (async function* (): AsyncGenerator<ChatChunk> {
    yield { text };
  })();
};
