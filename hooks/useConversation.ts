import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Conversation, Message } from '../types';
import { useLocalStorage } from './useLocalStorage';

/**
 * @param initialMessages - Initial messages to seed new conversations.
 * @returns Conversation state and helpers.
 */
export const useConversation = (
  initialMessages: Message[]
): {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  history: Conversation[];
  activeConversationId: string | null;
  isHistoryPanelOpen: boolean;
  setIsHistoryPanelOpen: Dispatch<SetStateAction<boolean>>;
  isResetModalOpen: boolean;
  setIsResetModalOpen: Dispatch<SetStateAction<boolean>>;
  saveConversation: (convoId: string | null, updatedMessages: Message[], titleHint: string) => string;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  confirmDataErasure: () => void;
} => {
  const {
    getHistory,
    saveHistory,
    getActiveConversationId,
    saveActiveConversationId,
    clearActiveConversationId,
    clearHistory,
  } = useLocalStorage();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadedHistory = getHistory();
    const loadedActiveId = getActiveConversationId();
    setHistory(loadedHistory);

    if (loadedActiveId) {
      const activeConvo = loadedHistory.find((convo) => convo.id === loadedActiveId);
      if (activeConvo) {
        setMessages(activeConvo.messages);
        setActiveConversationId(activeConvo.id);
      } else {
        clearActiveConversationId();
      }
    }
  }, [getActiveConversationId, getHistory, clearActiveConversationId]);

  const saveConversation = useCallback(
    (convoId: string | null, updatedMessages: Message[], titleHint: string): string => {
      let newHistory: Conversation[];
      let conversationId = convoId;

      if (conversationId) {
        newHistory = history.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, messages: updatedMessages, timestamp: new Date().toISOString() }
            : conversation
        );
      } else {
        conversationId = `convo-${Date.now()}`;
        const newConvo: Conversation = {
          id: conversationId,
          title: (titleHint.trim() || 'File Query').substring(0, 40) + '...',
          timestamp: new Date().toISOString(),
          messages: updatedMessages,
        };
        newHistory = [newConvo, ...history];
        setActiveConversationId(conversationId);
        saveActiveConversationId(conversationId);
      }

      setHistory(newHistory);
      saveHistory(newHistory);
      return conversationId;
    },
    [history, saveHistory, saveActiveConversationId]
  );

  const startNewChat = useCallback((): void => {
    setActiveConversationId(null);
    clearActiveConversationId();
    setMessages(initialMessages);
    setIsHistoryPanelOpen(false);
  }, [clearActiveConversationId, initialMessages]);

  const selectConversation = useCallback(
    (id: string): void => {
      const selectedConvo = history.find((convo) => convo.id === id);
      if (selectedConvo) {
        setMessages(selectedConvo.messages);
        setActiveConversationId(id);
        saveActiveConversationId(id);
        setIsHistoryPanelOpen(false);
      }
    },
    [history, saveActiveConversationId]
  );

  const deleteConversation = useCallback(
    (id: string): void => {
      const newHistory = history.filter((convo) => convo.id !== id);
      setHistory(newHistory);
      saveHistory(newHistory);
      if (activeConversationId === id) {
        startNewChat();
      }
    },
    [history, activeConversationId, saveHistory, startNewChat]
  );

  const confirmDataErasure = useCallback((): void => {
    clearHistory();
    clearActiveConversationId();
    setHistory([]);
    setMessages(initialMessages);
    setActiveConversationId(null);
    setIsResetModalOpen(false);
  }, [clearActiveConversationId, clearHistory, initialMessages]);

  return {
    messages,
    setMessages,
    history,
    activeConversationId,
    isHistoryPanelOpen,
    setIsHistoryPanelOpen,
    isResetModalOpen,
    setIsResetModalOpen,
    saveConversation,
    startNewChat,
    selectConversation,
    deleteConversation,
    confirmDataErasure,
  };
};
