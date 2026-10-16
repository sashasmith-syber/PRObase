
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Attachment, Mode } from '../types';
import { SendIcon } from './icons/SendIcon';
import { AttachmentIcon } from './icons/AttachmentIcon';
import { CloseIcon } from './icons/CloseIcon';
import { TextFileIcon } from './icons/TextFileIcon';
import { AudioFileIcon } from './icons/AudioFileIcon';
import { Tooltip } from './ui/Tooltip';
import { validateAttachmentDataUrl, validateFileAttachment, validatePromptInput } from '../utils/validation';
import { MAX_PROMPT_LENGTH } from '../constants/limits';
import { compressImageDataUrl } from '../utils/image';

const ModeSelector = React.lazy(() =>
  import('./ModeSelector').then((module) => ({ default: module.ModeSelector }))
);

interface PromptInputProps {
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
  activeMode: Mode;
  setActiveMode: (mode: Mode) => void;
  attachment: Attachment | null;
  setAttachment: (attachment: Attachment | null) => void;
  onUserInput?: () => void;
}

const fileToDataUrl = (
  file: File,
  mimeTypeOverride?: string,
  onProgress?: (progress: number) => void
): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        };
        reader.onloadend = () => {
            onProgress?.(100);
            resolve({
                data: reader.result as string,
                mimeType: mimeTypeOverride || file.type || 'application/octet-stream',
                name: file.name,
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * @param props - Prompt input props.
 * @returns Prompt input UI.
 */
export const PromptInput = ({
  onSendMessage,
  isLoading,
  activeMode,
  setActiveMode,
  attachment,
  setAttachment,
  onUserInput,
}: PromptInputProps): JSX.Element => {
  const [prompt, setPrompt] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Added ref for textarea

  // Effect to auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt, attachment]); // Re-run when prompt or attachment changes

  const handleSend = (): void => {
    const validation = validatePromptInput(prompt);
    if (!validation.isValid) {
      setInputError(validation.error || 'Invalid prompt.');
      return;
    }

    const sanitizedPrompt = validation.sanitized.trim();
    if (sanitizedPrompt || attachment) {
      onSendMessage(sanitizedPrompt);
      setPrompt('');
      setInputError(null);
      // Attachment is cleared in App.tsx after being added to the message list
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            setUploadProgress(0);
            const validation = validateFileAttachment(file);
            if (!validation.isValid || !validation.mimeType) {
                setInputError(validation.error || 'Unsupported file type.');
                setUploadProgress(null);
                return;
            }

            let attachmentData = await fileToDataUrl(file, validation.mimeType, setUploadProgress);
            if (validation.category === 'image') {
                const compressed = await compressImageDataUrl(attachmentData.data);
                if (compressed) {
                    attachmentData = {
                        ...attachmentData,
                        data: compressed.dataUrl,
                        mimeType: compressed.mimeType,
                    };
                }
            }

            const dataValidation = validateAttachmentDataUrl(attachmentData.data, attachmentData.mimeType);
            if (!dataValidation.isValid) {
                setInputError(dataValidation.error || 'Invalid attachment data.');
                setUploadProgress(null);
                return;
            }

            setAttachment(attachmentData);
            setInputError(null);
            onUserInput?.();
        } catch (error) {
            setInputError('Failed to read the selected file.');
        } finally {
            setUploadProgress(null);
        }
    }
    // Clear the input value so the same file can be selected again
    if (e.target) e.target.value = ''; 
  };
  
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>): Promise<void> => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.includes('image')) {
            const blob = item.getAsFile();
            if (blob) {
                e.preventDefault();
                try {
                    setUploadProgress(0);
                    const file = new File([blob], `pasted-image-${Date.now()}.${blob.type.split('/')[1] || 'png'}`, { type: blob.type });
                    const validation = validateFileAttachment(file);
                    if (!validation.isValid || !validation.mimeType) {
                        setInputError(validation.error || 'Unsupported file type.');
                        setUploadProgress(null);
                        return;
                    }

                    let attachmentData = await fileToDataUrl(file, validation.mimeType, setUploadProgress);
                    if (validation.category === 'image') {
                        const compressed = await compressImageDataUrl(attachmentData.data);
                        if (compressed) {
                            attachmentData = {
                                ...attachmentData,
                                data: compressed.dataUrl,
                                mimeType: compressed.mimeType,
                            };
                        }
                    }

                    const dataValidation = validateAttachmentDataUrl(attachmentData.data, attachmentData.mimeType);
                    if (!dataValidation.isValid) {
                        setInputError(dataValidation.error || 'Invalid attachment data.');
                        setUploadProgress(null);
                        return;
                    }

                    setAttachment(attachmentData);
                    setInputError(null);
                    onUserInput?.();
                } catch (error) {
                    setInputError('Failed to read the pasted image.');
                } finally {
                    setUploadProgress(null);
                }
                return; // Handle first image and exit
            }
        }
    }
  };

  const handleAttachClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = (): void => {
      setAttachment(null);
      setInputError(null);
  };
  
  const placeholderText = attachment
    ? `> ADD A COMMENT FOR THE FILE...`
    : `> MESSAGE IN ${activeMode.toUpperCase()} MODE... (OR PASTE AN IMAGE)`;

  const textareaAriaLabel = attachment
    ? `Enter a comment for the attached file.`
    : `Message input in ${activeMode} mode. You can also paste an image.`;

  const sendButtonAriaLabel = attachment || prompt.trim()
    ? `Send message${attachment ? ' with attached file' : ''}`
    : `Send message (disabled)`;

  const remainingChars = MAX_PROMPT_LENGTH - prompt.length;
  const showCharCount = remainingChars <= 500;

  return (
    <div className="flex flex-col items-center space-y-3">
        <Suspense fallback={<div className="h-10 w-full" />}>
            <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
        </Suspense>
        
        {attachment && (
            <div className="relative w-full max-w-md p-2 bg-hacker-dark/50 border border-electric-lime/30 rounded-none flex items-center space-x-3">
                {attachment.mimeType.startsWith('image/') ? (
                    <img src={attachment.data} alt="Preview" className="w-16 h-16 object-cover rounded-none flex-shrink-0"/>
                ) : attachment.mimeType.startsWith('audio/') ? (
                    <AudioFileIcon className="w-12 h-12 text-electric-lime/70 flex-shrink-0" />
                ) : (
                    <TextFileIcon className="w-12 h-12 text-electric-lime/70 flex-shrink-0" />
                )}
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-lime-300 truncate font-mono" title={attachment.name}>{attachment.name}</p>
                    <p className="text-xs text-lime-500">{attachment.mimeType}</p>
                </div>
                <button 
                    onClick={handleRemoveAttachment} 
                    className="absolute -top-2 -right-2 bg-gray-800 text-gray-300 rounded-full p-0.5 hover:bg-red-600 hover:text-white transition-colors z-10 focus-visible:ring-2 focus-visible:ring-red-400"
                    aria-label="Remove attachment"
                    title="Remove attachment"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        )}

        <div className="w-full flex items-end space-x-2 p-2 bg-black/50 border border-electric-lime/30 rounded-none focus-within:shadow-glow transition-shadow duration-200">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,image/webp,audio/mpeg,audio/wav,audio/ogg,text/plain,text/markdown,application/json,.txt,.md,.json"
                className="hidden"
            />
            <Tooltip label="Attach file">
                <button
                    onClick={handleAttachClick}
                    disabled={isLoading}
                    className="p-2 rounded-none text-gray-400 hover:text-electric-lime hover:bg-electric-lime/10 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors self-center min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-electric-lime"
                    aria-label="Attach file"
                >
                    <AttachmentIcon />
                </button>
            </Tooltip>
            <textarea
                ref={textareaRef} // Assign ref
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value);
                    if (inputError) setInputError(null);
                    onUserInput?.();
                }}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={placeholderText}
                className="flex-1 bg-transparent text-electric-lime placeholder-lime-700 focus:outline-none resize-none max-h-40 font-mono"
                rows={1}
                maxLength={MAX_PROMPT_LENGTH}
                disabled={isLoading}
                aria-label={textareaAriaLabel} // Dynamic aria-label
            />
            <Tooltip label={sendButtonAriaLabel}>
                <button
                    onClick={handleSend}
                    disabled={isLoading || (!prompt.trim() && !attachment)}
                    className="p-2 rounded-none bg-electric-lime text-hacker-dark hover:shadow-glow disabled:bg-gray-600 disabled:text-gray-800 disabled:cursor-not-allowed transition-all min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-electric-lime"
                    aria-label={sendButtonAriaLabel} // Dynamic aria-label
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-hacker-dark border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <SendIcon />
                    )}
                </button>
            </Tooltip>
        </div>
        {inputError && (
            <p className="w-full max-w-md text-xs text-red-400 font-mono" role="alert">
              {inputError}
            </p>
        )}
        {showCharCount && (
            <p className="w-full max-w-md text-xs text-lime-400 font-mono text-right">
              {remainingChars} characters remaining
            </p>
        )}
        {uploadProgress !== null && (
            <div className="w-full max-w-md" aria-live="polite">
              <div className="h-1 w-full bg-lime-900/40">
                <div
                  className="h-1 bg-electric-lime transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-lime-400 font-mono text-right">
                Uploading... {uploadProgress}%
              </p>
            </div>
        )}
    </div>
  );
};
