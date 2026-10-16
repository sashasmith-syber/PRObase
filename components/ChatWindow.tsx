import { useEffect, useMemo, useRef } from 'react';
import { Message as MessageType, Role } from '../types';
import { Message } from './Message';
import { LoadingSkeleton } from './ui/LoadingSkeleton';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
  streamingResponse: string;
}

/**
 * @param props - Chat window props.
 * @returns Chat window view.
 */
export const ChatWindow = ({ messages, isLoading, streamingResponse }: ChatWindowProps): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const renderedMessages = useMemo(() => {
    return messages.map((msg) => <Message key={msg.id} message={msg} />);
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingResponse]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {renderedMessages}
      {isLoading && !streamingResponse && <LoadingSkeleton />}
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
