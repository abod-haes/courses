type CatalogPageSkeletonProps = Readonly<{
  title?: string;
  cardCount?: number;
}>;

export function CatalogPageSkeleton({ title = "Loading medical resources...", cardCount = 8 }: CatalogPageSkeletonProps) {
  return (
    <div className="min-h-full bg-section-bg" role="status" aria-live="polite" aria-label={title}>
      <section className="border-b border-border/60 bg-section-bg">
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-7 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          <div className="max-w-3xl space-y-4">
            <div className="loading-shimmer h-4 w-28 rounded-full" />
            <div className="loading-shimmer h-10 w-64 rounded-2xl sm:w-96" />
            <div className="loading-shimmer h-5 w-full max-w-2xl rounded-full" />
            <div className="loading-shimmer h-5 w-4/5 max-w-xl rounded-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="rounded-[1.5rem] border border-border/70 bg-surface/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.05)] backdrop-blur">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="loading-shimmer h-12 rounded-2xl" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="loading-shimmer h-10 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 text-body-sm font-medium text-on-surface-variant">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/45" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
          {title}
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: cardCount }).map((_, index) => (
            <article
              key={index}
              className="animate-skeleton-card rounded-[1.5rem] border border-border/70 bg-surface p-3 shadow-[0_16px_45px_rgba(15,23,42,0.05)]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="loading-shimmer aspect-[4/3] rounded-[1.25rem]" />
              <div className="mt-4 space-y-3 px-1 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="loading-shimmer h-6 w-24 rounded-full" />
                  <div className="loading-shimmer h-4 w-16 rounded-full" />
                </div>
                <div className="loading-shimmer h-5 w-11/12 rounded-full" />
                <div className="loading-shimmer h-5 w-8/12 rounded-full" />
                <div className="space-y-2 pt-1">
                  <div className="loading-shimmer h-4 w-full rounded-full" />
                  <div className="loading-shimmer h-4 w-4/5 rounded-full" />
                </div>
                <div className="loading-shimmer h-10 w-full rounded-full" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
