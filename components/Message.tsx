import React, { useState } from 'react';
import { Message as MessageType, Role } from '../types';
import { CodeBlock } from './ui/CodeBlock';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { AudioFileIcon } from './icons/AudioFileIcon';
import { TextFileIcon } from './icons/TextFileIcon';


interface MessageProps {
  message: MessageType;
  isStreaming?: boolean;
}

const renderContent = (content: string, isStreaming?: boolean) => {
  if (!content && !isStreaming) return null;

  const parts = content.split(/(```[\s\S]*?```)/g);

  const renderedParts = parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const codeBlockMatch = part.match(/^```(\w*)\n([\s\S]*?)```$/);
      if (codeBlockMatch) {
        const language = codeBlockMatch[1] || 'text';
        const code = codeBlockMatch[2];
        return <CodeBlock key={index} language={language} code={code} />;
      }
    }
    // Return text part, ensuring it's not empty, which can happen with split
    if (part) {
      return (
        <p key={index} className="whitespace-pre-wrap leading-relaxed">
          {part}
        </p>
      );
    }
    return null;
  });

  return (
    <>
      {renderedParts}
      {isStreaming && <span className="cursor-blink inline-block -mb-1 ml-1 text-xl">█</span>}
    </>
  );
};

export const Message: React.FC<MessageProps> = ({ message, isStreaming = false }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isModel = message.role === Role.Model;

  const wrapperClasses = isModel
    ? 'flex justify-start'
    : 'flex justify-end';

  const bubbleClasses = isModel
    ? 'bg-black/40 border border-lime-900'
    : 'bg-electric-lime/5 border border-lime-900';

  const avatarContent = isModel ? 'Ѫ' : '>';
  const avatarClasses = 'bg-transparent border border-electric-lime/30 text-electric-lime';

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={`${wrapperClasses} items-start gap-3 group`}>
      {isModel && (
        <div className={`flex-shrink-0 font-mono text-lg w-8 h-8 rounded-none flex items-center justify-center font-bold ${avatarClasses}`}>
          {avatarContent}
        </div>
      )}
      <div
        className={`relative rounded-none p-4 max-w-2xl w-full text-sm md:text-base ${bubbleClasses}`}
      >
        {message.content && !isStreaming && (
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-none bg-black/20 text-gray-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-black/40 hover:text-white"
                aria-label={isCopied ? 'Copied to clipboard' : 'Copy message'}
                title={isCopied ? 'Copied!' : 'Copy'}
            >
                {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            </button>
        )}

        {message.attachment && (
            <div className="mb-2 rounded-none border border-electric-lime/20 overflow-hidden">
                {message.attachment.mimeType.startsWith('image/') ? (
                    <img 
                        src={message.attachment.data} 
                        alt="User attachment"
                        className="max-w-xs max-h-64 object-cover cursor-pointer"
                        onClick={() => window.open(message.attachment?.data, '_blank')}
                    />
                ) : (
                    <div className="p-3 bg-black/30 flex items-center space-x-3">
                        {message.attachment.mimeType.startsWith('audio/') ? (
                            <AudioFileIcon className="w-8 h-8 text-electric-lime/80 flex-shrink-0" />
                        ) : (
                            <TextFileIcon className="w-8 h-8 text-electric-lime/80 flex-shrink-0" />
                        )}
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-lime-300 truncate" title={message.attachment.name}>{message.attachment.name}</p>
                            <p className="text-xs text-lime-500">{message.attachment.mimeType}</p>
                        </div>
                    </div>
                )}
            </div>
        )}
        <div className="pt-2 font-tech">
          {renderContent(message.content, isStreaming)}
        </div>
      </div>
       {!isModel && (
        <div className={`flex-shrink-0 font-mono text-lg w-8 h-8 rounded-none flex items-center justify-center font-bold ${avatarClasses}`}>
          {avatarContent}
        </div>
      )}
    </div>
  );
};