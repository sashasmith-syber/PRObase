import React, { useEffect, useRef } from 'react';
import { Message as MessageType, Role } from '../types';
import { Message } from './Message';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
  streamingResponse: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, streamingResponse }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingResponse]);

  return (
    <div className="flex-1 min-h-0 px-4 py-4 md:px-6 md:py-5">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto p-4 md:p-6 space-y-6 border border-electric-lime/40 bg-black/70 grid-overlay font-tech text-electric-lime"
      >
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && streamingResponse && (
          <Message
            message={{
              id: 'streaming-msg',
              role: Role.Model,
              content: streamingResponse,
              timestamp: new Date(),
            }}
            isStreaming={true}
          />
        )}
      </div>
    </div>
  );
};
