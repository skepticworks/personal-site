"use client";

import { DeepSkyObjectPanel } from "@/features/astronomy/components/DeepSkyObjectPanel";
import { DeepSkyObjectSheet } from "@/features/astronomy/components/DeepSkyObjectSheet";
import { DeepSkySearch } from "@/features/astronomy/components/DeepSkySearch";
import { getObjectById } from "@/features/astronomy/selectors/objectSelectors";
import { formatCatalogIdentifier } from "@/features/astronomy/formatting/astronomyFormatting";
import { MOBILE_MEDIA_QUERY } from "@/experience/transition/transition-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Sky-mode deep-sky object interface: search + responsive inspection shell.
 * Panel visibility is derived from `selectedCelestialObjectId` (no redundant flag).
 */
export function DeepSkyObjectInterface() {
  const selectedId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );
  const canInteractWithSky = useExperienceStore(
    (state) => state.canInteractWithSky,
  );
  const mode = useExperienceStore((state) => state.mode);
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  const showSkyUi = canInteractWithSky || mode === "sky";
  if (!showSkyUi) {
    return null;
  }

  const object = selectedId ? getObjectById(selectedId) : undefined;

  return (
    <div className="dso-interface">
      <div className="dso-interface__search">
        <DeepSkySearch />
      </div>

      <SelectionAnnouncer objectId={selectedId} />

      {object ? (
        <div className="dso-interface__inspect">
          {isMobile ? (
            <DeepSkyObjectSheet key={object.id} object={object} />
          ) : (
            <DeepSkyObjectPanel object={object} />
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Restrained live region — announces meaningful selection changes only. */
function SelectionAnnouncer({ objectId }: { objectId: string | null }) {
  const message = buildSelectionAnnouncement(objectId);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}

function buildSelectionAnnouncement(objectId: string | null): string {
  if (!objectId) {
    return "";
  }
  const object = getObjectById(objectId);
  if (!object) {
    return "";
  }
  const catalog = object.catalogIds[0]
    ? formatCatalogIdentifier(object.catalogIds[0])
    : "";
  return catalog
    ? `Selected ${object.commonName}, ${catalog}`
    : `Selected ${object.commonName}`;
}
