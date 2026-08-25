"use client";

import { create } from "zustand";

export interface ApplicationSettings {
  reduceMotion: boolean;
}

interface ApplicationState {
  selectedProjectId: string | null;
  selectedCaptureId: string | null;
  settings: ApplicationSettings;
  selectProject: (projectId: string | null) => void;
  selectCapture: (captureId: string | null) => void;
  updateSettings: (patch: Partial<ApplicationSettings>) => void;
}

/**
 * Cross-cutting application selections/settings shared outside the desktop
 * window manager (e.g. future sky ↔ portfolio deep links).
 */
export const useApplicationStore = create<ApplicationState>((set) => ({
  selectedProjectId: null,
  selectedCaptureId: null,
  settings: {
    reduceMotion: false,
  },
  selectProject: (projectId) => set({ selectedProjectId: projectId }),
  selectCapture: (captureId) => set({ selectedCaptureId: captureId }),
  updateSettings: (patch) =>
    set((state) => ({
      settings: { ...state.settings, ...patch },
    })),
}));
