"use client";

import { useMemo } from "react";

import { CaptureDetail } from "@/features/captures/components/CaptureDetail";
import { CaptureSwitcher } from "@/features/captures/components/CaptureSwitcher";
import {
  getCapturesForObject,
  getFeaturedCaptureForObject,
  sortCapturesByRecency,
} from "@/features/captures/selectors/captureSelectors";
import type { CelestialObject } from "@/types/astronomy";
import { useExperienceStore } from "@/state/experience-store";

interface ObjectCaptureSectionProps {
  object: CelestialObject;
  onOpenViewer: () => void;
}

/**
 * Personal capture list + detail for the selected deep-sky object.
 * Capture switching syncs into the experience store for imagery + URL deep links.
 */
export function ObjectCaptureSection({
  object,
  onOpenViewer,
}: ObjectCaptureSectionProps) {
  const captures = useMemo(
    () => sortCapturesByRecency(getCapturesForObject(object.id)),
    [object.id],
  );
  const selectedCaptureId = useExperienceStore(
    (state) => state.selectedCaptureId,
  );
  const selectCapture = useExperienceStore((state) => state.selectCapture);

  const activeCapture = useMemo(() => {
    if (captures.length === 0) {
      return undefined;
    }
    return (
      captures.find((capture) => capture.id === selectedCaptureId) ??
      getFeaturedCaptureForObject(object.id) ??
      captures[0]
    );
  }, [captures, object.id, selectedCaptureId]);

  if (!activeCapture) {
    return null;
  }

  return (
    <section className="capture-section" aria-label="Personal photography">
      <div className="capture-section__intro">
        <p className="dso-details__photo-flag">Photographed by me</p>
        {captures.length > 1 ? (
          <p className="capture-section__count">
            {captures.length} captures
          </p>
        ) : null}
      </div>

      <CaptureSwitcher
        captures={captures}
        selectedCaptureId={activeCapture.id}
        onSelect={(id) => selectCapture(id)}
      />

      <CaptureDetail
        capture={activeCapture}
        object={object}
        onOpenViewer={onOpenViewer}
      />
    </section>
  );
}
