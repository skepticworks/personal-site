"use client";

import { beginSkyObjectTargeting } from "@/components/three/sky/CelestialCameraController";
import { listDeepSkyObjects } from "@/features/astronomy/data/deep-sky-objects";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Keyboard-accessible deep-sky object browser (DOM equivalent of waypoints).
 * Selecting an item uses the same store + targeting path as raycast picks.
 */
export function DeepSkyObjectList() {
  const mode = useExperienceStore((state) => state.mode);
  const selectedId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );
  const selectCelestialObject = useExperienceStore(
    (state) => state.selectCelestialObject,
  );
  const canInteractWithSky = useExperienceStore(
    (state) => state.canInteractWithSky,
  );

  if (mode !== "sky" && !canInteractWithSky) {
    return null;
  }

  const objects = listDeepSkyObjects();

  return (
    <div className="sky-hud__object-list">
      <p className="sky-hud__list-heading" id="sky-object-list-label">
        Deep-sky targets
      </p>
      <ul
        className="sky-hud__list"
        aria-labelledby="sky-object-list-label"
      >
        {objects.map((object) => {
          const catalog = object.catalogIds[0];
          const label = catalog
            ? `${object.commonName} (${catalog.catalog}${catalog.id})`
            : object.commonName;
          const selected = object.id === selectedId;
          return (
            <li key={object.id}>
              <button
                type="button"
                className={
                  selected
                    ? "sky-hud__list-button sky-hud__list-button--selected"
                    : "sky-hud__list-button"
                }
                aria-pressed={selected}
                onClick={() => {
                  selectCelestialObject(object.id);
                  beginSkyObjectTargeting(object.id);
                }}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
