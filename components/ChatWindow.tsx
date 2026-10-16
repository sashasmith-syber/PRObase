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
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
  );
};
