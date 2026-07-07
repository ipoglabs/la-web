import { useState, useEffect } from "react";

/**
 * Returns true when the given media query matches.
 * SSR-safe — always returns false on the server.
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  // Always start as false to match the server render (window doesn't exist on SSR).
  // useEffect sets the real value after hydration — this is the only SSR-safe pattern.
  // A lazy-init reading window.matchMedia() on the client's first render would return
  // a value that doesn't match the server's false, causing a hydration mismatch.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches); // sync to real value after hydration
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
