import { useCallback, useState } from 'react';
import { AppError, toAppError } from '../utils/errorHandler';
import { recordErrorMetric } from '../utils/performance';

/**
 * @returns Error state helpers for the UI.
 */
export const useErrorHandler = (): {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  setValidationError: (message: string) => void;
  normalizeError: (error: unknown) => AppError;
} => {
  const [error, setError] = useState<AppError | null>(null);

  const setErrorState = useCallback((nextError: AppError | null): void => {
    if (nextError) {
      recordErrorMetric(nextError.message);
    }
    setError(nextError);
  }, []);

  const clearError = useCallback((): void => {
    setErrorState(null);
  }, [setErrorState]);

  const setValidationError = useCallback((message: string): void => {
    setErrorState({ kind: 'validation', message, retryable: false });
  }, [setErrorState]);

  const normalizeError = useCallback((err: unknown): AppError => {
    return toAppError(err);
  }, []);

  return {
    error,
    setError: setErrorState,
    clearError,
    setValidationError,
    normalizeError,
  };
};
