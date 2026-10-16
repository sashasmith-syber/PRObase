import React, { ReactElement, useId } from 'react';

interface TooltipProps {
  label: string;
  children: ReactElement;
}

/**
 * @param props - Tooltip props.
 * @returns Tooltip wrapper with accessible label.
 */
export const Tooltip = ({ label, children }: TooltipProps): JSX.Element => {
  const tooltipId = useId();

  return (
    <span className="relative inline-flex group">
      {React.cloneElement(children, { 'aria-describedby': tooltipId })}
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-lime-200 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
      </span>
    </span>
  );
};
