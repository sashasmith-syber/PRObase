import { useState, useRef, useEffect } from 'react';
import { WallpaperIcon } from './icons/WallpaperIcon';
import { WallpaperSelector } from './WallpaperSelector';
import { HistoryIcon } from './icons/HistoryIcon';
import { Tooltip } from './ui/Tooltip';

interface HeaderProps {
  onWallpaperSelect: (selection: number | string) => void;
  onToggleHistory: () => void;
}

/**
 * @param props - Header props.
 * @returns Header UI.
 */
export const Header = ({ onWallpaperSelect, onToggleHistory }: HeaderProps): JSX.Element => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selection: number | string): void => {
    onWallpaperSelect(selection);
    setIsSelectorOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsSelectorOpen(false);
      }
    };

    if (isSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelectorOpen]);

  return (
    <header className="relative p-4 text-center border-b border-electric-lime/20 bg-hacker-dark/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
       <Tooltip label="Toggle chat history (Ctrl/Cmd+K)">
          <button
            onClick={onToggleHistory}
            className="p-2 rounded-none text-electric-lime/70 hover:bg-electric-lime/10 hover:text-electric-lime transition-colors focus-visible:ring-2 focus-visible:ring-electric-lime min-w-[44px] min-h-[44px]"
            aria-label="Toggle chat history"
          >
            <HistoryIcon />
          </button>
        </Tooltip>

      <div className="flex flex-col items-center">
        <h1 
          className="text-2xl md:text-4xl font-display font-bold text-electric-lime tracking-widest"
          style={{ textShadow: '0 0 8px rgba(57, 255, 20, 0.7)' }}
        >
          AIT PROfessor
        </h1>
        <p className="text-xs text-lime-400 font-mono uppercase tracking-wider">
          IT Knowledge & Solutions Matrix
        </p>
      </div>

      <div ref={selectorRef} className="relative">
        <Tooltip label="Change wallpaper">
          <button
            onClick={() => setIsSelectorOpen(prev => !prev)}
            className="p-2 rounded-none text-electric-lime/70 hover:bg-electric-lime/10 hover:text-electric-lime transition-colors focus-visible:ring-2 focus-visible:ring-electric-lime min-w-[44px] min-h-[44px]"
            aria-label="Change wallpaper"
            aria-haspopup="true"
            aria-expanded={isSelectorOpen}
          >
            <WallpaperIcon />
          </button>
        </Tooltip>
        {isSelectorOpen && <WallpaperSelector onSelect={handleSelect} />}
      </div>
    </header>
  );
};