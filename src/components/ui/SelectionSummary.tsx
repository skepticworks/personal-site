"use client";

import { resolveCelestialObject } from "@/features/astronomy/resolve-celestial-object";
import { resolveCapture } from "@/features/captures/list-captures";
import { getProjectById } from "@/data/mock-projects";
import { formatEquatorialCoordinates } from "@/lib/format-coordinates";
import { useApplicationStore } from "@/state/application-store";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Demonstrates typed data flowing into the DOM shell from shared stores.
 * Not a final UI — scaffolding only.
 */
export function SelectionSummary() {
  const selectedProjectId = useApplicationStore(
    (state) => state.selectedProjectId,
  );
  const selectedCaptureId = useApplicationStore(
    (state) => state.selectedCaptureId,
  );
  const selectCapture = useApplicationStore((state) => state.selectCapture);
  const selectCelestialObject = useExperienceStore(
    (state) => state.selectCelestialObject,
  );
  const selectedCelestialObjectId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );

  const project = selectedProjectId
    ? getProjectById(selectedProjectId)
    : undefined;
  const capture = selectedCaptureId
    ? resolveCapture(selectedCaptureId)
    : undefined;
  const celestialObject = selectedCelestialObjectId
    ? resolveCelestialObject(selectedCelestialObjectId)
    : capture
      ? resolveCelestialObject(capture.targetObjectId)
      : undefined;

  return (
    <section aria-labelledby="selection-heading">
      <h2 id="selection-heading">Selection</h2>
      <dl>
        <div>
          <dt>Project</dt>
          <dd>{project?.title ?? "None"}</dd>
        </div>
        <div>
          <dt>Capture</dt>
          <dd>{capture?.title ?? "None"}</dd>
        </div>
        <div>
          <dt>Celestial target</dt>
          <dd>
            {celestialObject
              ? `${celestialObject.commonName} (${formatEquatorialCoordinates(celestialObject.coordinates)})`
              : "None"}
          </dd>
        </div>
      </dl>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => {
            selectCapture("cap-orion-nebula");
            selectCelestialObject("obj-m42");
          }}
        >
          Select Orion capture
        </button>
        <button
          type="button"
          onClick={() => {
            selectCapture("cap-andromeda");
            selectCelestialObject("obj-m31");
          }}
        >
          Select Andromeda capture
        </button>
      </div>
    </section>
  );
}
