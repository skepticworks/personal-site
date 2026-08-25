"use client";

import { create } from "zustand";

import { desktopWindowDefinitions } from "@/config/desktop";
import type {
  DesktopPoint,
  DesktopSize,
  DesktopWindowState,
  DesktopWindowType,
} from "@/types/desktop";

const MAX_Z_INDEX = 1000;

interface DesktopStoreState {
  windows: Record<DesktopWindowType, DesktopWindowState>;
  activeWindowId: DesktopWindowType | null;
  zCounter: number;
  openWindow: (type: DesktopWindowType) => void;
  closeWindow: (id: DesktopWindowType) => void;
  focusWindow: (id: DesktopWindowType) => void;
  moveWindow: (id: DesktopWindowType, position: DesktopPoint) => void;
  resizeWindow: (id: DesktopWindowType, size: DesktopSize) => void;
  clearActiveWindow: () => void;
}

function createInitialWindows(): Record<DesktopWindowType, DesktopWindowState> {
  const entries = Object.values(desktopWindowDefinitions).map((definition) => {
    const state: DesktopWindowState = {
      id: definition.type,
      type: definition.type,
      isOpen: false,
      zIndex: 1,
      position: { ...definition.defaultPosition },
      size: { ...definition.defaultSize },
    };
    return [definition.type, state] as const;
  });

  return Object.fromEntries(entries) as Record<
    DesktopWindowType,
    DesktopWindowState
  >;
}

function nextZIndex(current: number): { zIndex: number; zCounter: number } {
  const zCounter = current >= MAX_Z_INDEX ? 10 : current + 1;
  return { zIndex: zCounter, zCounter };
}

/**
 * Desktop window manager.
 *
 * Position policy: closing a window keeps its last position and size for the
 * session. Reopening focuses and restores that geometry (clamped by the UI).
 */
export const useDesktopStore = create<DesktopStoreState>((set, get) => ({
  windows: createInitialWindows(),
  activeWindowId: null,
  zCounter: 10,
  openWindow: (type) => {
    const { windows, zCounter, activeWindowId } = get();
    const existing = windows[type];

    if (existing.isOpen) {
      if (activeWindowId === type) {
        return;
      }
      const layer = nextZIndex(zCounter);
      set({
        activeWindowId: type,
        zCounter: layer.zCounter,
        windows: {
          ...windows,
          [type]: { ...existing, zIndex: layer.zIndex },
        },
      });
      return;
    }

    const layer = nextZIndex(zCounter);
    set({
      activeWindowId: type,
      zCounter: layer.zCounter,
      windows: {
        ...windows,
        [type]: {
          ...existing,
          isOpen: true,
          zIndex: layer.zIndex,
        },
      },
    });
  },
  closeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const target = windows[id];
    if (!target.isOpen) {
      return;
    }

    const updatedWindows = {
      ...windows,
      [id]: { ...target, isOpen: false },
    };

    let nextActive: DesktopWindowType | null = null;
    if (activeWindowId === id) {
      const remaining = Object.values(updatedWindows)
        .filter((window) => window.isOpen)
        .sort((a, b) => b.zIndex - a.zIndex);
      nextActive = remaining[0]?.id ?? null;
    } else {
      nextActive = activeWindowId;
    }

    set({
      windows: updatedWindows,
      activeWindowId: nextActive,
    });
  },
  focusWindow: (id) => {
    const { windows, zCounter, activeWindowId } = get();
    const target = windows[id];
    if (!target.isOpen || activeWindowId === id) {
      return;
    }

    const layer = nextZIndex(zCounter);
    set({
      activeWindowId: id,
      zCounter: layer.zCounter,
      windows: {
        ...windows,
        [id]: { ...target, zIndex: layer.zIndex },
      },
    });
  },
  moveWindow: (id, position) => {
    const { windows } = get();
    const target = windows[id];
    if (!target.isOpen) {
      return;
    }

    set({
      windows: {
        ...windows,
        [id]: { ...target, position },
      },
    });
  },
  resizeWindow: (id, size) => {
    const { windows } = get();
    const target = windows[id];
    if (!target.isOpen) {
      return;
    }

    set({
      windows: {
        ...windows,
        [id]: { ...target, size },
      },
    });
  },
  clearActiveWindow: () => set({ activeWindowId: null }),
}));
