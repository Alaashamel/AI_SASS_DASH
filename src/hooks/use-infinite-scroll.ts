"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useInfiniteScroll(
  callback: () => Promise<void>,
  options?: { threshold?: number; enabled?: boolean }
) {
  const { threshold = 200, enabled = true } = options || {};
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled && !isLoading && hasMore) {
        setIsLoading(true);
        try {
          await callback();
        } finally {
          setIsLoading(false);
        }
      }
    },
    [callback, enabled, isLoading, hasMore]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: `${threshold}px`,
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver, threshold]);

  return { sentinelRef, isLoading, hasMore, setHasMore };
}
