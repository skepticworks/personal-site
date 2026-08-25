"use client";

import type { SkyRenderQualityPreference } from "@/config/sky-quality";
import { useExperienceStore } from "@/state/experience-store";
import { resetSkyNavigationGestures } from "@/state/sky-runtime";

/**
 * Keyboard-accessible enter/leave controls + sky quality preference.
 * Object inspection / search live in `DeepSkyObjectInterface`.
 */
export function ExperienceModeControls() {
  const mode = useExperienceStore((state) => state.mode);
  const requestEnterSky = useExperienceStore((state) => state.requestEnterSky);
  const requestEnterPortfolio = useExperienceStore(
    (state) => state.requestEnterPortfolio,
  );
  const qualityPref = useExperienceStore(
    (state) => state.skyRenderQualityPreference,
  );
  const setQualityPref = useExperienceStore(
    (state) => state.setSkyRenderQualityPreference,
  );
  const canInteractWithSky = useExperienceStore(
    (state) => state.canInteractWithSky,
  );

  const atPortfolio = mode === "portfolio";
  const showSkyHud = canInteractWithSky || mode === "sky";

  return (
    <div className="experience-mode-controls">
      {showSkyHud ? (
        <div className="sky-hud">
          <label className="sky-hud__quality">
            <span className="sky-hud__quality-label">Sky quality</span>
            <select
              className="sky-hud__quality-select"
              value={qualityPref}
              onChange={(event) => {
                setQualityPref(
                  event.target.value as SkyRenderQualityPreference,
                );
              }}
            >
              <option value="auto">Auto</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
      ) : null}

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
          onClick={() => {
            resetSkyNavigationGestures();
            requestEnterPortfolio();
          }}
        >
          Return to desktop
        </button>
      )}
    </div>
  );
}
