"use client";

import { ShortcutIcon } from "@/components/desktop/ShortcutIcon";
import { useDesktopStore } from "@/state/desktop-store";
import type { DesktopShortcutConfig } from "@/types/desktop";

interface DesktopShortcutProps {
  shortcut: DesktopShortcutConfig;
}

export function DesktopShortcut({ shortcut }: DesktopShortcutProps) {
  const openWindow = useDesktopStore((state) => state.openWindow);

  const open = () => {
    openWindow(shortcut.windowType, { focusReturnId: shortcut.id });
  };

  return (
    <button
      type="button"
      id={shortcut.id}
      className="desktop-shortcut"
      onClick={open}
      onDoubleClick={open}
    >
      <span className="desktop-shortcut__icon" aria-hidden="true">
        <ShortcutIcon iconId={shortcut.iconId} />
      </span>
      <span className="desktop-shortcut__label">{shortcut.label}</span>
    </button>
  );
}
