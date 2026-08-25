import type {
  CatalogIdentifier,
  CelestialObjectType,
  EquatorialCoordinates,
} from "@/types/astronomy";

/** Format RA hours as `05h 35m 17s` (whole seconds). */
export function formatRightAscension(hours: number): string {
  const wrapped = ((hours % 24) + 24) % 24;
  const h = Math.floor(wrapped);
  const minFloat = (wrapped - h) * 60;
  let m = Math.floor(minFloat);
  let s = Math.round((minFloat - m) * 60);
  if (s === 60) {
    s = 0;
    m += 1;
  }
  if (m === 60) {
    m = 0;
    return `${String((h + 1) % 24).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

/** Format declination as `−05° 23′ 28″` (whole arcseconds). */
export function formatDeclination(degrees: number): string {
  const sign = degrees < 0 ? "−" : "+";
  const abs = Math.min(90, Math.abs(degrees));
  const d = Math.floor(abs);
  const minFloat = (abs - d) * 60;
  let m = Math.floor(minFloat);
  let s = Math.round((minFloat - m) * 60);
  if (s === 60) {
    s = 0;
    m += 1;
  }
  if (m === 60) {
    m = 0;
    const nextD = d + 1;
    return `${sign}${String(nextD).padStart(2, "0")}° ${String(m).padStart(2, "0")}′ ${String(s).padStart(2, "0")}″`;
  }
  return `${sign}${String(d).padStart(2, "0")}° ${String(m).padStart(2, "0")}′ ${String(s).padStart(2, "0")}″`;
}

export function formatEquatorialDisplay(
  coordinates: EquatorialCoordinates,
): { ra: string; dec: string } {
  return {
    ra: formatRightAscension(coordinates.rightAscensionHours),
    dec: formatDeclination(coordinates.declinationDegrees),
  };
}

/**
 * Human-readable distance from light-years.
 * Uses thousand separators and scales to millions when appropriate.
 */
export function formatDistanceLy(distanceLy: number): string {
  if (!Number.isFinite(distanceLy) || distanceLy < 0) {
    return "";
  }
  if (distanceLy >= 1_000_000) {
    const millions = distanceLy / 1_000_000;
    const text =
      millions >= 10
        ? millions.toLocaleString("en-US", { maximumFractionDigits: 0 })
        : millions.toLocaleString("en-US", {
            maximumFractionDigits: 1,
            minimumFractionDigits: Number.isInteger(millions) ? 0 : 1,
          });
    return `${text} million light-years`;
  }
  return `${Math.round(distanceLy).toLocaleString("en-US")} light-years`;
}

/** Apparent magnitude with concise decimal formatting. */
export function formatMagnitude(magnitude: number): string {
  if (!Number.isFinite(magnitude)) {
    return "";
  }
  const digits = Number.isInteger(magnitude) ? 0 : 2;
  return magnitude.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

/**
 * Angular size from arcminutes — chooses ° / ′ / ″ as appropriate.
 */
export function formatAngularSizeArcmin(arcmin: number): string {
  if (!Number.isFinite(arcmin) || arcmin <= 0) {
    return "";
  }
  if (arcmin >= 60) {
    const degrees = arcmin / 60;
    const text = degrees.toLocaleString("en-US", {
      maximumFractionDigits: degrees >= 10 ? 1 : 2,
    });
    return `${text}°`;
  }
  if (arcmin >= 1) {
    const text = arcmin.toLocaleString("en-US", {
      maximumFractionDigits: arcmin >= 10 ? 0 : 1,
    });
    return `${text}′`;
  }
  const arcsec = arcmin * 60;
  return `${arcsec.toLocaleString("en-US", { maximumFractionDigits: 0 })}″`;
}

export function formatPhysicalSizeLy(sizeLy: number): string {
  if (!Number.isFinite(sizeLy) || sizeLy <= 0) {
    return "";
  }
  if (sizeLy >= 1000) {
    return `${Math.round(sizeLy).toLocaleString("en-US")} light-years across`;
  }
  const text = sizeLy.toLocaleString("en-US", {
    maximumFractionDigits: sizeLy >= 10 ? 0 : 1,
  });
  return `${text} light-years across`;
}

export function formatRedshift(z: number): string {
  if (!Number.isFinite(z)) {
    return "";
  }
  return z.toLocaleString("en-US", {
    maximumFractionDigits: 6,
    signDisplay: "exceptZero",
  });
}

export function formatCatalogIdentifier(entry: CatalogIdentifier): string {
  const catalog = entry.catalog.trim();
  const id = entry.id.trim();
  // Messier traditionally has no space: M31
  if (catalog.toUpperCase() === "M") {
    return `M${id}`;
  }
  return `${catalog} ${id}`;
}

export function formatCatalogList(
  entries: readonly CatalogIdentifier[],
  separator = " · ",
): string {
  return entries.map(formatCatalogIdentifier).join(separator);
}

const OBJECT_TYPE_LABELS: Record<CelestialObjectType, string> = {
  star: "Star",
  galaxy: "Galaxy",
  nebula: "Nebula",
  "planetary-nebula": "Planetary Nebula",
  "open-cluster": "Open Cluster",
  "globular-cluster": "Globular Cluster",
  "supernova-remnant": "Supernova Remnant",
  cluster: "Cluster",
  planet: "Planet",
  moon: "Moon",
  other: "Object",
};

export function formatObjectType(type: CelestialObjectType): string {
  return OBJECT_TYPE_LABELS[type] ?? titleCaseSlug(type);
}

function titleCaseSlug(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
