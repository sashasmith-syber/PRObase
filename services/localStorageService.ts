
import { Conversation, Message, Role } from '../types';

const HISTORY_KEY = 'ait_professor_history';
const ACTIVE_CONVO_ID_KEY = 'ait_professor_active_convo_id';

// Type guard to check if an object is a valid Message
const isMessage = (obj: any): obj is Message => {
    return obj &&
           typeof obj.id === 'string' &&
           Object.values(Role).includes(obj.role) &&
           typeof obj.content === 'string' &&
           (typeof obj.timestamp === 'string' || obj.timestamp instanceof Date);
};

// Type guard to check if an object is a valid Conversation
const isConversation = (obj: any): obj is Conversation => {
    return obj &&
           typeof obj.id === 'string' &&
           typeof obj.title === 'string' &&
           typeof obj.timestamp === 'string' &&
           Array.isArray(obj.messages) &&
           obj.messages.every(isMessage);
};


export const saveHistory = (history: Conversation[]): void => {
  try {
    const serializedHistory = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, serializedHistory);
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
};

export const getHistory = (): Conversation[] => {
  try {
    const serializedHistory = localStorage.getItem(HISTORY_KEY);
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
    console.error("Failed to retrieve history from localStorage:", error);
    return [];
  }
};

export const saveActiveConversationId = (id: string): void => {
  try {
    localStorage.setItem(ACTIVE_CONVO_ID_KEY, id);
  } catch (error) {
    console.error("Failed to save active conversation ID:", error);
  }
};

export const getActiveConversationId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_CONVO_ID_KEY);
  } catch (error) {
    console.error("Failed to get active conversation ID:", error);
    return null;
  }
};

export const clearActiveConversationId = (): void => {
  try {
    localStorage.removeItem(ACTIVE_CONVO_ID_KEY);
  } catch (error) {
    console.error("Failed to clear active conversation ID:", error);
  }
};

export const clearHistory = (): void => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear history from localStorage:", error);
    }
};
