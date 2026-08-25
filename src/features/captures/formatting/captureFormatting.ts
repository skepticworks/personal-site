import type {
  CaptureAcquisition,
  CaptureDateRange,
  CaptureEquipment,
  CaptureExposureGroup,
  CaptureLocation,
  LocationPrivacy,
} from "@/types/captures";

/** Resolve the effective capture date range from legacy or new fields. */
export function getCaptureDateRange(capture: {
  capturedAt?: string;
  captureStartDate?: string;
  captureEndDate?: string;
  /** Legacy nested range used during migration. */
  legacyCapturedAt?: CaptureDateRange;
}): CaptureDateRange | undefined {
  const start =
    capture.captureStartDate ??
    capture.capturedAt ??
    capture.legacyCapturedAt?.start;
  if (!start) {
    return undefined;
  }
  const end = capture.captureEndDate ?? capture.legacyCapturedAt?.end;
  return end && end !== start ? { start, end } : { start };
}

export function formatCaptureDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatCaptureDateRange(
  range: CaptureDateRange | undefined,
): string | undefined {
  if (!range) {
    return undefined;
  }
  const startLabel = formatCaptureDate(range.start);
  if (!range.end || range.end === range.start) {
    return startLabel;
  }
  return `${startLabel} – ${formatCaptureDate(range.end)}`;
}

/**
 * Total integration in seconds.
 * Prefers exposure groups when present; otherwise uses explicit total.
 * Throws if both exist and disagree.
 */
export function resolveIntegrationSeconds(
  acquisition: CaptureAcquisition,
): number | undefined {
  const fromGroups = sumExposureGroupSeconds(acquisition.exposureGroups);
  const explicit = acquisition.integrationSeconds;

  if (fromGroups !== undefined && explicit !== undefined) {
    if (fromGroups !== explicit) {
      throw new Error(
        `Conflicting integration totals: exposure groups sum to ${fromGroups}s but integrationSeconds is ${explicit}s`,
      );
    }
    return fromGroups;
  }

  if (fromGroups !== undefined) {
    return fromGroups;
  }

  if (explicit !== undefined) {
    return explicit;
  }

  const { subframeCount, subframeExposureSeconds } = acquisition;
  if (
    subframeCount !== undefined &&
    subframeExposureSeconds !== undefined
  ) {
    return subframeCount * subframeExposureSeconds;
  }

  return undefined;
}

export function sumExposureGroupSeconds(
  groups: CaptureExposureGroup[] | undefined,
): number | undefined {
  if (!groups || groups.length === 0) {
    return undefined;
  }
  return groups.reduce(
    (total, group) => total + group.exposureSeconds * group.frameCount,
    0,
  );
}

/** Formats seconds as compact human time (e.g. "4h 10m", "45m", "30s"). */
export function formatIntegrationTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "";
  }
  const whole = Math.round(totalSeconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = whole % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 && hours === 0) {
    parts.push(`${seconds}s`);
  }
  if (parts.length === 0) {
    return "0s";
  }
  return parts.join(" ");
}

export function formatExposureGroup(group: CaptureExposureGroup): string {
  const frames = `${group.frameCount} × ${formatExposureLength(group.exposureSeconds)}`;
  return group.filter ? `${group.filter}: ${frames}` : frames;
}

export function formatExposureGroups(
  groups: CaptureExposureGroup[] | undefined,
): string[] {
  if (!groups || groups.length === 0) {
    return [];
  }
  return groups.map(formatExposureGroup);
}

export function formatExposureLength(seconds: number): string {
  if (seconds >= 60 && seconds % 60 === 0) {
    return `${seconds / 60}m`;
  }
  return `${seconds}s`;
}

/** Compact acquisition summary lines for UI. */
export function formatAcquisitionSummary(
  acquisition: CaptureAcquisition,
): string[] {
  const lines: string[] = [];
  const groupLines = formatExposureGroups(acquisition.exposureGroups);
  if (groupLines.length > 0) {
    lines.push(...groupLines);
  } else if (
    acquisition.subframeCount !== undefined &&
    acquisition.subframeExposureSeconds !== undefined
  ) {
    lines.push(
      `${acquisition.subframeCount} × ${formatExposureLength(acquisition.subframeExposureSeconds)}`,
    );
  }

  if (acquisition.sensitivity) {
    lines.push(acquisition.sensitivity);
  }
  if (acquisition.binning) {
    lines.push(`Bin ${acquisition.binning}`);
  }
  return lines;
}

