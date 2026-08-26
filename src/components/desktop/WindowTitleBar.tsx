"use client";

import type { PointerEvent as ReactPointerEvent } from "react";

import { IconClose } from "@/components/icons/UiIcons";

interface WindowTitleBarProps {
  title: string;
  titleId: string;
  isActive: boolean;
  onClose: () => void;
  dragHandlers: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
  };
  dragEnabled: boolean;
}

export function WindowTitleBar({
  title,
  titleId,
  isActive,
  onClose,
  dragHandlers,
  dragEnabled,
}: WindowTitleBarProps) {
  return (
    <div
      className={`desktop-window__titlebar${isActive ? " is-active" : ""}`}
      {...(dragEnabled ? dragHandlers : {})}
      style={{ cursor: dragEnabled ? "grab" : "default" }}
    >
      <h2 id={titleId} className="desktop-window__title">
        {title}
      </h2>
      <button
        type="button"
        className="desktop-window__close"
        aria-label={`Close ${title}`}
        data-window-no-drag
        onClick={onClose}
      >
        <IconClose className="desktop-window__close-icon" />
      </button>
    </div>
  );
}
