import {
  beginSkyObjectTargeting,
  cancelSkyObjectTargeting,
} from "@/components/three/sky/CelestialCameraController";
import { getObjectById } from "@/features/astronomy/selectors/objectSelectors";
import { setTargetProgress } from "@/experience/transition/transition-progress";
import { transitionRuntime } from "@/experience/transition/transition-runtime";
import { useExperienceStore } from "@/state/experience-store";
import { skyRuntime } from "@/state/sky-runtime";

export interface SelectCelestialObjectOptions {
  /** Request camera targeting (queued until the sky controller is ready). */
  focusCamera?: boolean;
  /**
   * Reserved for callers that apply URL → state. Selection→URL sync observes
   * the store directly; this flag is kept for API clarity at call sites.
   */
  updateUrl?: boolean;
  /**
   * Enter sky mode for direct-object deep links.
   * Skips / shortens the decorative desktop→sky transition.
   */
  enterSky?: boolean;
}

/**
 * Shared selection action for waypoints, search, URL deep links, and panel actions.
 *
 * All entry paths must converge here so selection, panel visibility, camera
 * targeting, and URL state stay coherent.
 */
export function selectCelestialObject(
  objectId: string | null,
  options: SelectCelestialObjectOptions = {},
): boolean {
  const {
    focusCamera = true,
    enterSky = false,
  } = options;

  if (objectId !== null) {
    const object = getObjectById(objectId);
    if (!object) {
      return false;
    }
  }

  useExperienceStore.getState().selectCelestialObject(objectId);

  if (enterSky && objectId) {
    enterSkyForObjectDeepLink();
  }

  if (objectId && focusCamera) {
    requestSkyObjectFocus(objectId);
  } else if (!objectId) {
    skyRuntime.pendingFocusObjectId = null;
    cancelSkyObjectTargeting();
  }

  return true;
}

/** Deselect without moving the camera. */
export function clearCelestialObjectSelection(
  options: Pick<SelectCelestialObjectOptions, "updateUrl"> = {},
): void {
  selectCelestialObject(null, {
    focusCamera: false,
    updateUrl: options.updateUrl ?? true,
  });
}

/**
 * Queue or immediately begin Milestone 4 camera targeting.
 * Does not calculate rotations — delegates to the sky camera controller.
 */
export function requestSkyObjectFocus(objectId: string): void {
  if (!getObjectById(objectId)) {
    return;
  }
  skyRuntime.pendingFocusObjectId = objectId;
  beginSkyObjectTargeting(objectId);
}

/**
 * Direct object URLs intentionally enter the sky experience.
 * Snap progress when reduced-motion is on; otherwise still snap so the user
 * is not forced through the full decorative transition before requested content.
 */
export function enterSkyForObjectDeepLink(): void {
  const snap = true;
  setTargetProgress(1, {
    direction: "to-sky",
    snapRendered: snap || transitionRuntime.reduceMotion,
  });
}

/** Flush a pending focus request once the sky camera owns navigation. */
export function flushPendingSkyObjectFocus(): void {
  const pending = skyRuntime.pendingFocusObjectId;
  if (!pending) {
    return;
  }
  beginSkyObjectTargeting(pending);
}
