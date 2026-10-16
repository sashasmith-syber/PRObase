import { Conversation } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

/**
 * @param props - History panel props.
 * @returns History panel UI or null when closed.
 */
export const HistoryPanel = ({
  isOpen,
  onClose,
  history,
  activeConversationId,
  onSelect,
  onDelete,
  onNewChat,
}: HistoryPanelProps): JSX.Element | null => {
  if (!isOpen) return null;

  const handleDeleteClick = (e: React.MouseEvent, id: string): void => {
    e.stopPropagation(); // Prevent onSelect from firing
    if (window.confirm('Are you sure you want to delete this conversation?')) {
        onDelete(id);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 left-0 h-full w-72 md:w-80 bg-hacker-dark/90 border-r-2 border-electric-lime/30 z-30 flex flex-col p-4 shadow-2xl shadow-electric-lime/20"
        aria-label="Chat history panel"
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-electric-lime/20">
          <h2 className="text-lg font-display text-electric-lime" style={{textShadow: '0 0 5px rgba(57, 255, 20, 0.5)'}}>
            Chat History
          </h2>
          <button
            onClick={onNewChat}
            title="Start New Chat"
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-none border border-lime-700 bg-black/20 text-lime-300 hover:bg-electric-lime/20 hover:text-white transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 -mr-2 pr-2">
          {history.length === 0 ? (
             <div className="text-center text-lime-700 font-mono text-sm py-10">
                <p>&gt; NO SAVED</p>
                <p>&gt; CONVERSATIONS</p>
             </div>
          ) : (
            history.map((convo) => (
            <button
              key={convo.id}
              onClick={() => onSelect(convo.id)}
              className={`w-full group text-left p-2 rounded-none transition-all duration-150 border-l-2 flex justify-between items-start focus-visible:ring-2 focus-visible:ring-electric-lime ${
                activeConversationId === convo.id
                  ? 'bg-electric-lime/10 border-electric-lime'
                  : 'bg-transparent border-transparent hover:bg-lime-900/40 hover:border-lime-700'
              }`}
              aria-current={activeConversationId === convo.id ? 'true' : undefined}
            >
              <div className="flex-1 overflow-hidden">
                <p className={`font-semibold text-sm truncate ${activeConversationId === convo.id ? 'text-lime-300' : 'text-lime-400 group-hover:text-lime-300'}`}>
                  {convo.title}
                </p>
                <p className="text-xs text-lime-600 group-hover:text-lime-500">
                    {new Date(convo.timestamp).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={(e) => handleDeleteClick(e, convo.id)}
                className="p-1 rounded-none text-lime-700 opacity-50 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label="Delete conversation"
                title="Delete conversation"
              >
                  <TrashIcon className="w-4 h-4"/>
              </button>
            </button>
          )))}
        </div>
      </aside>
    </>
  );
};
