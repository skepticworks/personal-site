"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  DESKTOP_COMPACT_MEDIA_QUERY,
  MOBILE_MEDIA_QUERY,
} from "@/config/breakpoints";

export { DESKTOP_COMPACT_MEDIA_QUERY, MOBILE_MEDIA_QUERY, useMediaQuery };

/** Convenience: matches the shared compact / mobile breakpoint. */
export function useIsCompactViewport(): boolean {
  return useMediaQuery(DESKTOP_COMPACT_MEDIA_QUERY);
}
