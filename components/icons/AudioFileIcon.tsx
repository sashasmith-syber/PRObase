import React from 'react';

export const AudioFileIcon: React.FC<{className?: string}> = ({className = 'w-6 h-6'}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 8.634c-1.387-1.387-2.822-2.313-4.514-2.313-1.693 0-3.127.926-4.514 2.313m9.028 0a.75.75 0 01.75.75v1.875a.75.75 0 01-1.5 0V9.384a.75.75 0 01.75-.75zM8.366 8.634c1.387-1.387 2.822-2.313 4.514-2.313 1.693 0 3.127.926 4.514 2.313m-9.028 0a.75.75 0 00-.75.75v1.875a.75.75 0 001.5 0V9.384a.75.75 0 00-.75-.75zM12 18.375a3.375 3.375 0 003.375-3.375V12.75a3.375 3.375 0 00-6.75 0v2.25a3.375 3.375 0 003.375 3.375z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
