"use client";

import { create } from "zustand";

import type { ApplicationPanel, ApplicationSection } from "@/types/experience";

export interface ApplicationSettings {
  reduceMotion: boolean;
  showExperienceDebug: boolean;
}

interface ApplicationState {
  activeSection: ApplicationSection;
  openPanels: ApplicationPanel[];
  selectedProjectId: string | null;
  selectedCaptureId: string | null;
  settings: ApplicationSettings;
  setActiveSection: (section: ApplicationSection) => void;
  openPanel: (panel: ApplicationPanel) => void;
  closePanel: (panel: ApplicationPanel) => void;
  selectProject: (projectId: string | null) => void;
  selectCapture: (captureId: string | null) => void;
  updateSettings: (patch: Partial<ApplicationSettings>) => void;
}

const initialSettings: ApplicationSettings = {
  reduceMotion: false,
  showExperienceDebug: true,
};

/**
 * UI-facing application state. Keep high-frequency render-loop values out of
 * this store — they belong near the Three.js layer (see experience store docs).
 */
export const useApplicationStore = create<ApplicationState>((set) => ({
  activeSection: "home",
  openPanels: [],
  selectedProjectId: "proj-personal-site",
  selectedCaptureId: "cap-orion-nebula",
  settings: initialSettings,
  setActiveSection: (section) => set({ activeSection: section }),
  openPanel: (panel) =>
    set((state) =>
      state.openPanels.includes(panel)
        ? state
        : { openPanels: [...state.openPanels, panel] },
    ),
  closePanel: (panel) =>
    set((state) => ({
      openPanels: state.openPanels.filter((item) => item !== panel),
    })),
  selectProject: (projectId) => set({ selectedProjectId: projectId }),
  selectCapture: (captureId) => set({ selectedCaptureId: captureId }),
  updateSettings: (patch) =>
    set((state) => ({
      settings: { ...state.settings, ...patch },
    })),
}));
