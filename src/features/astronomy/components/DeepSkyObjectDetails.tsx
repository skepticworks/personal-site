"use client";

import { DeepSkyCatalogIds, DeepSkyObjectMetadata } from "@/features/astronomy/components/DeepSkyObjectMetadata";
import { DeepSkyObjectImage } from "@/features/astronomy/components/DeepSkyObjectImage";
import { requestSkyObjectFocus } from "@/features/astronomy/actions/selectCelestialObject";
import { getPreferredDisplayImage } from "@/features/astronomy/selectors/displayImage";
import { hasPersonalCapture } from "@/features/captures/selectors/captureSelectors";
import type { CelestialObject } from "@/types/astronomy";

interface DeepSkyObjectDetailsProps {
  object: CelestialObject;
  /** Optional heading id for aria-labelledby on the sheet/panel. */
  headingId?: string;
}

/**
 * Shared object inspection content — reused by desktop panel and mobile sheet.
 */
export function DeepSkyObjectDetails({
  object,
  headingId = "dso-details-title",
}: DeepSkyObjectDetailsProps) {
  const display = getPreferredDisplayImage(object.id);
  const photographed = hasPersonalCapture(object.id);

  return (
    <div className="dso-details">
      <DeepSkyObjectImage display={display} objectName={object.commonName} />

      <header className="dso-details__header">
        <h2 id={headingId} className="dso-details__title">
          {object.commonName}
        </h2>
        <DeepSkyCatalogIds object={object} />
        {photographed && display.kind !== "personal" ? (
          <p className="dso-details__photo-flag">Photographed by me</p>
        ) : null}
      </header>

      <DeepSkyObjectMetadata object={object} />

      {object.description ? (
        <section className="dso-details__section" aria-label="About">
          <h3 className="dso-details__section-title">About</h3>
          <p className="dso-details__prose">{object.description}</p>
        </section>
      ) : null}

      {object.observationalNotes ? (
        <section className="dso-details__section" aria-label="Observing">
          <h3 className="dso-details__section-title">What you are seeing</h3>
          <p className="dso-details__prose">{object.observationalNotes}</p>
        </section>
      ) : null}

      {object.discovery ? (
        <section className="dso-details__section" aria-label="History">
          <h3 className="dso-details__section-title">History</h3>
          <p className="dso-details__prose">{object.discovery}</p>
        </section>
      ) : null}

      <div className="dso-details__actions">
        <button
          type="button"
          className="dso-details__action"
          onClick={() => requestSkyObjectFocus(object.id)}
        >
          Center object
        </button>
      </div>
    </div>
  );
}
