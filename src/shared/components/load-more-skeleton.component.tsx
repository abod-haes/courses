export function LoadMoreSkeleton() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading more items">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-[10px] border border-border/70 bg-surface shadow-[0_7px_20px_rgba(17,24,39,0.04)]">
          <div className="h-40 animate-pulse bg-foreground/8" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-24 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-3 w-full animate-pulse rounded-full bg-foreground/8" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-foreground/8" />
          </div>
        </div>
      ))}
    </div>
  );
}
