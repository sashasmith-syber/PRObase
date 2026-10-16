import React from 'react';

export const FolderIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6.75A2.25 2.25 0 015.25 4.5h3.38a2.25 2.25 0 011.59.66l1.12 1.12c.42.42.99.66 1.59.66h5.53A2.25 2.25 0 0120.75 9v7.75A2.25 2.25 0 0118.5 19H5.25A2.25 2.25 0 013 16.75V6.75z"
    />
  </svg>
);
