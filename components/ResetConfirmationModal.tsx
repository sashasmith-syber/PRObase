
import { useEffect, useRef, useState } from 'react';
import { WarningIcon } from './icons/WarningIcon';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CONFIRMATION_PHRASE = "YES, ERASE MY DATA PERMANENTLY";

/**
 * @param props - Reset confirmation modal props.
 * @returns Modal UI or null when closed.
 */
export const ResetConfirmationModal = ({ isOpen, onConfirm, onCancel }: ResetConfirmationModalProps): JSX.Element | null => {
  const [input, setInput] = useState('');
  const isConfirmed = input === CONFIRMATION_PHRASE;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  useEffect(() => {
    // Reset input when modal is closed
    if (!isOpen) {
      setInput('');
      return;
    }
    inputRef.current?.focus();
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="w-full max-w-lg bg-hacker-dark/95 border-2 border-red-500/50 rounded-none p-6 shadow-2xl shadow-red-500/20 flex flex-col items-center text-center"
      >
        <WarningIcon className="w-16 h-16 text-red-500" />
        
        <h2 className="text-2xl font-display font-bold text-red-400 mt-4" style={{ textShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}>
          RESET COMMAND DETECTED
        </h2>
        
        <p className="mt-4 text-lime-300/80 font-mono">
          WARNING: You are about to permanently erase ALL your chat history and personalized learning data with AIT Professor. This action is irreversible.
        </p>

        <p className="mt-4 text-lime-300 font-mono">
          To confirm this action, please type the exact phrase below:
        </p>
        <p className="my-2 p-2 font-mono text-base bg-black/50 border border-lime-700 text-lime-300 select-all">
          {CONFIRMATION_PHRASE}
        </p>

        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          ref={inputRef}
          className="w-full mt-2 bg-black/40 border border-lime-800 rounded-none px-3 py-2 text-sm text-electric-lime placeholder-lime-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors font-mono"
          placeholder="Type confirmation phrase here..."
          aria-label="Confirmation input"
        />

        <div className="flex justify-center gap-4 mt-6 w-full">
          <button
            onClick={onCancel}
            className="w-1/2 px-4 py-2 font-bold text-lime-300 bg-black/20 border border-lime-700 rounded-none hover:bg-lime-900/40 hover:border-lime-500 transition-all focus-visible:ring-2 focus-visible:ring-electric-lime"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmed}
            className="w-1/2 px-4 py-2 font-bold rounded-none transition-all border border-red-500/50 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-600 bg-red-600/80 text-white hover:bg-red-500 hover:shadow-glow hover:shadow-red-500/50 focus-visible:ring-2 focus-visible:ring-red-400"
          >
            CONFIRM ERASURE
          </button>
        </div>
      </div>
    </div>
  );
};
