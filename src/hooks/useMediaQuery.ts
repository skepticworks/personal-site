"use client";

import { useEffect, useState } from "react";

/** Matches the desktop CSS compact breakpoint for shared window behavior. */
export const DESKTOP_COMPACT_MEDIA_QUERY = "(max-width: 767px)";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
