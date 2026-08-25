"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef } from "react";

import type { DesktopPoint } from "@/types/desktop";

interface UseWindowDragOptions {
  enabled: boolean;
  position: DesktopPoint;
  onFocus: () => void;
  onMove: (position: DesktopPoint) => void;
  clamp: (position: DesktopPoint) => DesktopPoint;
}

/**
 * Title-bar dragging via Pointer Events.
 * Live position updates go through onMove; callers should keep store updates
 * scoped to the active window to limit rerenders.
 *
 * When `enabled` flips to false mid-drag (e.g. desk → sky transition starts),
 * pointer capture and user-select locks are released immediately.
 */
export function useWindowDrag({
  enabled,
  position,
  onFocus,
  onMove,
  clamp,
}: UseWindowDragOptions) {
  const dragRef = useRef<{
    pointerId: number;
    originX: number;
    originY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const releaseDrag = useCallback(() => {
    const drag = dragRef.current;
    const target = targetRef.current;
    if (drag && target?.hasPointerCapture(drag.pointerId)) {
      target.releasePointerCapture(drag.pointerId);
    }
    dragRef.current = null;
    targetRef.current = null;
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (!enabled) {
      releaseDrag();
    }
  }, [enabled, releaseDrag]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-window-no-drag]")) {
        return;
      }

      onFocus();
      dragRef.current = {
        pointerId: event.pointerId,
        originX: event.clientX,
        originY: event.clientY,
        startX: position.x,
        startY: position.y,
      };
      targetRef.current = event.currentTarget;
      event.currentTarget.setPointerCapture(event.pointerId);
      document.body.style.userSelect = "none";
    },
    [enabled, onFocus, position.x, position.y],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!enabled || !drag || drag.pointerId !== event.pointerId) {
        return;
      }

      const next = clamp({
        x: drag.startX + (event.clientX - drag.originX),
        y: drag.startY + (event.clientY - drag.originY),
      });
      onMove(next);
    },
    [clamp, enabled, onMove],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }
      releaseDrag();
    },
    [releaseDrag],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
}
