"use client";

import { ShortcutIcon } from "@/components/desktop/ShortcutIcon";
import { useDesktopStore } from "@/state/desktop-store";
import type { DesktopShortcutConfig } from "@/types/desktop";

interface DesktopShortcutProps {
  shortcut: DesktopShortcutConfig;
}

export function DesktopShortcut({ shortcut }: DesktopShortcutProps) {
  const openWindow = useDesktopStore((state) => state.openWindow);

  return (
    <button
      type="button"
      className="desktop-shortcut"
      onClick={() => openWindow(shortcut.windowType)}
      onDoubleClick={() => openWindow(shortcut.windowType)}
    >
      <span className="desktop-shortcut__icon" aria-hidden="true">
        <ShortcutIcon iconId={shortcut.iconId} />
      </span>
      <span className="desktop-shortcut__label">{shortcut.label}</span>
    </button>
  );
}
