
/**
 * @param className - Optional icon class name.
 * @returns Check icon SVG.
 */
export const CheckIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
