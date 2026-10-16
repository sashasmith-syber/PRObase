import { useCallback } from 'react';
import { Conversation } from '../types';
import * as historyService from '../services/localStorageService';

/**
 * @returns Local storage helpers for conversations.
 */
export const useLocalStorage = (): {
  getHistory: () => Conversation[];
  saveHistory: (history: Conversation[]) => void;
  clearHistory: () => void;
  getActiveConversationId: () => string | null;
  saveActiveConversationId: (id: string) => void;
  clearActiveConversationId: () => void;
} => {
  const getHistory = useCallback((): Conversation[] => historyService.getHistory(), []);
  const saveHistory = useCallback((history: Conversation[]): void => historyService.saveHistoryDebounced(history), []);
  const clearHistory = useCallback((): void => historyService.clearHistory(), []);
  const getActiveConversationId = useCallback((): string | null => historyService.getActiveConversationId(), []);
  const saveActiveConversationId = useCallback((id: string): void => historyService.saveActiveConversationIdDebounced(id), []);
  const clearActiveConversationId = useCallback((): void => historyService.clearActiveConversationId(), []);

  return {
    getHistory,
    saveHistory,
    clearHistory,
    getActiveConversationId,
    saveActiveConversationId,
    clearActiveConversationId,
  };
};
