"use client";

import {
  formatAcquisitionSummary,
  formatCaptureDateRange,
  formatEquipmentRows,
  formatIntegrationTime,
  formatLocationLabel,
  getCaptureDateRange,
  resolveIntegrationSeconds,
} from "@/features/captures/formatting/captureFormatting";
import type { AstrophotographyCapture } from "@/types/captures";
import type { CelestialObject } from "@/types/astronomy";

interface CaptureDetailProps {
  capture: AstrophotographyCapture;
  object: CelestialObject;
  onOpenViewer: () => void;
}

/** Compact capture metadata for the object inspection panel. */
export function CaptureDetail({
  capture,
  object,
  onOpenViewer,
}: CaptureDetailProps) {
  const dateRange = formatCaptureDateRange(
    getCaptureDateRange({
      capturedAt: capture.capturedAt,
      captureStartDate: capture.captureStartDate,
      captureEndDate: capture.captureEndDate,
    }),
  );
  const integrationSeconds = (() => {
    try {
      return resolveIntegrationSeconds(capture.acquisition);
    } catch {
      return capture.acquisition.integrationSeconds;
    }
  })();
  const integration =
    integrationSeconds !== undefined
      ? formatIntegrationTime(integrationSeconds)
      : undefined;
  const acquisitionLines = formatAcquisitionSummary(capture.acquisition);
  const equipmentRows = formatEquipmentRows(capture.equipment);
  const location = formatLocationLabel(capture.location);
  const processingSoftware = capture.processing?.software;

  return (
    <section className="capture-detail" aria-label="Personal capture">
      <header className="capture-detail__header">
        <h3 className="capture-detail__title">{capture.title}</h3>
        <p className="capture-detail__target">Target: {object.commonName}</p>
      </header>

      <div className="capture-detail__actions">
        <button
          type="button"
          className="dso-details__action"
          onClick={onOpenViewer}
        >
          View full screen
        </button>
      </div>

      <dl className="dso-meta capture-detail__meta">
        {dateRange ? (
          <div className="dso-meta__row">
            <dt className="dso-meta__label">Captured</dt>
            <dd className="dso-meta__value">{dateRange}</dd>
          </div>
        ) : null}
        {integration ? (
          <div className="dso-meta__row">
            <dt className="dso-meta__label">Integration</dt>
            <dd className="dso-meta__value">{integration}</dd>
          </div>
        ) : null}
        {location ? (
          <div className="dso-meta__row">
            <dt className="dso-meta__label">Location</dt>
            <dd className="dso-meta__value">{location}</dd>
          </div>
        ) : null}
        {equipmentRows.map((row) => (
          <div className="dso-meta__row" key={row.label}>
            <dt className="dso-meta__label">{row.label}</dt>
            <dd className="dso-meta__value">{row.value}</dd>
          </div>
        ))}
        {processingSoftware && processingSoftware.length > 0 ? (
          <div className="dso-meta__row">
            <dt className="dso-meta__label">Processed with</dt>
            <dd className="dso-meta__value">
              {processingSoftware.join(", ")}
            </dd>
          </div>
        ) : null}
      </dl>

      {acquisitionLines.length > 0 ? (
        <div className="capture-detail__block">
          <h4 className="dso-details__section-title">Acquisition</h4>
          <ul className="capture-detail__list">
            {acquisitionLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {capture.notes ? (
        <div className="capture-detail__block">
          <h4 className="dso-details__section-title">Notes</h4>
          <p className="dso-details__prose">{capture.notes}</p>
        </div>
      ) : null}

      {capture.processing?.notes ? (
        <div className="capture-detail__block">
          <h4 className="dso-details__section-title">Processing notes</h4>
          <p className="dso-details__prose">{capture.processing.notes}</p>
        </div>
      ) : null}

      {capture.description ? (
        <div className="capture-detail__block">
          <h4 className="dso-details__section-title">About this capture</h4>
          <p className="dso-details__prose">{capture.description}</p>
        </div>
      ) : null}
    </section>
  );
}
