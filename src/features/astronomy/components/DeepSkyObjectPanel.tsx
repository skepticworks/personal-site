"use client";

import { DeepSkyObjectDetails } from "@/features/astronomy/components/DeepSkyObjectDetails";
import { clearCelestialObjectSelection } from "@/features/astronomy/actions/selectCelestialObject";
import type { CelestialObject } from "@/types/astronomy";
import { useExperienceStore } from "@/state/experience-store";

interface DeepSkyObjectPanelProps {
  object: CelestialObject;
}

/** Desktop / wide-viewport side panel for the selected deep-sky object. */
export function DeepSkyObjectPanel({ object }: DeepSkyObjectPanelProps) {
  const reduceMotion = useExperienceStore((state) => state.reduceMotion);
  const headingId = "dso-panel-title";

  return (
    <aside
      className={
        reduceMotion
          ? "dso-panel"
          : "dso-panel dso-panel--animated"
      }
      aria-labelledby={headingId}
    >
      <div className="dso-panel__chrome">
        <p className="dso-panel__eyebrow">Deep-sky object</p>
        <button
          type="button"
          className="dso-panel__close"
          aria-label={`Close ${object.commonName} details`}
          onClick={() => clearCelestialObjectSelection()}
        >
          Close
        </button>
      </div>
      <div className="dso-panel__scroll">
        <DeepSkyObjectDetails object={object} headingId={headingId} />
      </div>
    </aside>
  );
}
