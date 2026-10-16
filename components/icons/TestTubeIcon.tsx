/**
 * @param className - Optional icon class name.
 * @returns Test tube icon SVG.
 */
export const TestTubeIcon = ({ className = 'w-5 h-5' }: { className?: string }): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082m.75.082a24.301 24.301 0 014.5 0m4.5 0v5.714c0 .828-.447 1.556-1.141 1.942l-3.359 2.016m-4.5-7.714v5.714a2.25 2.25 0 00.659 1.591L19 14.5M9.75 3.104c-1.352 0-2.456.683-3.19 1.743L5 6.5m-1.75.25a24.301 24.301 0 004.5 0m4.5 0c1.352 0 2.456.683 3.19 1.743L19 6.5m-1.75.25a24.301 24.301 0 01-4.5 0m-4.5 0l-.17.004M9.75 12.75h4.5M3 15.75c0 .414.336.75.75.75h16.5a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v.75z" />
  </svg>
);