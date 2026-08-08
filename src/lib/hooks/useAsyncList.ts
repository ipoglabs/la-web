import { useEffect, useRef, useState } from "react";

/**
 * Fetch-on-mount/dependency-change with loading + error state, so a
 * rejected promise surfaces an error instead of leaving `data` at `null`
 * (and whatever skeleton that gates) forever. Re-fetches whenever `deps`
 * changes, or when `refresh()` is called manually (e.g. after a mutation).
 */
export function useAsyncList<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList
): { data: T | null; error: string | null; refresh: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Ref so the effect below only re-runs on `deps`/`tick`, not on every
  // render caused by an inline fetcher function identity changing. Assigned
  // in its own effect (not during render) — it always runs before the effect
  // further down, since effects commit in declaration order.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this. Please try again.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, error, refresh: () => setTick((t) => t + 1) };
}
