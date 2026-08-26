"use client";

import { useId, useRef, useState } from "react";

import { DeepSkyObjectDetails } from "@/features/astronomy/components/DeepSkyObjectDetails";
import { clearCelestialObjectSelection } from "@/features/astronomy/actions/selectCelestialObject";
import type { CelestialObject } from "@/types/astronomy";
import { useExperienceStore } from "@/state/experience-store";

type SheetExtent = "collapsed" | "partial" | "expanded";

interface DeepSkyObjectSheetProps {
  object: CelestialObject;
}

const EXTENT_CYCLE: SheetExtent[] = ["collapsed", "partial", "expanded"];

/**
 * Non-modal mobile bottom sheet with collapsed / partial / expanded states.
 * Extent changes use explicit controls (not drag) to avoid fighting sky pan.
 * Remount with `key={object.id}` from the parent to reset extent on retarget.
 */
export function DeepSkyObjectSheet({ object }: DeepSkyObjectSheetProps) {
  const reduceMotion = useExperienceStore((state) => state.reduceMotion);
  const [extent, setExtent] = useState<SheetExtent>("partial");
  const headingId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);

  const expandLabel =
    extent === "collapsed"
      ? "Expand"
      : extent === "partial"
        ? "Expand fully"
        : "Collapse";

  const cycleExtent = () => {
    setExtent((current) => {
      const index = EXTENT_CYCLE.indexOf(current);
      const next = EXTENT_CYCLE[(index + 1) % EXTENT_CYCLE.length];
      return next ?? "partial";
    });
  };

  return (
    <div
      ref={sheetRef}
      className={[
        "dso-sheet",
        `dso-sheet--${extent}`,
        reduceMotion ? "" : "dso-sheet--animated",
      ]
        .filter(Boolean)
        .join(" ")}
      role="region"
      aria-labelledby={headingId}
    >
      <div className="dso-sheet__handle" aria-hidden="true" />
      <div className="dso-sheet__chrome">
        <div className="dso-sheet__chrome-main">
          <p className="dso-sheet__eyebrow">Deep-sky object</p>
          <p className="dso-sheet__summary" id={headingId}>
            {object.commonName}
          </p>
        </div>
        <div className="dso-sheet__chrome-actions">
          <button
            type="button"
            className="dso-sheet__extent"
            aria-expanded={extent !== "collapsed"}
            aria-controls={`dso-sheet-body-${object.id}`}
            onClick={cycleExtent}
          >
            {expandLabel}
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
      <div
        id={`dso-sheet-body-${object.id}`}
        className="dso-sheet__scroll"
        hidden={extent === "collapsed"}
      >
        <DeepSkyObjectDetails
          object={object}
          headingId={`${headingId}-details`}
        />
      </div>
    </div>
  );
}
