/**
 * @param className - Optional icon class name.
 * @returns Performance icon SVG.
 */
export const PerformanceIcon = ({ className = 'w-5 h-5' }: { className?: string }): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625l-6.25 3.75M3.75 19.5h16.5M21 6.75l-3.75-.625m3.75.625v3.75" />
    </svg>
);