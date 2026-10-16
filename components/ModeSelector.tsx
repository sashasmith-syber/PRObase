import React from 'react';
import { MODES } from '../constants';
import { Mode } from '../types';

interface ModeSelectorProps {
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex justify-center flex-wrap gap-2 md:gap-3">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-3 py-2 text-xs md:px-4 md:py-2 md:text-sm font-semibold rounded-none flex items-center gap-2 transition-all duration-200 border ${
            activeMode === mode.id
              ? `${mode.color} bg-electric-lime/10 border-current shadow-glow`
              : 'text-gray-400 bg-black/20 border-gray-700 hover:bg-gray-800 hover:border-gray-600 hover:text-white'
          }`}
        >
          {React.cloneElement(mode.icon, { className: 'w-4 h-4' })}
          <span>{mode.title}</span>
        </button>
      ))}
    </div>
  );
};
