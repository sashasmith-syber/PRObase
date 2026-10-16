import React from 'react';

export const TranslatorIcon: React.FC<{className?: string}> = ({className = 'w-5 h-5'}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 21l-6-6m0 0l6-6m-6 6h18M14 3l6 6m0 0l-6 6m6-6H6" />
  </svg>
);
