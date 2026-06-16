"use client";

import { useEffect, useRef } from "react";

type InfiniteScrollSentinelProps = Readonly<{
  enabled: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}>;

export function InfiniteScrollSentinel({ enabled, onLoadMore, rootMargin = "600px" }: InfiniteScrollSentinelProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || !enabled) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      { root: null, rootMargin, threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, onLoadMore, rootMargin]);

  return <div ref={ref} aria-hidden="true" className="h-px w-full" />;
}
