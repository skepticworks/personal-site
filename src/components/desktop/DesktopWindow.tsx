"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { WindowTitleBar } from "@/components/desktop/WindowTitleBar";
import { getWindowDefinition } from "@/components/desktop/window-registry";
import {
  DESKTOP_COMPACT_MEDIA_QUERY,
  useMediaQuery,
} from "@/hooks/useMediaQuery";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import {
  clampWindowPosition,
  compactWindowPosition,
  constrainWindowSize,
} from "@/lib/desktop-geometry";
import { useDesktopStore } from "@/state/desktop-store";
import { useExperienceStore } from "@/state/experience-store";
import type { DesktopWindowType } from "@/types/desktop";

interface DesktopWindowProps {
  windowType: DesktopWindowType;
  viewport: { width: number; height: number };
}

export function DesktopWindow({ windowType, viewport }: DesktopWindowProps) {
  const definition = getWindowDefinition(windowType);
  const windowState = useDesktopStore((state) => state.windows[windowType]);
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const closeWindow = useDesktopStore((state) => state.closeWindow);
  const moveWindow = useDesktopStore((state) => state.moveWindow);
  const canInteractWithDesktop = useExperienceStore(
    (state) => state.canInteractWithDesktop,
  );
  const isCompact = useMediaQuery(DESKTOP_COMPACT_MEDIA_QUERY);
  const articleRef = useRef<HTMLElement>(null);
  const hasFocusedRef = useRef(false);

  const isActive = activeWindowId === windowType;
  const Content = definition.Content;

  const size = useMemo(
    () =>
      constrainWindowSize(
        windowState.size,
        definition.minSize,
        viewport,
        isCompact,
      ),
    [definition.minSize, isCompact, viewport, windowState.size],
  );

  const position = useMemo(() => {
    if (isCompact) {
      return compactWindowPosition();
    }
    return clampWindowPosition(windowState.position, size, viewport);
  }, [isCompact, size, viewport, windowState.position]);

  const clamp = useCallback(
    (next: { x: number; y: number }) =>
      clampWindowPosition(next, size, viewport),
    [size, viewport],
  );

  const onFocus = useCallback(() => {
    focusWindow(windowType);
  }, [focusWindow, windowType]);

  const onMove = useCallback(
    (next: { x: number; y: number }) => {
      moveWindow(windowType, next);
    },
    [moveWindow, windowType],
  );

  const dragHandlers = useWindowDrag({
    enabled: !isCompact && canInteractWithDesktop,
    position: windowState.position,
    onFocus,
    onMove,
    clamp,
  });

  useEffect(() => {
    if (!isActive || hasFocusedRef.current) {
      return;
    }
    hasFocusedRef.current = true;
    articleRef.current?.focus();
  }, [isActive]);

  const titleId = `desktop-window-title-${windowType}`;

  return (
    <article
      ref={articleRef}
      className={`desktop-window${isActive ? " is-active" : ""}`}
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: windowState.zIndex,
      }}
      aria-labelledby={titleId}
      data-active={isActive ? "true" : "false"}
      tabIndex={-1}
      onPointerDown={onFocus}
    >
      <WindowTitleBar
        title={definition.title}
        titleId={titleId}
        isActive={isActive}
        onClose={() => closeWindow(windowType)}
        dragHandlers={dragHandlers}
        dragEnabled={!isCompact && canInteractWithDesktop}
      />
      <div className="desktop-window__body">
        <Content />
      </div>
    </article>
  );
}
