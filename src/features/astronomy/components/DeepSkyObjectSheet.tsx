"use client";

import { useState } from "react";

import { DeepSkyObjectDetails } from "@/features/astronomy/components/DeepSkyObjectDetails";
import { clearCelestialObjectSelection } from "@/features/astronomy/actions/selectCelestialObject";
import type { CelestialObject } from "@/types/astronomy";
import { useExperienceStore } from "@/state/experience-store";

type SheetExtent = "partial" | "expanded";

interface DeepSkyObjectSheetProps {
  object: CelestialObject;
}

/**
 * Non-modal mobile bottom sheet. Expand/collapse via explicit controls
 * (no drag framework) to avoid fighting sky pan gestures.
 * Remount with `key={object.id}` from the parent to reset extent on retarget.
 */
export function DeepSkyObjectSheet({ object }: DeepSkyObjectSheetProps) {
  const reduceMotion = useExperienceStore((state) => state.reduceMotion);
  const [extent, setExtent] = useState<SheetExtent>("partial");
  const headingId = "dso-sheet-title";

  return (
    <div
      className={[
        "dso-sheet",
        `dso-sheet--${extent}`,
        reduceMotion ? "" : "dso-sheet--animated",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={headingId}
    >
      <div className="dso-sheet__handle" aria-hidden="true" />
      <div className="dso-sheet__chrome">
        <div className="dso-sheet__chrome-main">
          <p className="dso-sheet__eyebrow">Deep-sky object</p>
          <p className="dso-sheet__summary">{object.commonName}</p>
        </div>
        <div className="dso-sheet__chrome-actions">
          <button
            type="button"
            className="dso-sheet__extent"
            aria-expanded={extent === "expanded"}
            onClick={() =>
              setExtent((value) =>
                value === "partial" ? "expanded" : "partial",
              )
            }
          >
            {extent === "partial" ? "Expand" : "Collapse"}
          </button>
          <button
            type="button"
            className="dso-sheet__close"
            aria-label={`Close ${object.commonName} details`}
            onClick={() => clearCelestialObjectSelection()}
          >
            Close
          </button>
        </div>
      </div>
      <div className="dso-sheet__scroll">
        <DeepSkyObjectDetails object={object} headingId={headingId} />
      </div>
    </div>
  );
}
