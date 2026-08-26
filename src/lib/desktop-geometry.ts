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
  const usableWidth = Math.max(0, viewport.width);
  const usableHeight = Math.max(0, viewport.height);
  const windowWidth = Math.min(size.width, usableWidth);
  const maxX = Math.max(0, usableWidth - windowWidth);
  // Keep enough of the title bar on-screen after aggressive shrink / short viewports.
  const maxY = Math.max(0, usableHeight - Math.min(TITLE_BAR_REACH, usableHeight));

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
    const shortcutReserve = viewport.height < 520 ? 36 : 48;
    return {
      width: Math.max(minSize.width, viewport.width - margin * 2),
      height: Math.max(160, viewport.height - margin * 2 - shortcutReserve),
    };
  }

  const maxWidth = Math.max(minSize.width, viewport.width - 24);
  const maxHeight = Math.max(minSize.height, viewport.height - 24);

  return {
    width: Math.min(Math.max(size.width, minSize.width), maxWidth),
    height: Math.min(Math.max(size.height, minSize.height), maxHeight),
  };
}

export function compactWindowPosition(): DesktopPoint {
  return { x: 12, y: 12 };
}
