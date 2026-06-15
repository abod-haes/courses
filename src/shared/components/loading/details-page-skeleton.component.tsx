type DetailsPageSkeletonProps = Readonly<{
  title?: string;
}>;

export function DetailsPageSkeleton({ title = "Preparing content..." }: DetailsPageSkeletonProps) {
  return (
    <div className="min-h-full bg-section-bg" role="status" aria-live="polite" aria-label={title}>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="loading-shimmer h-10 w-36 rounded-full" />

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="animate-skeleton-card rounded-[2rem] border border-border/70 bg-surface p-3 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            <div className="loading-shimmer aspect-[4/3] rounded-[1.5rem]" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="loading-shimmer h-16 rounded-2xl" />
              <div className="loading-shimmer h-16 rounded-2xl" />
              <div className="loading-shimmer h-16 rounded-2xl" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-surface/92 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="loading-shimmer h-8 w-28 rounded-full" />
              <div className="loading-shimmer h-5 w-32 rounded-full" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="loading-shimmer h-10 w-full rounded-2xl" />
              <div className="loading-shimmer h-10 w-10/12 rounded-2xl" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="loading-shimmer h-5 w-full rounded-full" />
              <div className="loading-shimmer h-5 w-11/12 rounded-full" />
              <div className="loading-shimmer h-5 w-9/12 rounded-full" />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="loading-shimmer h-12 flex-1 rounded-full" />
              <div className="loading-shimmer h-12 flex-1 rounded-full" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-border/70 bg-surface p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="mb-6 flex items-center gap-3 text-body-sm font-medium text-on-surface-variant">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/45" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            {title}
          </div>

          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="loading-shimmer h-5 rounded-full"
                style={{ width: `${index % 3 === 0 ? 100 : index % 3 === 1 ? 88 : 72}%` }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
