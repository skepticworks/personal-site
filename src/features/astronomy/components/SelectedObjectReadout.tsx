"use client";

import { resolveCelestialObject } from "@/features/astronomy/resolve-celestial-object";
import { formatEquatorialCoordinates } from "@/lib/format-coordinates";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Accessible DOM readout for the selected celestial object.
 * Validates DOM / WebGL separation — metadata is not WebGL-only.
 */
export function SelectedObjectReadout() {
  const selectedId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );
  const canInteractWithSky = useExperienceStore(
    (state) => state.canInteractWithSky,
  );

  if (!canInteractWithSky || !selectedId) {
    return null;
  }

  const object = resolveCelestialObject(selectedId);
  if (!object) {
    return null;
  }

  const catalog = object.catalogIds
    .map((entry) => `${entry.catalog}${entry.id}`)
    .join(" · ");

  return (
    <div
      className="sky-hud__readout"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 className="sky-hud__readout-title">{object.commonName}</h2>
      {catalog ? <p className="sky-hud__readout-line">{catalog}</p> : null}
      <p className="sky-hud__readout-line">
        {formatObjectType(object.objectType)}
      </p>
      <p className="sky-hud__readout-line">
        {formatEquatorialCoordinates(object.coordinates)}
      </p>
    </div>
  );
}

function formatObjectType(type: string): string {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
