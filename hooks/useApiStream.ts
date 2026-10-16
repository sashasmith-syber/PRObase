import { useCallback, useEffect, useRef, useState } from 'react';
import { API_MAX_RETRIES } from '../constants/api';
import { getAiResponseStream } from '../services/geminiService';
import { AppError, getRetryDelayMs, sleep, toAppError } from '../utils/errorHandler';
import { Message, ModeInfo, AiStreamChunk } from '../types';
import { recordApiTiming } from '../utils/performance';

/**
 * @returns Streaming state and request runner for Gemini responses.
 */
export const useApiStream = (): {
  isLoading: boolean;
  streamingResponse: string;
  runStream: (messages: Message[], modeInfo: ModeInfo) => Promise<string>;
  resetStreaming: () => void;
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const streamingBufferRef = useRef<string>('');
  const streamingRafRef = useRef<number | null>(null);

  const resetStreaming = useCallback((): void => {
    if (streamingRafRef.current !== null) {
      cancelAnimationFrame(streamingRafRef.current);
      streamingRafRef.current = null;
    }
    streamingBufferRef.current = '';
    setStreamingResponse('');
  }, []);

  const scheduleStreamingUpdate = useCallback((): void => {
    if (streamingRafRef.current !== null) return;
    streamingRafRef.current = requestAnimationFrame(() => {
      setStreamingResponse(streamingBufferRef.current);
      streamingRafRef.current = null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (streamingRafRef.current !== null) {
        cancelAnimationFrame(streamingRafRef.current);
      }
    };
  }, []);

  const runStream = useCallback(
    async (messages: Message[], modeInfo: ModeInfo): Promise<string> => {
      setIsLoading(true);
      let lastError: AppError | null = null;

      try {
        for (let attempt = 0; attempt < API_MAX_RETRIES; attempt += 1) {
          let fullResponse = '';
          resetStreaming();

          const startTime = performance.now();
          try {
            const stream = await getAiResponseStream(messages, modeInfo);
            for await (const chunk of stream) {
              const chunkText =
                typeof (chunk as AiStreamChunk).text === 'string' ? (chunk as AiStreamChunk).text : '';
              if (!chunkText) continue;
              fullResponse += chunkText;
              streamingBufferRef.current = fullResponse;
              scheduleStreamingUpdate();
            }

            if (streamingRafRef.current !== null) {
              cancelAnimationFrame(streamingRafRef.current);
              streamingRafRef.current = null;
            }
            setStreamingResponse(fullResponse);
            recordApiTiming(performance.now() - startTime, true);

            return fullResponse;
          } catch (error) {
            recordApiTiming(performance.now() - startTime, false);
            const appError = toAppError(error);
            lastError = appError;

            if (!appError.retryable || attempt >= API_MAX_RETRIES - 1 || fullResponse) {
              throw appError;
            }

            await sleep(getRetryDelayMs(attempt));
          }
        }
      } finally {
        setIsLoading(false);
      }

      throw lastError || {
        kind: 'unknown',
        message: 'Something went wrong. Please try again.',
        retryable: true,
      };
    },
    [resetStreaming, scheduleStreamingUpdate]
  );

  return {
    isLoading,
    streamingResponse,
    runStream,
    resetStreaming,
  };
};
