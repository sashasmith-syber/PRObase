
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
const PromptInput = lazy(async () => {
  const module = await import('./components/PromptInput');
  return { default: module.PromptInput };
});
const HistoryPanel = lazy(async () => {
  const module = await import('./components/HistoryPanel');
  return { default: module.HistoryPanel };
});
import { ResetConfirmationModal } from './components/ResetConfirmationModal';
import { Message, Role, Mode, Conversation } from './types';
import { MODES } from './constants';
import { WALLPAPERS } from './constants/wallpapers';
import * as historyService from './services/localStorageService';

interface Attachment {
  dataUrl: string;
  mimeType: string;
  name: string;
}

const INITIAL_MESSAGE: Message = {
    id: 'init',
    role: Role.Model,
    content: 'AIT PROfessor initialized. I am a multimodal hybrid AI, preloaded with humanity\'s entire corpus of IT knowledge. How may I assist you? Select a mode or upload an image to begin.',
    timestamp: new Date(),
};


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [activeMode, setActiveMode] = useState<Mode>(Mode.Professor);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeWallpaper, setActiveWallpaper] = useState<number | string>(0);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  
  // History State
  const [history, setHistory] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);


  // Load history from localStorage on initial render
  useEffect(() => {
    const loadedHistory = historyService.getHistory();
    const loadedActiveId = historyService.getActiveConversationId();
    setHistory(loadedHistory);
    
    if (loadedActiveId) {
      const activeConvo = loadedHistory.find(c => c.id === loadedActiveId);
      if (activeConvo) {
        setMessages(activeConvo.messages);
        setActiveConversationId(activeConvo.id);
      } else {
        // Active ID exists but convo not found, clear it
        historyService.clearActiveConversationId();
      }
    }
  }, []);

  const handleWallpaperSelect = useCallback((selection: number | string) => {
    if (typeof selection === 'number' && selection >= 0 && selection < WALLPAPERS.length) {
      setActiveWallpaper(selection);
    } else if (typeof selection === 'string' && selection.trim() !== '') {
        setActiveWallpaper(selection);
    }
  }, []);

  useEffect(() => {
    // Reset body style to a known state before applying new styles
    document.body.style.background = '';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundColor = '#040504';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundAttachment = '';
    
    // Always keep the text color
    document.body.style.color = '#39ff14';

    if (typeof activeWallpaper === 'number') {
      const wallpaper = WALLPAPERS[activeWallpaper];
      if (wallpaper && wallpaper.style) {
        Object.assign(document.body.style, wallpaper.style);
      }
    } else if (typeof activeWallpaper === 'string') {
        try {
            // A simple check to ensure it's a plausible URL
            const url = new URL(activeWallpaper);
            if (['http:', 'https:'].includes(url.protocol)) {
                document.body.style.backgroundImage = `url('${url.href}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center center';
                document.body.style.backgroundAttachment = 'fixed';
            }
        } catch (e) {
            console.error("Invalid wallpaper URL provided:", activeWallpaper);
            // Fallback to default if URL is invalid
            const wallpaper = WALLPAPERS[0];
            Object.assign(document.body.style, wallpaper.style);
        }
    }
  }, [activeWallpaper]);

  const saveConversation = (convoId: string | null, updatedMessages: Message[], promptForTitle: string): string => {
      let newHistory: Conversation[];
      let conversationId = convoId;

      if (conversationId) { // Existing conversation
          newHistory = history.map(c => 
              c.id === conversationId 
              ? { ...c, messages: updatedMessages, timestamp: new Date().toISOString() } 
              : c
          );
      } else { // New conversation
          conversationId = `convo-${Date.now()}`;
          const newConvo: Conversation = {
              id: conversationId,
              title: (promptForTitle.trim() || "File Query").substring(0, 40) + '...',
              timestamp: new Date().toISOString(),
              messages: updatedMessages
          };
          newHistory = [newConvo, ...history];
          setActiveConversationId(conversationId);
          historyService.saveActiveConversationId(conversationId);
      }
      
      setHistory(newHistory);
      historyService.saveHistory(newHistory);
      return conversationId;
  };

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (prompt.trim().toUpperCase() === '/AIT_PROFESSOR_FORGET_ME') {
        setIsResetModalOpen(true);
        return;
    }

    if ((!prompt.trim() && !attachment) || isLoading) return;

    setIsLoading(true);
    setError(null);
    setStreamingResponse('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: Role.User,
      content: prompt,
      timestamp: new Date(),
      attachment: attachment ? { data: attachment.dataUrl, mimeType: attachment.mimeType, name: attachment.name } : undefined,
    };
    
    // Optimistically update UI
    const tempMessages = [...messages, userMessage];
    setMessages(tempMessages);
    setAttachment(null);

    try {
      const modeInfo = MODES.find(m => m.id === activeMode);
      if (!modeInfo) {
        setError("// SYSTEM_ERROR: Active mode configuration not found.");
        setIsLoading(false);
        return;
      }
      
      const { getAiResponseStream } = await import('./services/geminiService');
      const stream = await getAiResponseStream(tempMessages, modeInfo);

      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = typeof chunk?.text === 'string' ? chunk.text : '';
        fullResponse += chunkText;
        setStreamingResponse(fullResponse);
      }
      
      const finalModelMessage: Message = {
        id: `model-${Date.now()}`,
        role: Role.Model,
        content: fullResponse.trim(),
        timestamp: new Date(),
      };
      
      const finalMessages = [...tempMessages, finalModelMessage];

      if (fullResponse.trim()) {
        setMessages(finalMessages);
        const newConvoId = saveConversation(activeConversationId, finalMessages, prompt || attachment?.name || "New Chat");
        if (!activeConversationId) {
          setActiveConversationId(newConvoId);
        }
      } else {
        // If response is empty, roll back the user message from state
        setMessages(messages);
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(`// SYSTEM_ERROR: ${errorMessage}`);
       // Roll back the user message on error
      setMessages(messages);
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  }, [isLoading, activeMode, messages, attachment, history, activeConversationId]);

  const handleNewChat = () => {
    setActiveConversationId(null);
    historyService.clearActiveConversationId();
    setMessages([INITIAL_MESSAGE]);
    setIsHistoryPanelOpen(false);
    setError(null);
  };

  const handleSelectConversation = (id: string) => {
    const selectedConvo = history.find(c => c.id === id);
    if (selectedConvo) {
      setMessages(selectedConvo.messages);
      setActiveConversationId(id);
      historyService.saveActiveConversationId(id);
      setIsHistoryPanelOpen(false);
      setError(null);
    }
  };

  const handleDeleteConversation = (id: string) => {
    const newHistory = history.filter(c => c.id !== id);
    setHistory(newHistory);
    historyService.saveHistory(newHistory);
    if (activeConversationId === id) {
      handleNewChat();
    }
  };

  const handleConfirmDataErasure = () => {
    historyService.clearHistory();
    historyService.clearActiveConversationId();

    setHistory([]);
    setMessages([INITIAL_MESSAGE]);
    setActiveConversationId(null);
    setError(null);
    
    setIsResetModalOpen(false);
  };

  const handleCancelDataErasure = () => {
      setIsResetModalOpen(false);
  };


  return (
    <div className="flex flex-col h-screen font-tech bg-hacker-dark/50 text-electric-lime">
      <Suspense fallback={null}>
        <HistoryPanel 
          isOpen={isHistoryPanelOpen}
          onClose={() => setIsHistoryPanelOpen(false)}
          history={history}
          activeConversationId={activeConversationId}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
          onNewChat={handleNewChat}
        />
      </Suspense>
      <Header 
        onWallpaperSelect={handleWallpaperSelect} 
        onToggleHistory={() => setIsHistoryPanelOpen(p => !p)}
      />
      <ChatWindow messages={messages} isLoading={isLoading} streamingResponse={streamingResponse} />
      <div className="p-4 bg-hacker-dark/80 backdrop-blur-sm border-t-2 border-electric-lime/20">
        {error && <div className="font-mono text-red-500 text-center mb-2 animate-pulse">{error}</div>}
        <Suspense fallback={<div className="font-mono text-lime-700 text-sm">LOADING INPUT...</div>}>
          <PromptInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            attachment={attachment}
            setAttachment={setAttachment}
          />
        </Suspense>
      </div>
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onConfirm={handleConfirmDataErasure}
        onCancel={handleCancelDataErasure}
      />
    </div>
  );
};

export default App;