export function formatFilters(filters: string[] | undefined): string | undefined {
  if (!filters || filters.length === 0) {
    return undefined;
  }
  return filters.join(", ");
}

export interface EquipmentDisplayRow {
  label: string;
  value: string;
}

export function formatEquipmentRows(
  equipment: CaptureEquipment,
): EquipmentDisplayRow[] {
  const rows: EquipmentDisplayRow[] = [];
  if (equipment.telescope) {
    rows.push({ label: "Telescope", value: equipment.telescope });
  }
  if (equipment.lens) {
    rows.push({ label: "Lens", value: equipment.lens });
  }
  rows.push({ label: "Camera", value: equipment.camera });
  if (equipment.mount) {
    rows.push({ label: "Mount", value: equipment.mount });
  }
  if (equipment.reducer) {
    rows.push({ label: "Reducer / flattener", value: equipment.reducer });
  }
  if (equipment.guideScope) {
    rows.push({ label: "Guide scope", value: equipment.guideScope });
  }
  if (equipment.guideCamera) {
    rows.push({ label: "Guide camera", value: equipment.guideCamera });
  }
  if (equipment.focuser) {
    rows.push({ label: "Focuser", value: equipment.focuser });
  }
  const filters = formatFilters(equipment.filters);
  if (filters) {
    rows.push({ label: "Filters", value: filters });
  }
  if (equipment.accessories && equipment.accessories.length > 0) {
    rows.push({
      label: "Accessories",
      value: equipment.accessories.join(", "),
    });
  }
  return rows;
}

export function formatLocationLabel(
  location: CaptureLocation | undefined,
): string | undefined {
  if (!location || location.privacy === "hidden") {
    return undefined;
  }

  if (location.privacy === "region") {
    if (location.region) {
      return location.region;
    }
    const fromParts = [location.label, location.country]
      .filter(Boolean)
      .join(", ");
    return fromParts.length > 0 ? fromParts : undefined;
  }

  if (location.privacy === "approximate") {
    const text =
      location.region ??
      location.label ??
      formatApproximateCoordinates(location.approximateCoordinates);
    if (!text) {
      return undefined;
    }
    return location.approximateCoordinates
      ? `${text} (approximate)`
      : text;
  }

  // exact
  const exact = location.exactCoordinates;
  if (exact) {
    const coords = formatExactCoordinates(exact);
    const place =
      location.label ??
      location.region ??
      [location.country].filter(Boolean).join(", ");
    return place ? `${place} (${coords})` : coords;
  }

  return (
    location.label ??
    location.region ??
    location.country ??
    undefined
  );
}

export function formatApproximateCoordinates(
  coordinates: CaptureLocation["approximateCoordinates"],
): string | undefined {
  if (!coordinates) {
    return undefined;
  }
  return `${coordinates.latitudeDegrees.toFixed(1)}°, ${coordinates.longitudeDegrees.toFixed(1)}°`;
}

export function formatExactCoordinates(
  coordinates: NonNullable<CaptureLocation["exactCoordinates"]>,
): string {
  return `${coordinates.latitudeDegrees.toFixed(4)}°, ${coordinates.longitudeDegrees.toFixed(4)}°`;
}

export function assertLocationPrivacyShape(
  location: CaptureLocation,
): string | undefined {
  if (location.privacy !== "exact" && location.exactCoordinates) {
    return `Location privacy "${location.privacy}" must not include exactCoordinates`;
  }
  if (
    location.privacy === "hidden" &&
    (location.approximateCoordinates ||
      location.region ||
      location.label ||
      location.country)
  ) {
    // Soft guidance: hidden may still carry unused fields in authoring drafts,
    // but published data should omit them. Warn only on coordinates.
    if (location.approximateCoordinates || location.exactCoordinates) {
      return 'Location privacy "hidden" must not include coordinates';
    }
  }
  if (
    location.privacy === "approximate" &&
    !location.approximateCoordinates &&
    !location.region &&
    !location.label
  ) {
    return 'Location privacy "approximate" needs approximateCoordinates or a regional label';
  }
  return undefined;
}

export function isPublicLocationPrivacy(
  privacy: LocationPrivacy,
): boolean {
  return privacy !== "hidden";
}
