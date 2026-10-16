import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { WallpaperIcon } from './icons/WallpaperIcon';
import { HistoryIcon } from './icons/HistoryIcon';

const WallpaperSelector = lazy(async () => {
  const module = await import('./WallpaperSelector');
  return { default: module.WallpaperSelector };
});

interface HeaderProps {
  onWallpaperSelect: (selection: number | string) => void;
  onToggleHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onWallpaperSelect, onToggleHistory }) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selection: number | string) => {
    onWallpaperSelect(selection);
    setIsSelectorOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };

    if (isSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectorOpen]);

  return (
    <header className="relative p-4 text-center border-b border-electric-lime/20 bg-hacker-dark/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
       <button
          onClick={onToggleHistory}
          className="p-2 rounded-none text-electric-lime/70 hover:bg-electric-lime/10 hover:text-electric-lime transition-colors focus:outline-none focus:ring-1 focus:ring-electric-lime"
          aria-label="Toggle chat history"
          title="Toggle chat history"
        >
          <HistoryIcon />
        </button>

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
        <button
          onClick={() => setIsSelectorOpen(prev => !prev)}
          className="p-2 rounded-none text-electric-lime/70 hover:bg-electric-lime/10 hover:text-electric-lime transition-colors focus:outline-none focus:ring-1 focus:ring-electric-lime"
          aria-label="Change wallpaper"
          title="Change wallpaper"
          aria-haspopup="true"
          aria-expanded={isSelectorOpen}
        >
          <WallpaperIcon />
        </button>
        {isSelectorOpen && (
          <Suspense fallback={null}>
            <WallpaperSelector onSelect={handleSelect} />
          </Suspense>
        )}
      </div>
    </header>
  );
};