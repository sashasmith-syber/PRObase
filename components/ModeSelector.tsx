import React from 'react';
import { MODES } from '../constants';
import { Mode } from '../types';

interface ModeSelectorProps {
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ activeMode, onModeChange }) => {
  const primaryModes = MODES.slice(0, 9);
  const secondaryModes = MODES.slice(9);

  const renderButton = (mode: (typeof MODES)[number]) => {
    const isActive = activeMode === mode.id;
    return (
      <button
        key={mode.id}
        onClick={() => onModeChange(mode.id)}
        aria-pressed={isActive}
        className={`px-3 py-2 text-[11px] md:text-xs font-semibold rounded-none flex items-center gap-2 uppercase tracking-wider transition-all duration-200 border ${
          isActive
            ? 'bg-electric-lime/20 border-electric-lime text-electric-lime shadow-glow'
            : 'bg-black/40 border-electric-lime/50 text-electric-lime/80 hover:bg-electric-lime/10 hover:text-electric-lime'
        }`}
      >
        {React.cloneElement(mode.icon, { className: 'w-4 h-4' })}
        <span>{mode.title}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-1">
        {primaryModes.map(renderButton)}
      </div>
      <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-1">
        {secondaryModes.map(renderButton)}
      </div>
    </div>
  );
};
