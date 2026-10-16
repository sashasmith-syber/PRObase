interface LoadingSkeletonProps {
  lines?: number;
}

/**
 * @param props - Loading skeleton props.
 * @returns Skeleton placeholder for streaming responses.
 */
export const LoadingSkeleton = ({ lines = 3 }: LoadingSkeletonProps): JSX.Element => {
  return (
    <div className="flex justify-start" aria-hidden="true">
      <div className="relative rounded-none p-4 max-w-2xl w-full text-sm md:text-base bg-black/40 border border-lime-900 animate-pulse space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`skeleton-line-${index}`}
            className={`h-3 rounded bg-lime-900/40 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </div>
  );
};
