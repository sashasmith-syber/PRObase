/**
 * @param className - Optional icon class name.
 * @returns Close icon SVG.
 */
export const CloseIcon = ({ className = 'w-6 h-6' }: { className?: string }): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
