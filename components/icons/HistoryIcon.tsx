/**
 * @param className - Optional icon class name.
 * @returns History icon SVG.
 */
export const HistoryIcon = ({ className = 'w-6 h-6' }: { className?: string }): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
