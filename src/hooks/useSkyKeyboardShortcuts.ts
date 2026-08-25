"use client";

import { useEffect } from "react";

import { cancelSkyObjectTargeting } from "@/components/three/sky/CelestialCameraController";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Escape cancels targeting / clears selection while sky is interactive,
 * without intercepting keystrokes in inputs.
 */
export function useSkyKeyboardShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) {
        return;
      }
      const state = useExperienceStore.getState();
      if (!state.canInteractWithSky) {
        return;
      }
      cancelSkyObjectTargeting();
      if (state.selectedCelestialObjectId) {
        state.selectCelestialObject(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
