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
 * window manager (e.g. portfolio project deep links).
 *
 * Capture selection for the sky object interface lives in `experience-store`
 * (`selectedCaptureId` / `selectCapture`) so it can pause sky interaction with
 * the full-screen viewer.
 */
export const useApplicationStore = create<ApplicationState>((set) => ({
  selectedProjectId: null,
  selectedCaptureId: null,
  settings: {
    reduceMotion: false,
  },
  selectProject: (projectId) => set({ selectedProjectId: projectId }),
  /** @deprecated Prefer experience-store.selectCapture for sky capture UI. */
  selectCapture: (captureId) => set({ selectedCaptureId: captureId }),
  updateSettings: (patch) =>
    set((state) => ({
      settings: { ...state.settings, ...patch },
    })),
}));
