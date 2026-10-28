"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { WindowTitleBar } from "@/components/desktop/WindowTitleBar";
import { getWindowDefinition } from "@/components/desktop/window-registry";
import { useViewportMode } from "@/hooks/useViewportMode";
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

/**
 * Desktop floating window, tablet near-fullscreen panel, or mobile reading sheet
 * depending on `useViewportMode` presentation — shared content components.
 */
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
  const { presentation, useMobileSheets, isCompact } = useViewportMode();
  const articleRef = useRef<HTMLElement>(null);
  const hasFocusedRef = useRef(false);

  const isActive = activeWindowId === windowType;
  const Content = definition.Content;
  const dragEnabled =
    presentation === "desktop-windows" && canInteractWithDesktop;

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

  const restoreFocusAndClose = useCallback(() => {
    const returnId = closeWindow(windowType);
    if (returnId) {
      window.requestAnimationFrame(() => {
        document.getElementById(returnId)?.focus();
      });
    }
  }, [closeWindow, windowType]);

  const dragHandlers = useWindowDrag({
    enabled: dragEnabled,
    position: windowState.position,
    onFocus,
    onMove,
    clamp,
  });

  useEffect(() => {
    if (!isActive) {
      hasFocusedRef.current = false;
      return;
    }
    if (hasFocusedRef.current) {
      return;
    }
    hasFocusedRef.current = true;
    articleRef.current?.focus();
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !windowState.isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      restoreFocusAndClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, restoreFocusAndClose, windowState.isOpen]);

  // Keep geometry inside the viewport when the browser is resized.
  useEffect(() => {
    if (isCompact || !windowState.isOpen) {
      return;
    }
    const clamped = clampWindowPosition(windowState.position, size, viewport);
    if (
      clamped.x !== windowState.position.x ||
      clamped.y !== windowState.position.y
    ) {
      moveWindow(windowType, clamped);
    }
  }, [
    isCompact,
    moveWindow,
    size,
    viewport,
    windowState.isOpen,
    windowState.position,
    windowType,
  ]);

  const titleId = `desktop-window-title-${windowType}`;
  const presentationClass =
    presentation === "mobile-sheets"
      ? "desktop-window--mobile-sheet"
      : presentation === "tablet-panels"
        ? "desktop-window--tablet-panel"
        : "desktop-window--floating";

  return (
    <article
      ref={articleRef}
      className={`desktop-window ${presentationClass}${isActive ? " is-active" : ""}`}
      style={
        useMobileSheets
          ? { zIndex: windowState.zIndex }
          : {
              width: size.width,
              height: size.height,
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: windowState.zIndex,
            }
      }
      aria-labelledby={titleId}
      data-active={isActive ? "true" : "false"}
      data-presentation={presentation}
      tabIndex={-1}
      onPointerDown={onFocus}
    >
      <WindowTitleBar
        title={definition.title}
        titleId={titleId}
        isActive={isActive}
        onClose={restoreFocusAndClose}
        dragHandlers={dragHandlers}
        dragEnabled={dragEnabled}
      />
      <div className="desktop-window__body">
        <Content />
      </div>
    </article>
  );
}
