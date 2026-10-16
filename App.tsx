
import React, { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { PromptInput } from './components/PromptInput';
import { Attachment, Message, Role, Mode, ModeInfo } from './types';
import { MODES } from './constants';
import { WALLPAPERS } from './constants/wallpapers';
import { validatePromptInput, validateWallpaperUrl } from './utils/validation';
import { getPersonaRegistryEntry } from './services/protos-1-persona-registry';
import { PROTOS_1_CONFIG } from './services/initialize-protos-1';
import { useApiStream } from './hooks/useApiStream';
import { useConversation } from './hooks/useConversation';
import { useErrorHandler } from './hooks/useErrorHandler';

const HistoryPanel = React.lazy(() =>
  import('./components/HistoryPanel').then((module) => ({ default: module.HistoryPanel }))
);
const ResetConfirmationModal = React.lazy(() =>
  import('./components/ResetConfirmationModal').then((module) => ({ default: module.ResetConfirmationModal }))
);

interface RetryState {
  messages: Message[];
  modeInfo: ModeInfo;
  titleHint: string;
}

const INITIAL_MESSAGE: Message = {
    id: 'init',
    role: Role.Model,
    content: 'AIT PROfessor initialized. I am a multimodal hybrid AI, preloaded with humanity\'s entire corpus of IT knowledge. How may I assist you? Select a mode or upload an image to begin.',
    timestamp: new Date(),
};


/**
 * @returns The main application layout.
 */
const App = (): JSX.Element => {
  const [activeMode, setActiveMode] = useState<Mode>(Mode.Professor);
  const [activeWallpaper, setActiveWallpaper] = useState<number | string>(0);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [retryState, setRetryState] = useState<RetryState | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null);

  const initialMessages = useMemo<Message[]>(() => [INITIAL_MESSAGE], []);
  const {
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
  } = useConversation(initialMessages);
  const { isLoading, streamingResponse, runStream, resetStreaming } = useApiStream();
  const { error, clearError, setValidationError, setError, normalizeError } = useErrorHandler();

  const handleWallpaperSelect = useCallback((selection: number | string): void => {
    if (typeof selection === 'number' && selection >= 0 && selection < WALLPAPERS.length) {
      setActiveWallpaper(selection);
      clearError();
    } else if (typeof selection === 'string') {
        const validation = validateWallpaperUrl(selection);
        if (validation.isValid && validation.sanitizedUrl) {
            setActiveWallpaper(validation.sanitizedUrl);
            clearError();
        } else {
            setValidationError(validation.error || 'Invalid wallpaper URL.');
        }
    }
  }, [clearError, setValidationError]);

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
        const validation = validateWallpaperUrl(activeWallpaper);
        if (validation.isValid && validation.sanitizedUrl) {
            document.body.style.backgroundImage = `url('${validation.sanitizedUrl}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center center';
            document.body.style.backgroundAttachment = 'fixed';
        } else {
            const wallpaper = WALLPAPERS[0];
            Object.assign(document.body.style, wallpaper.style);
        }
    }
  }, [activeWallpaper]);

  const activeModeInfo = useMemo<ModeInfo | undefined>(() => {
    return MODES.find((mode) => mode.id === activeMode);
  }, [activeMode]);

  const activePersona = useMemo(() => {
    return getPersonaRegistryEntry(activeMode);
  }, [activeMode]);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSeconds(null);
      return;
    }

    const updateCooldown = (): void => {
      const remainingMs = Math.max(0, cooldownUntil - Date.now());
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      setCooldownSeconds(remainingSeconds);

      if (remainingMs <= 0) {
        setCooldownUntil(null);
        setCooldownSeconds(null);
        if (error?.kind === 'rate_limit') {
          clearError();
        }
      }
    };

    updateCooldown();
    const timer = window.setInterval(updateCooldown, 250);
    return () => window.clearInterval(timer);
  }, [clearError, cooldownUntil, error?.kind]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsHistoryPanelOpen(true);
      }

      if (event.key === 'Escape') {
        if (isResetModalOpen) {
          setIsResetModalOpen(false);
          return;
        }
        if (isHistoryPanelOpen) {
          setIsHistoryPanelOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHistoryPanelOpen, isResetModalOpen, setIsHistoryPanelOpen, setIsResetModalOpen]);

  const handleSendMessage = useCallback(
    async (prompt: string): Promise<void> => {
      if (cooldownUntil && Date.now() < cooldownUntil) {
        setError({
          kind: 'rate_limit',
          message: PROTOS_1_CONFIG.rateLimit.message,
          retryable: true,
        });
        return;
      }

      const promptValidation = activePersona.validation.prompt(prompt);
      if (!promptValidation.isValid) {
        setValidationError(promptValidation.error || 'Invalid prompt.');
        return;
      }

      const sanitizedPrompt = validatePromptInput(prompt).sanitized.trim();

      if (sanitizedPrompt.toUpperCase() === '/AIT_PROFESSOR_FORGET_ME') {
        setIsResetModalOpen(true);
        return;
      }

      if ((!sanitizedPrompt && !attachment) || isLoading) return;

      if (attachment) {
        const attachmentValidation = activePersona.validation.attachment(
          attachment.data,
          attachment.mimeType
        );
        if (!attachmentValidation.isValid) {
          setValidationError(attachmentValidation.error || 'Invalid attachment.');
          return;
        }
      }

      clearError();
      resetStreaming();

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: Role.User,
        content: sanitizedPrompt,
        timestamp: new Date(),
        attachment: attachment
          ? { data: attachment.data, mimeType: attachment.mimeType, name: attachment.name }
          : undefined,
      };

      const tempMessages = [...messages, userMessage];
      setMessages(tempMessages);
      setAttachment(null);

      if (!activeModeInfo) {
        setValidationError('Active mode configuration not found.');
        return;
      }

      const titleHint = sanitizedPrompt || attachment?.name || 'New Chat';
      saveConversation(activeConversationId, tempMessages, titleHint);

      try {
        const fullResponse = await runStream(tempMessages, activeModeInfo);
        const finalModelMessage: Message = {
          id: `model-${Date.now()}`,
          role: Role.Model,
          content: fullResponse.trim(),
          timestamp: new Date(),
        };

        const finalMessages = [...tempMessages, finalModelMessage];

        if (fullResponse.trim()) {
          setMessages(finalMessages);
          saveConversation(activeConversationId, finalMessages, titleHint);
          setRetryState(null);
        } else {
          setError({
            kind: 'unknown',
            message: 'No response was received. Please try again.',
            retryable: true,
          });
          setRetryState({ messages: tempMessages, modeInfo: activeModeInfo, titleHint });
        }
      } catch (error) {
        const appError = normalizeError(error);
        setError(appError);
        if (appError.kind === 'rate_limit') {
          const nextCooldown = Date.now() + PROTOS_1_CONFIG.rateLimit.retryAfter;
          setCooldownUntil((prev) => (prev && prev > nextCooldown ? prev : nextCooldown));
        }
        setRetryState({ messages: tempMessages, modeInfo: activeModeInfo, titleHint });
      } finally {
        resetStreaming();
      }
    },
    [
      activeConversationId,
      activeModeInfo,
      activePersona,
      attachment,
      clearError,
      isLoading,
      messages,
      normalizeError,
      resetStreaming,
      runStream,
      saveConversation,
      setError,
      setIsResetModalOpen,
      setValidationError,
    ]
  );

  const handleRetry = useCallback(async (): Promise<void> => {
    if (!retryState || isLoading) return;
    if (cooldownUntil && Date.now() < cooldownUntil) return;

    clearError();
    resetStreaming();

    try {
      const fullResponse = await runStream(retryState.messages, retryState.modeInfo);
      const finalModelMessage: Message = {
        id: `model-${Date.now()}`,
        role: Role.Model,
        content: fullResponse.trim(),
        timestamp: new Date(),
      };

      const finalMessages = [...retryState.messages, finalModelMessage];
      setMessages(finalMessages);
      saveConversation(activeConversationId, finalMessages, retryState.titleHint);
      setRetryState(null);
    } catch (error) {
      const appError = normalizeError(error);
      setError(appError);
      if (appError.kind === 'rate_limit') {
        const nextCooldown = Date.now() + PROTOS_1_CONFIG.rateLimit.retryAfter;
        setCooldownUntil((prev) => (prev && prev > nextCooldown ? prev : nextCooldown));
      }
    } finally {
      resetStreaming();
    }
  }, [activeConversationId, clearError, cooldownUntil, isLoading, normalizeError, resetStreaming, retryState, runStream, saveConversation, setError, setMessages]);

  const handleNewChat = useCallback((): void => {
    startNewChat();
    clearError();
    setRetryState(null);
  }, [clearError, startNewChat]);

  const handleSelectConversation = useCallback(
    (id: string): void => {
      selectConversation(id);
      clearError();
      setRetryState(null);
    },
    [clearError, selectConversation]
  );

  const handleDeleteConversation = useCallback(
    (id: string): void => {
      deleteConversation(id);
    },
    [deleteConversation]
  );

  const handleConfirmDataErasure = useCallback((): void => {
    confirmDataErasure();
    clearError();
    setRetryState(null);
  }, [clearError, confirmDataErasure]);

  const handleCancelDataErasure = useCallback((): void => {
    setIsResetModalOpen(false);
  }, [setIsResetModalOpen]);

  const handleCloseHistoryPanel = useCallback((): void => {
    setIsHistoryPanelOpen(false);
  }, [setIsHistoryPanelOpen]);

  const handleToggleHistory = useCallback((): void => {
    setIsHistoryPanelOpen((prev) => !prev);
  }, [setIsHistoryPanelOpen]);


  return (
    <div className="flex flex-col h-screen font-tech bg-hacker-dark/50 text-electric-lime">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-electric-lime focus:px-3 focus:py-2 focus:border focus:border-electric-lime"
      >
        Skip to main content
      </a>
      <Suspense fallback={null}>
        <HistoryPanel 
          isOpen={isHistoryPanelOpen}
          onClose={handleCloseHistoryPanel}
          history={history}
          activeConversationId={activeConversationId}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
          onNewChat={handleNewChat}
        />
      </Suspense>
      <Header 
        onWallpaperSelect={handleWallpaperSelect} 
        onToggleHistory={handleToggleHistory}
      />
      <main id="main-content" className="flex-1 flex flex-col">
        <ChatWindow messages={messages} isLoading={isLoading} streamingResponse={streamingResponse} />
        <div className="p-4 bg-hacker-dark/80 backdrop-blur-sm border-t-2 border-electric-lime/20">
          {error && (
            <div className="font-mono text-red-500 text-center mb-2 space-y-2" role="alert">
              <p className="animate-pulse">{error.message}</p>
              {error.kind === 'rate_limit' && cooldownSeconds !== null && (
                <p className="text-xs text-red-300">
                  Cooling down: {cooldownSeconds}s
                </p>
              )}
              {error.retryable && retryState && cooldownSeconds === null && (
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="px-3 py-1 border border-red-500/60 text-red-200 hover:text-white hover:border-red-400 transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  {isLoading ? 'Retrying...' : 'Retry'}
                </button>
              )}
            </div>
          )}
          <PromptInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            attachment={attachment}
            setAttachment={setAttachment}
            onUserInput={() => {
              if (!cooldownUntil) {
                clearError();
              }
            }}
          />
        </div>
      </main>
      <Suspense fallback={null}>
        <ResetConfirmationModal
          isOpen={isResetModalOpen}
          onConfirm={handleConfirmDataErasure}
          onCancel={handleCancelDataErasure}
        />
      </Suspense>
    </div>
  );
};

export default App;