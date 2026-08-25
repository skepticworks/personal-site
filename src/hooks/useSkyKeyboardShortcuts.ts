"use client";

import { useEffect } from "react";

import { clearCelestialObjectSelection } from "@/features/astronomy/actions/selectCelestialObject";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Escape cancels targeting / clears selection while sky is interactive,
 * without intercepting keystrokes in inputs or search.
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
      if (state.selectedCelestialObjectId) {
        clearCelestialObjectSelection();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
