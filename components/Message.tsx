import React from 'react';
import { Message as MessageType, Role } from '../types';
import { CodeBlock } from './ui/CodeBlock';
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
  const isModel = message.role === Role.Model;

  return (
    <div className="space-y-2 message-fade">
      {message.attachment && (
        <div className="rounded-none border border-electric-lime/30 overflow-hidden">
          {message.attachment.mimeType.startsWith('image/') ? (
            <img
              src={message.attachment.data}
              alt="User attachment"
              className="max-w-xs max-h-64 object-cover cursor-pointer"
              onClick={() => window.open(message.attachment?.data, '_blank', 'noopener,noreferrer')}
            />
          ) : (
            <div className="p-3 bg-black/40 flex items-center space-x-3">
              {message.attachment.mimeType.startsWith('audio/') ? (
                <AudioFileIcon className="w-8 h-8 text-electric-lime/80 flex-shrink-0" />
              ) : (
                <TextFileIcon className="w-8 h-8 text-electric-lime/80 flex-shrink-0" />
              )}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-lime-300 truncate" title={message.attachment.name}>
                  {message.attachment.name}
                </p>
                <p className="text-xs text-lime-500">{message.attachment.mimeType}</p>
              </div>
            </div>
          )}
        </div>
      )}
      <div className={`font-tech text-sm md:text-base whitespace-pre-wrap leading-relaxed ${isModel ? 'text-electric-lime' : 'text-lime-300'}`}>
        {renderContent(message.content, isStreaming)}
      </div>
    </div>
  );
};