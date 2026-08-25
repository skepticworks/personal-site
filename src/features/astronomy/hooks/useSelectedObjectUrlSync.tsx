"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { selectCelestialObject } from "@/features/astronomy/actions/selectCelestialObject";
import { getObjectById } from "@/features/astronomy/selectors/objectSelectors";
import {
  CAPTURE_URL_PARAM,
  resolveCaptureFromSlugParam,
} from "@/features/astronomy/url/captureUrl";
import {
  OBJECT_URL_PARAM,
  resolveObjectFromSlugParam,
} from "@/features/astronomy/url/objectUrl";
import { getCapturesForObject } from "@/features/captures/selectors/captureSelectors";
import { useExperienceStore } from "@/state/experience-store";

function isDesktopFacingMode(mode: string): boolean {
  return mode === "portfolio" || mode === "transition-to-portfolio";
}

/**
 * Lightweight URL ↔ selection sync for deep-sky objects and optional captures.
 *
 * Model: `/?object=orion-nebula&capture=orion-2025-narrowband`
 *
 * Capture param is shareable but secondary — invalid/orphan capture slugs are
 * stripped without clearing a valid object selection.
 */
export function useSelectedObjectUrlSync(): void {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );
  const selectedCaptureId = useExperienceStore(
    (state) => state.selectedCaptureId,
  );
  const mode = useExperienceStore((state) => state.mode);

  const initializedFromUrl = useRef(false);
  /** Last object slug we wrote or intentionally mirrored — skip echo apply. */
  const syncedObjectSlugRef = useRef<string | null>(null);
  const syncedCaptureSlugRef = useRef<string | null>(null);
  const objectParam = searchParams.get(OBJECT_URL_PARAM);
  const captureParam = searchParams.get(CAPTURE_URL_PARAM);

  // Initial URL → selection (once on mount)
  useEffect(() => {
    if (initializedFromUrl.current) {
      return;
    }
    initializedFromUrl.current = true;

    if (!objectParam) {
      syncedObjectSlugRef.current = null;
      syncedCaptureSlugRef.current = null;
      if (captureParam) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(CAPTURE_URL_PARAM);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
      return;
    }

    const object = resolveObjectFromSlugParam(objectParam);
    if (!object) {
      syncedObjectSlugRef.current = null;
      syncedCaptureSlugRef.current = null;
      const params = new URLSearchParams(searchParams.toString());
      params.delete(OBJECT_URL_PARAM);
      params.delete(CAPTURE_URL_PARAM);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      return;
    }

    syncedObjectSlugRef.current = object.slug;
    const capture = resolveCaptureFromSlugParam(captureParam);
    selectCelestialObject(object.id, {
      focusCamera: true,
      updateUrl: false,
      enterSky: true,
      captureId:
        capture && capture.targetObjectId === object.id ? capture.id : undefined,
    });

    if (capture && capture.targetObjectId === object.id) {
      syncedCaptureSlugRef.current = capture.slug;
    } else {
      syncedCaptureSlugRef.current = null;
      if (captureParam) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(CAPTURE_URL_PARAM);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only hydrate
  }, []);

  // Selection → URL (sky modes only; clear params on portfolio / deselect)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentObjectParam = params.get(OBJECT_URL_PARAM);
    const currentCaptureParam = params.get(CAPTURE_URL_PARAM);

    if (isDesktopFacingMode(mode)) {
      if (mode === "portfolio" && (currentObjectParam || currentCaptureParam)) {
        syncedObjectSlugRef.current = null;
        syncedCaptureSlugRef.current = null;
        params.delete(OBJECT_URL_PARAM);
        params.delete(CAPTURE_URL_PARAM);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
      return;
    }

    if (mode !== "sky") {
      return;
    }

    if (!selectedId) {
      if (currentObjectParam || currentCaptureParam) {
        syncedObjectSlugRef.current = null;
        syncedCaptureSlugRef.current = null;
        params.delete(OBJECT_URL_PARAM);
        params.delete(CAPTURE_URL_PARAM);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      } else {
        syncedObjectSlugRef.current = null;
        syncedCaptureSlugRef.current = null;
      }
      return;
    }

    const object = getObjectById(selectedId);
    if (!object) {
      return;
    }

    let dirty = false;
    if (currentObjectParam !== object.slug) {
      syncedObjectSlugRef.current = object.slug;
      params.set(OBJECT_URL_PARAM, object.slug);
      dirty = true;
    } else {
      syncedObjectSlugRef.current = object.slug;
    }

    const captures = getCapturesForObject(object.id);
    const capture =
      selectedCaptureId &&
      captures.find((item) => item.id === selectedCaptureId);

    if (capture && captures.length > 1) {
      if (currentCaptureParam !== capture.slug) {
        syncedCaptureSlugRef.current = capture.slug;
        params.set(CAPTURE_URL_PARAM, capture.slug);
        dirty = true;
      } else {
        syncedCaptureSlugRef.current = capture.slug;
      }
    } else if (currentCaptureParam) {
      syncedCaptureSlugRef.current = null;
      params.delete(CAPTURE_URL_PARAM);
      dirty = true;
    } else {
      syncedCaptureSlugRef.current = null;
    }

    if (dirty) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [
    mode,
    pathname,
    router,
    searchParams,
    selectedCaptureId,
    selectedId,
  ]);

  // URL → selection: only when object/capture query strings change
  useEffect(() => {
    if (!initializedFromUrl.current) {
      return;
    }

    const currentMode = useExperienceStore.getState().mode;
    if (isDesktopFacingMode(currentMode)) {
      return;
    }

    const objectSlug = objectParam;
    const captureSlug = captureParam;

    if (
      objectSlug === syncedObjectSlugRef.current &&
      captureSlug === syncedCaptureSlugRef.current
    ) {
      return;
    }

    if (!objectSlug) {
      if (syncedObjectSlugRef.current !== null) {
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

    const object = resolveObjectFromSlugParam(objectSlug);
    if (!object) {
      return;
    }

    syncedObjectSlugRef.current = object.slug;
    const current = useExperienceStore.getState().selectedCelestialObjectId;
    const capture = resolveCaptureFromSlugParam(captureSlug);
    const nextCaptureId =
      capture && capture.targetObjectId === object.id ? capture.id : undefined;

    if (object.id !== current) {
      selectCelestialObject(object.id, {
        focusCamera: true,
        updateUrl: false,
        enterSky: false,
        captureId: nextCaptureId,
      });
    } else if (nextCaptureId) {
      syncedCaptureSlugRef.current = capture!.slug;
      if (
        useExperienceStore.getState().selectedCaptureId !== nextCaptureId
      ) {
        useExperienceStore.getState().selectCapture(nextCaptureId);
      }
    } else {
      syncedCaptureSlugRef.current = null;
    }
  }, [captureParam, objectParam]);
}
