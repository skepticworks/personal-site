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
import { isValidEquatorialCoordinates } from "@/features/astronomy/coordinates/validate";
import type { CelestialObject } from "@/types/astronomy";

interface DeepSkyObjectMetadataProps {
  object: CelestialObject;
}

interface MetaRow {
  label: string;
  value: string;
}

type MetaGroupId = "identity" | "coordinates" | "physical";

interface MetaGroup {
  id: MetaGroupId;
  label: string;
  rows: MetaRow[];
}

/**
 * Compact astronomy metadata with visual hierarchy:
 * identity → coordinates → supporting physical data.
 */
export function DeepSkyObjectMetadata({ object }: DeepSkyObjectMetadataProps) {
  const groups = buildGroups(object).filter((group) => group.rows.length > 0);
  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="dso-meta-groups">
      {groups.map((group) => (
        <section
          key={group.id}
          className={`dso-meta-group dso-meta-group--${group.id}`}
          aria-label={group.label}
        >
          <h3 className="dso-meta-group__label">{group.label}</h3>
          <dl className="dso-meta">
            {group.rows.map((row) => (
              <div key={row.label} className="dso-meta__row">
                <dt className="dso-meta__label">{row.label}</dt>
                <dd className="dso-meta__value">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function buildGroups(object: CelestialObject): MetaGroup[] {
  const identity: MetaRow[] = [
    {
      label: "Type",
      value: object.classificationSubtype
        ? `${formatObjectType(object.objectType)} · ${object.classificationSubtype}`
        : formatObjectType(object.objectType),
    },
  ];
  if (object.constellation) {
    identity.push({ label: "Constellation", value: object.constellation });
  }
  const magnitude =
    object.magnitude != null ? formatMagnitude(object.magnitude) : "";
  if (magnitude) {
    identity.push({ label: "Apparent magnitude", value: magnitude });
  }
  const distance =
    object.distanceLy != null ? formatDistanceLy(object.distanceLy) : "";
  if (distance) {
    identity.push({ label: "Distance", value: distance });
  }

  const coordinates: MetaRow[] = [];
  if (isValidEquatorialCoordinates(object.coordinates)) {
    coordinates.push({
      label: "Right ascension",
      value: formatRightAscension(object.coordinates.rightAscensionHours),
    });
    coordinates.push({
      label: "Declination",
      value: formatDeclination(object.coordinates.declinationDegrees),
    });
  } else {
    coordinates.push({ label: "Right ascension", value: "Unavailable" });
    coordinates.push({ label: "Declination", value: "Unavailable" });
  }

  const physical: MetaRow[] = [];
  const angular =
    object.angularSizeArcmin != null
      ? formatAngularSizeArcmin(object.angularSizeArcmin)
      : "";
  if (angular) {
    physical.push({ label: "Angular size", value: angular });
  }
  const size =
    object.physicalSizeLy != null
      ? formatPhysicalSizeLy(object.physicalSizeLy)
      : "";
  if (size) {
    physical.push({ label: "Physical size", value: size });
  }
  const redshift =
    object.redshift != null ? formatRedshift(object.redshift) : "";
  if (redshift) {
    physical.push({ label: "Redshift", value: redshift });
  }
  if (object.surfaceBrightness != null) {
    const sb = formatMagnitude(object.surfaceBrightness);
    if (sb) {
      physical.push({
        label: "Surface brightness",
        value: `${sb} mag/arcsec²`,
      });
    }
  }

  return [
    { id: "identity", label: "Overview", rows: identity },
    { id: "coordinates", label: "Coordinates (J2000)", rows: coordinates },
    { id: "physical", label: "Additional data", rows: physical },
  ];
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
