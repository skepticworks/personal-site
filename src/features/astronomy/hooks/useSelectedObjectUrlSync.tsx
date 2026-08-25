"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { selectCelestialObject } from "@/features/astronomy/actions/selectCelestialObject";
import { getObjectById } from "@/features/astronomy/selectors/objectSelectors";
import {
  OBJECT_URL_PARAM,
  resolveObjectFromSlugParam,
} from "@/features/astronomy/url/objectUrl";
import { useExperienceStore } from "@/state/experience-store";

function isDesktopFacingMode(mode: string): boolean {
  return mode === "portfolio" || mode === "transition-to-portfolio";
}

/**
 * Lightweight URL ↔ selection sync for deep-sky objects.
 *
 * Model: `/?object=andromeda-galaxy` (stable slug).
 *
 * Critical invariants:
 * - URL→selection reacts only to `object` query changes — never to mode
 *   changes. Re-entering the sky with a preserved selection must not treat a
 *   still-empty URL as a deselect / reselect+focus cycle.
 * - While a selection→URL write is in flight (`syncedSlugRef` set, param not
 *   updated yet), ignore a transient empty param.
 * - `enterSky` is mount-hydrate only.
 */
export function useSelectedObjectUrlSync(): void {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );
  const mode = useExperienceStore((state) => state.mode);

  const initializedFromUrl = useRef(false);
  /** Last slug we wrote or intentionally mirrored — skip echo apply. */
  const syncedSlugRef = useRef<string | null>(null);
  const objectParam = searchParams.get(OBJECT_URL_PARAM);

  // Initial URL → selection (once on mount)
  useEffect(() => {
    if (initializedFromUrl.current) {
      return;
    }
    initializedFromUrl.current = true;

    if (!objectParam) {
      syncedSlugRef.current = null;
      return;
    }

    const object = resolveObjectFromSlugParam(objectParam);
    if (!object) {
      syncedSlugRef.current = null;
      const params = new URLSearchParams(searchParams.toString());
      params.delete(OBJECT_URL_PARAM);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      return;
    }

    syncedSlugRef.current = object.slug;
    selectCelestialObject(object.id, {
      focusCamera: true,
      updateUrl: false,
      enterSky: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only hydrate
  }, []);

  // Selection → URL (sky modes only; clear param on portfolio / deselect)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentParam = params.get(OBJECT_URL_PARAM);

    if (isDesktopFacingMode(mode)) {
      if (mode === "portfolio" && currentParam) {
        syncedSlugRef.current = null;
        params.delete(OBJECT_URL_PARAM);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
      return;
    }

    // Only mirror into the URL once fully in sky — avoids mid-transition churn.
    if (mode !== "sky") {
      return;
    }

    if (!selectedId) {
      if (currentParam) {
        syncedSlugRef.current = null;
        params.delete(OBJECT_URL_PARAM);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      } else {
        syncedSlugRef.current = null;
      }
      return;
    }

    const object = getObjectById(selectedId);
    if (!object) {
      return;
    }

    if (currentParam === object.slug) {
      syncedSlugRef.current = object.slug;
      return;
    }

    syncedSlugRef.current = object.slug;
    params.set(OBJECT_URL_PARAM, object.slug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [mode, pathname, router, searchParams, selectedId]);

  // URL → selection: only when the object query string actually changes
  useEffect(() => {
    if (!initializedFromUrl.current) {
      return;
    }

    const currentMode = useExperienceStore.getState().mode;
    if (isDesktopFacingMode(currentMode)) {
      return;
    }

    const slug = objectParam;

    // Echo of our own write (or write still in flight with matching intent).
    if (slug === syncedSlugRef.current) {
      return;
    }

    if (!slug) {
      // Selection→URL may have just set syncedSlugRef and queued replace while
      // searchParams are still empty (sky re-entry). Do not deselect.
      if (syncedSlugRef.current !== null) {
        return;
      }

      const current = useExperienceStore.getState().selectedCelestialObjectId;
      if (current) {
        selectCelestialObject(null, {
          focusCamera: false,
          updateUrl: false,
        });
      }
      return;
    }

    const object = resolveObjectFromSlugParam(slug);
    if (!object) {
      return;
    }

    syncedSlugRef.current = object.slug;
    const current = useExperienceStore.getState().selectedCelestialObjectId;
    if (object.id === current) {
      // Already selected (e.g. preserved across desk round-trip) — restore URL
      // echo only; do not re-run camera targeting.
      return;
    }

    selectCelestialObject(object.id, {
      focusCamera: true,
      updateUrl: false,
      enterSky: false,
    });
    // Intentionally depend only on objectParam — mode changes must not re-apply
    // a stale empty URL when returning to the sky with a preserved selection.
  }, [objectParam]);
}
