import { ApiError } from '@google/genai';
import { API_RETRY_BASE_DELAY_MS, API_RETRY_MAX_DELAY_MS } from '../constants/api';

export type AppError =
  | { kind: 'auth'; message: string; retryable: false; status?: number }
  | { kind: 'rate_limit'; message: string; retryable: true; status?: number }
  | { kind: 'server'; message: string; retryable: true; status?: number }
  | { kind: 'network'; message: string; retryable: true; status?: number }
  | { kind: 'timeout'; message: string; retryable: true; status?: number }
  | { kind: 'validation'; message: string; retryable: false; status?: number }
  | { kind: 'unknown'; message: string; retryable: true; status?: number };

const isAppError = (value: unknown): value is AppError => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    'message' in value &&
    'retryable' in value
  );
};

const isApiKeyError = (message: string): boolean => {
  const lower = message.toLowerCase();
  return lower.includes('api key') || lower.includes('apikey');
};

const isTimeoutError = (error: unknown, message: string): boolean => {
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  const lower = message.toLowerCase();
  return lower.includes('timeout') || lower.includes('timed out');
};

const isNetworkError = (error: unknown, message: string): boolean => {
  if (error instanceof TypeError && message.toLowerCase().includes('failed to fetch')) return true;
  const lower = message.toLowerCase();
  return lower.includes('network') || lower.includes('fetch');
};

/**
 * @param error - Unknown error to normalize.
 * @returns Normalized AppError object.
 */
export const toAppError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  const status =
    error instanceof ApiError
      ? error.status
      : typeof (error as { status?: number })?.status === 'number'
      ? (error as { status: number }).status
      : undefined;

  if (status === 401 || status === 403 || isApiKeyError(message)) {
    return {
      kind: 'auth',
      message: 'Authentication failed. Please check your API key and try again.',
      retryable: false,
      status,
    };
  }

  if (status === 429 || message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('congestion')) {
    return {
      kind: 'rate_limit',
      message: message || 'Rate limit reached. Please wait a moment and retry.',
      retryable: true,
      status,
    };
  }

  if (status && status >= 500) {
    return {
      kind: 'server',
      message: 'The server is having trouble right now. Please try again soon.',
      retryable: true,
      status,
    };
  }

  if (isTimeoutError(error, message)) {
    return {
      kind: 'timeout',
      message: 'The request took too long. Please try again.',
      retryable: true,
      status,
    };
  }

  if (isNetworkError(error, message)) {
    return {
      kind: 'network',
      message: 'Network issue detected. Please check your connection and retry.',
      retryable: true,
      status,
    };
  }

  if (message.toLowerCase().includes('invalid attachment') || message.toLowerCase().includes('prompt')) {
    return {
      kind: 'validation',
      message,
      retryable: false,
      status,
    };
  }

  return {
    kind: 'unknown',
    message: 'Something went wrong. Please try again.',
    retryable: true,
    status,
  };
};

/**
 * @param attempt - Retry attempt index (0-based).
 * @returns Backoff delay in milliseconds.
 */
export const getRetryDelayMs = (attempt: number): number => {
  const jitter = Math.floor(Math.random() * 200);
  const delay = API_RETRY_BASE_DELAY_MS * 2 ** attempt + jitter;
  return Math.min(delay, API_RETRY_MAX_DELAY_MS);
};

/**
 * @param ms - Milliseconds to wait.
 * @returns Promise that resolves after delay.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
