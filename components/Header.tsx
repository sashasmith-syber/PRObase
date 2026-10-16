import React, { useState, useRef, useEffect } from 'react';
import { WallpaperSelector } from './WallpaperSelector';
import { ClockIcon } from './icons/ClockIcon';
import { FolderIcon } from './icons/FolderIcon';
import { ImageIcon } from './icons/ImageIcon';

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
    <header className="relative w-full px-4 py-3 md:px-6 md:py-4 border-b border-electric-lime/30 bg-hacker-dark/80 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3 order-1">
        <div className="p-2 border border-electric-lime/40 text-electric-lime rounded-none">
          <ClockIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center order-2 w-full md:w-auto">
        <h1 className="text-2xl md:text-4xl font-display font-bold text-electric-lime text-glow tracking-widest">
          AIT PROfessor
        </h1>
        <p className="text-xs md:text-sm text-lime-400 font-mono uppercase tracking-[0.3em]">
          IT Knowledge & Solutions Matrix
        </p>
      </div>

      <div className="flex items-center gap-3 order-3">
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-2 px-3 py-2 border border-electric-lime/40 text-electric-lime rounded-none hover:bg-electric-lime/10 transition-colors focus:outline-none focus:ring-1 focus:ring-electric-lime"
          aria-label="Open all bookmarks"
          title="All Bookmarks"
        >
          <FolderIcon className="w-5 h-5" />
          <span className="text-[10px] md:text-sm font-mono uppercase tracking-wider whitespace-nowrap">All Bookmarks</span>
        </button>

        <div ref={selectorRef} className="relative">
          <button
            onClick={() => setIsSelectorOpen((prev) => !prev)}
            className="p-2 rounded-none border border-electric-lime/40 text-electric-lime hover:bg-electric-lime/10 transition-colors focus:outline-none focus:ring-1 focus:ring-electric-lime"
            aria-label="Change wallpaper"
            title="Change wallpaper"
            aria-haspopup="true"
            aria-expanded={isSelectorOpen}
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          {isSelectorOpen && <WallpaperSelector onSelect={handleSelect} />}
        </div>
      </div>
    </header>
  );
};