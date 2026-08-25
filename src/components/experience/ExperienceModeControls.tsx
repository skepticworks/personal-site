"use client";

import { useExperienceStore } from "@/state/experience-store";

/**
 * Keyboard-accessible enter/leave controls for the sky experience.
 * Complements scroll/swipe so motion is never the only path between modes.
 */
export function ExperienceModeControls() {
  const mode = useExperienceStore((state) => state.mode);
  const requestEnterSky = useExperienceStore((state) => state.requestEnterSky);
  const requestEnterPortfolio = useExperienceStore(
    (state) => state.requestEnterPortfolio,
  );

  const atPortfolio = mode === "portfolio";

  return (
    <div className="experience-mode-controls">
      {atPortfolio ? (
        <button
          type="button"
          className="experience-mode-controls__button"
          onClick={() => requestEnterSky()}
        >
          Explore the night sky
        </button>
      ) : (
        <button
          type="button"
          className="experience-mode-controls__button"
          onClick={() => requestEnterPortfolio()}
        >
          Return to desktop
        </button>
      )}
    </div>
  );
}
