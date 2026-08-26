/**
 * Shared responsive breakpoints and device-class helpers.
 *
 * Prefer feature detection (`pointer`, `hover`, height, orientation) alongside
 * width — do not treat viewport width as the sole interaction mode signal.
 */

export const BREAKPOINTS = {
  /** Phones in portrait and narrow layouts. */
  phoneMax: 479,
  /** Large phones / small tablets. */
  compactMax: 767,
  /** Tablets and small laptops. */
  tabletMax: 1023,
  /** Standard laptops / desktops. */
  laptopMax: 1439,
  /** Large desktop displays start above this. */
  desktopMin: 1440,
  /** Unusually short viewports (landscape phones, short browser chrome). */
  shortHeightMax: 520,
} as const;

export const MEDIA = {
  phone: `(max-width: ${BREAKPOINTS.phoneMax}px)`,
  compact: `(max-width: ${BREAKPOINTS.compactMax}px)`,
  tablet: `(min-width: ${BREAKPOINTS.compactMax + 1}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  laptop: `(min-width: ${BREAKPOINTS.tabletMax + 1}px) and (max-width: ${BREAKPOINTS.laptopMax}px)`,
  largeDesktop: `(min-width: ${BREAKPOINTS.desktopMin}px)`,
  shortViewport: `(max-height: ${BREAKPOINTS.shortHeightMax}px)`,
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
  coarsePointer: "(pointer: coarse)",
  finePointer: "(pointer: fine)",
  canHover: "(hover: hover)",
  fineHover: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

/** Historical aliases used across desktop + transition code. */
export const DESKTOP_COMPACT_MEDIA_QUERY = MEDIA.compact;
export const MOBILE_MEDIA_QUERY = MEDIA.compact;

export type ViewportClass =
  | "phone"
  | "tablet"
  | "laptop"
  | "large-desktop"
  | "short";

export type InteractionPresentation =
  /** Floating windows + precise pointer chrome. */
  | "desktop-windows"
  /** Near-fullscreen panels; limited drag; touch-first. */
  | "tablet-panels"
  /** Reading-first sheets / stacked surfaces — not tiny OS windows. */
  | "mobile-sheets";

export function resolveViewportClass(width: number, height: number): ViewportClass {
  if (height > 0 && height <= BREAKPOINTS.shortHeightMax) {
    return "short";
  }
  if (width <= BREAKPOINTS.compactMax) {
    return "phone";
  }
  if (width <= BREAKPOINTS.tabletMax) {
    return "tablet";
  }
  if (width <= BREAKPOINTS.laptopMax) {
    return "laptop";
  }
  return "large-desktop";
}

/**
 * Maps viewport + pointer capability to the portfolio / sky chrome model.
 * Shared components stay the same; presentation changes by class.
 */
export function resolveInteractionPresentation(input: {
  width: number;
  height: number;
  coarsePointer: boolean;
  canHover: boolean;
}): InteractionPresentation {
  const { width, height, coarsePointer, canHover } = input;
  const short = height > 0 && height <= BREAKPOINTS.shortHeightMax;

  if (width <= BREAKPOINTS.compactMax || (short && width <= BREAKPOINTS.tabletMax)) {
    return "mobile-sheets";
  }

  if (
    width <= BREAKPOINTS.tabletMax ||
    (coarsePointer && !canHover && width <= BREAKPOINTS.laptopMax)
  ) {
    return "tablet-panels";
  }

  return "desktop-windows";
}
