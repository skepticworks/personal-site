"use client";

import { useEffect, useState } from "react";

import { DESKTOP_COMPACT_MEDIA_QUERY } from "@/config/breakpoints";

export { DESKTOP_COMPACT_MEDIA_QUERY };

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
