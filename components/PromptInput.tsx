
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mode } from '../types';
import { ModeSelector } from './ModeSelector';
import { SendIcon } from './icons/SendIcon';
import { AttachmentIcon } from './icons/AttachmentIcon';
import { CloseIcon } from './icons/CloseIcon';
import { TextFileIcon } from './icons/TextFileIcon';
import { AudioFileIcon } from './icons/AudioFileIcon';

interface Attachment {
  dataUrl: string;
  mimeType: string;
  name: string;
}

interface PromptInputProps {
  onSendMessage: (prompt: string) => void;
  isLoading: boolean;
  activeMode: Mode;
  setActiveMode: (mode: Mode) => void;
  attachment: Attachment | null;
  setAttachment: (attachment: Attachment | null) => void;
}

const fileToDataUrl = (file: File): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve({
                dataUrl: reader.result as string,
                mimeType: file.type || 'application/octet-stream',
                name: file.name,
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const PromptInput: React.FC<PromptInputProps> = ({
  onSendMessage,
  isLoading,
  activeMode,
  setActiveMode,
  attachment,
  setAttachment,
}) => {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Added ref for textarea

  // Effect to auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt, attachment]); // Re-run when prompt or attachment changes

  const handleSend = () => {
    if (prompt.trim() || attachment) {
      onSendMessage(prompt.trim());
      setPrompt('');
      // Attachment is cleared in App.tsx after being added to the message list
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const attachmentData = await fileToDataUrl(file);
            setAttachment(attachmentData);
        } catch (error) {
            console.error("Error converting file to data URL:", error);
        }
    }
    // Clear the input value so the same file can be selected again
    if (e.target) e.target.value = ''; 
  };
  
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.includes('image')) {
            const blob = item.getAsFile();
            if (blob) {
                e.preventDefault();
                try {
                    const file = new File([blob], `pasted-image-${Date.now()}.${blob.type.split('/')[1] || 'png'}`, { type: blob.type });
                    const attachmentData = await fileToDataUrl(file);
                    setAttachment(attachmentData);
                } catch (error) {
                    console.error("Error converting pasted file to data URL:", error);
                }
                return; // Handle first image and exit
            }
        }
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = () => {
      setAttachment(null);
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

  return (
    <div className="flex flex-col items-center space-y-3">
        <ModeSelector activeMode={activeMode} onModeChange={setActiveMode} />
        
        {attachment && (
            <div className="relative w-full max-w-md p-2 bg-hacker-dark/50 border border-electric-lime/30 rounded-none flex items-center space-x-3">
                {attachment.mimeType.startsWith('image/') ? (
                    <img src={attachment.dataUrl} alt="Preview" className="w-16 h-16 object-cover rounded-none flex-shrink-0"/>
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
                    className="absolute -top-2 -right-2 bg-gray-800 text-gray-300 rounded-full p-0.5 hover:bg-red-600 hover:text-white transition-colors z-10"
                    aria-label="Remove attachment"
                    title="Remove attachment"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        )}

        <div className="w-full flex items-end space-x-2 p-2 bg-black/50 border border-electric-lime/30 rounded-none focus-within:shadow-glow transition-shadow duration-200">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,audio/*,text/*,.json,.csv,.md" className="hidden" />
            <button
                onClick={handleAttachClick}
                disabled={isLoading}
                className="p-2 rounded-none text-gray-400 hover:text-electric-lime hover:bg-electric-lime/10 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors self-center"
                aria-label="Attach file"
                title="Attach file"
            >
                <AttachmentIcon />
            </button>
            <textarea
                ref={textareaRef} // Assign ref
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={placeholderText}
                className="flex-1 bg-transparent text-electric-lime placeholder-lime-700 focus:outline-none resize-none max-h-40 font-mono"
                rows={1}
                disabled={isLoading}
                aria-label={textareaAriaLabel} // Dynamic aria-label
            />
            <button
                onClick={handleSend}
                disabled={isLoading || (!prompt.trim() && !attachment)}
                className="p-2 rounded-none bg-electric-lime text-hacker-dark hover:shadow-glow disabled:bg-gray-600 disabled:text-gray-800 disabled:cursor-not-allowed transition-all"
                aria-label={sendButtonAriaLabel} // Dynamic aria-label
                title={sendButtonAriaLabel} // Dynamic title
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-hacker-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <SendIcon />
                )}
            </button>
        </div>
    </div>
  );
};
