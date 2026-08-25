import type { DesktopPoint, DesktopSize } from "@/types/desktop";

export interface ViewportBox {
  width: number;
  height: number;
}

const TITLE_BAR_REACH = 44;

export function clampWindowPosition(
  position: DesktopPoint,
  size: DesktopSize,
  viewport: ViewportBox,
): DesktopPoint {
  const maxX = Math.max(0, viewport.width - Math.min(size.width, viewport.width));
  const maxY = Math.max(
    0,
    viewport.height - TITLE_BAR_REACH,
  );

  return {
    x: Math.min(Math.max(0, position.x), maxX),
    y: Math.min(Math.max(0, position.y), maxY),
  };
}

export function constrainWindowSize(
  size: DesktopSize,
  minSize: DesktopSize,
  viewport: ViewportBox,
  compact: boolean,
): DesktopSize {
  if (compact) {
    const margin = 12;
    return {
      width: Math.max(minSize.width, viewport.width - margin * 2),
      height: Math.max(minSize.height, viewport.height - margin * 2 - 48),
    };
  }

  return {
    width: Math.min(
      Math.max(size.width, minSize.width),
      Math.max(minSize.width, viewport.width - 24),
    ),
    height: Math.min(
      Math.max(size.height, minSize.height),
      Math.max(minSize.height, viewport.height - 24),
    ),
  };
}

export function compactWindowPosition(): DesktopPoint {
  return { x: 12, y: 12 };
}
