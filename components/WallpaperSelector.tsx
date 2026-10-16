import React, { useState } from 'react';
import { WALLPAPERS } from '../constants/wallpapers';

interface WallpaperSelectorProps {
  onSelect: (selection: number | string) => void;
}

export const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({ onSelect }) => {
  const [url, setUrl] = useState('');

  const handleSetUrl = () => {
    if (url.trim()) {
      onSelect(url.trim());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSetUrl();
    }
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-hacker-dark/80 backdrop-blur-md border border-electric-lime/30 rounded-none p-3 shadow-2xl z-20"
      aria-modal="true"
      role="dialog"
    >
      <h3 className="text-sm font-bold text-lime-300 px-1 pb-2">Select Wallpaper</h3>
      <div className="grid grid-cols-3 gap-2">
        {WALLPAPERS.map((wallpaper, index) => (
          <button
            key={wallpaper.id}
            onClick={() => onSelect(index)}
            className="group relative aspect-square rounded-none overflow-hidden border-2 border-transparent hover:border-electric-lime focus:outline-none focus:border-electric-lime transition-all duration-200"
            aria-label={`Select ${wallpaper.name} wallpaper`}
          >
            <div
              className="absolute inset-0 w-full h-full"
              style={wallpaper.style}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <span className="absolute bottom-1 left-1 right-1 text-xs text-white font-semibold text-center bg-black/50 rounded-sm px-1 py-0.5">
              {wallpaper.name}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-electric-lime/20">
        <h4 className="text-xs font-bold text-lime-300 px-1 pb-1.5">External URL</h4>
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Paste image URL and press Enter"
            className="flex-grow bg-black/40 border border-lime-800 rounded-none px-2 py-1 text-sm text-electric-lime placeholder-lime-700 focus:outline-none focus:border-electric-lime transition-colors w-full"
            aria-label="External wallpaper URL"
          />
          <button
            onClick={handleSetUrl}
            className="px-3 py-1 bg-electric-lime/20 text-lime-300 rounded-none border border-lime-700 hover:bg-electric-lime/40 hover:text-white transition-colors"
            aria-label="Set external wallpaper"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};
