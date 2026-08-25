"use client";

import { useExperienceStore } from "@/state/experience-store";
import type { ExperienceMode } from "@/types/experience";

/** Convenience hook for reading/updating the current experience mode. */
export function useExperienceMode(): {
  mode: ExperienceMode;
  enterSky: () => void;
  enterPortfolio: () => void;
  setMode: (mode: ExperienceMode) => void;
} {
  const mode = useExperienceStore((state) => state.mode);
  const enterSky = useExperienceStore((state) => state.enterSky);
  const enterPortfolio = useExperienceStore((state) => state.enterPortfolio);
  const setMode = useExperienceStore((state) => state.setMode);

  return { mode, enterSky, enterPortfolio, setMode };
}
