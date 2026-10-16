
import { Conversation } from '../types';
import { isConversation } from '../utils/typeGuards';

const HISTORY_KEY = 'ait_professor_history';
const ACTIVE_CONVO_ID_KEY = 'ait_professor_active_convo_id';
const SAVE_DEBOUNCE_MS = 500;

const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__ait_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const storageAvailable = isLocalStorageAvailable();

const getStorage = (): Storage | null => {
  return storageAvailable ? window.localStorage : null;
};

let pendingHistory: Conversation[] | null = null;
let pendingActiveId: string | null | undefined = undefined;
let pendingSaveTimeout: number | null = null;

const isQuotaExceededError = (error: unknown): boolean => {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
};

const handleStorageError = (error: unknown, context: string): void => {
  if (isQuotaExceededError(error)) {
    console.warn(`Storage quota exceeded while ${context}. Data may not be saved.`);
    return;
  }
  console.error(`Failed while ${context}:`, error);
};

const flushPendingWrites = (): void => {
  const storage = getStorage();
  const historyToSave = pendingHistory;
  const activeIdToSave = pendingActiveId;

  pendingHistory = null;
  pendingActiveId = undefined;
  pendingSaveTimeout = null;

  if (!storage) {
    return;
  }

  if (historyToSave !== null) {
    try {
      const serializedHistory = JSON.stringify(historyToSave);
      storage.setItem(HISTORY_KEY, serializedHistory);
    } catch (error) {
      handleStorageError(error, 'saving history');
    }
  }

  if (activeIdToSave !== undefined) {
    try {
      if (activeIdToSave === null) {
        storage.removeItem(ACTIVE_CONVO_ID_KEY);
      } else {
        storage.setItem(ACTIVE_CONVO_ID_KEY, activeIdToSave);
      }
    } catch (error) {
      handleStorageError(error, 'saving active conversation id');
    }
  }
};

const scheduleFlush = (): void => {
  if (pendingSaveTimeout !== null) {
    window.clearTimeout(pendingSaveTimeout);
  }
  pendingSaveTimeout = window.setTimeout(flushPendingWrites, SAVE_DEBOUNCE_MS);
};

const sanitizeHistory = (history: Conversation[]): Conversation[] => {
  return history.filter(isConversation);
};


/**
 * @param history - Conversation history to store.
 * @returns void
 */
export const saveHistory = (history: Conversation[]): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    const serializedHistory = JSON.stringify(sanitizeHistory(history));
    storage.setItem(HISTORY_KEY, serializedHistory);
  } catch (error) {
    handleStorageError(error, 'saving history');
  }
};

/**
 * @param history - Conversation history to store.
 * @returns void
 */
export const saveHistoryDebounced = (history: Conversation[]): void => {
  pendingHistory = sanitizeHistory(history);
  scheduleFlush();
};

/**
 * @returns Stored conversation history or empty array.
 */
export const getHistory = (): Conversation[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const serializedHistory = storage.getItem(HISTORY_KEY);
    if (serializedHistory === null) {
      return [];
    }
    const parsed = JSON.parse(serializedHistory);
    
    if (Array.isArray(parsed)) {
      // Filter and map to ensure data integrity and convert date strings to Date objects
      return parsed.filter(isConversation).map(convo => ({
        ...convo,
        messages: convo.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    }
    return [];
  } catch (error) {
    handleStorageError(error, 'retrieving history');
    return [];
  }
};

/**
 * @param id - Active conversation ID to store.
 * @returns void
 */
export const saveActiveConversationId = (id: string): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(ACTIVE_CONVO_ID_KEY, id);
  } catch (error) {
    handleStorageError(error, 'saving active conversation id');
  }
};

/**
 * @param id - Active conversation ID to store, or null to clear.
 * @returns void
 */
export const saveActiveConversationIdDebounced = (id: string | null): void => {
  pendingActiveId = id;
  scheduleFlush();
};

/**
 * @returns Stored active conversation ID or null.
 */
export const getActiveConversationId = (): string | null => {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(ACTIVE_CONVO_ID_KEY);
  } catch (error) {
    handleStorageError(error, 'retrieving active conversation id');
    return null;
  }
};

/**
 * @returns void
 */
export const clearActiveConversationId = (): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(ACTIVE_CONVO_ID_KEY);
  } catch (error) {
    handleStorageError(error, 'clearing active conversation id');
  }
};

/**
 * @returns void
 */
export const clearHistory = (): void => {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.removeItem(HISTORY_KEY);
    } catch (error) {
      handleStorageError(error, 'clearing history');
    }
};
