import {
  formatAngularSizeArcmin,
  formatCatalogIdentifier,
  formatDeclination,
  formatDistanceLy,
  formatMagnitude,
  formatObjectType,
  formatPhysicalSizeLy,
  formatRedshift,
  formatRightAscension,
} from "@/features/astronomy/formatting/astronomyFormatting";
import type { CelestialObject } from "@/types/astronomy";

interface DeepSkyObjectMetadataProps {
  object: CelestialObject;
}

interface MetaRow {
  label: string;
  value: string;
}

/**
 * Compact astronomy metadata grid. Omits unavailable fields (no "N/A" rows).
 */
export function DeepSkyObjectMetadata({ object }: DeepSkyObjectMetadataProps) {
  const rows = buildRows(object);
  if (rows.length === 0) {
    return null;
  }

  return (
    <dl className="dso-meta">
      {rows.map((row) => (
        <div key={row.label} className="dso-meta__row">
          <dt className="dso-meta__label">{row.label}</dt>
          <dd className="dso-meta__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function buildRows(object: CelestialObject): MetaRow[] {
  const rows: MetaRow[] = [];

  rows.push({
    label: "Type",
    value: object.classificationSubtype
      ? `${formatObjectType(object.objectType)} · ${object.classificationSubtype}`
      : formatObjectType(object.objectType),
  });

  if (object.constellation) {
    rows.push({ label: "Constellation", value: object.constellation });
  }
  if (object.distanceLy != null) {
    rows.push({
      label: "Distance",
      value: formatDistanceLy(object.distanceLy),
    });
  }
  if (object.magnitude != null) {
    rows.push({
      label: "Apparent magnitude",
      value: formatMagnitude(object.magnitude),
    });
  }
  rows.push({
    label: "Right ascension",
    value: formatRightAscension(object.coordinates.rightAscensionHours),
  });
  rows.push({
    label: "Declination",
    value: formatDeclination(object.coordinates.declinationDegrees),
  });
  if (object.angularSizeArcmin != null) {
    rows.push({
      label: "Angular size",
      value: formatAngularSizeArcmin(object.angularSizeArcmin),
    });
  }
  if (object.physicalSizeLy != null) {
    rows.push({
      label: "Physical size",
      value: formatPhysicalSizeLy(object.physicalSizeLy),
    });
  }
  if (object.redshift != null) {
    rows.push({
      label: "Redshift",
      value: formatRedshift(object.redshift),
    });
  }
  if (object.surfaceBrightness != null) {
    rows.push({
      label: "Surface brightness",
      value: `${formatMagnitude(object.surfaceBrightness)} mag/arcsec²`,
    });
  }

  return rows;
}

/** Primary + secondary catalog ID presentation. */
export function DeepSkyCatalogIds({ object }: DeepSkyObjectMetadataProps) {
  if (object.catalogIds.length === 0) {
    return null;
  }

  const primary = object.catalogIds[0];
  if (!primary) {
    return null;
  }
  const rest = object.catalogIds.slice(1);
  return (
    <div className="dso-catalogs">
      <p className="dso-catalogs__primary">
        {formatCatalogIdentifier(primary)}
        {rest[0] ? (
          <span className="dso-catalogs__secondary">
            {" "}
            · {formatCatalogIdentifier(rest[0])}
          </span>
        ) : null}
      </p>
      {rest.length > 1 ? (
        <p className="dso-catalogs__more">
          {rest
            .slice(1)
            .map(formatCatalogIdentifier)
            .join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
