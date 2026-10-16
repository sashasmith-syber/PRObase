
/**
 * @param className - Optional icon class name.
 * @returns Code icon SVG.
 */
export const CodeIcon = ({ className = 'w-5 h-5' }: { className?: string }): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);
