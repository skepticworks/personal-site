/**
 * Mutable holders for high-frequency Three.js / R3F values.
 *
 * Keep camera orientation, pointer velocity, and similar per-frame data here
 * (or in React refs inside the canvas tree) so updates never trigger React
 * reconciliations. Wire these into Zustand only when a discrete UI event needs
 * a snapshot (e.g. "focus object", "reset view").
 *
 * Transition progress / desktop transforms live in
 * `src/experience/transition/transition-runtime.ts` for the same reason.
 */

export interface CameraOrientationSnapshot {
  /** Yaw in radians. */
  yaw: number;
  /** Pitch in radians. */
  pitch: number;
  /** Field of view in degrees. */
  fov: number;
}

export const cameraOrientationRef: { current: CameraOrientationSnapshot } = {
  current: {
    yaw: 0,
    pitch: 0,
    fov: 60,
  },
};

/**
 * Sky navigation writes the camera only when
 * `useExperienceStore.getState().cameraOwner === "sky"` and this flag is true.
 * During transition, `TransitionCameraController` owns the camera.
 */
export const skyNavigationActiveRef: { current: boolean } = {
  current: false,
};

/**
 * Hovered deep-sky object id for sky UI (updated on pointer move, not every frame).
 * Selection remains in `experience-store.selectedCelestialObjectId`.
 */
export const hoveredCelestialObjectIdRef: { current: string | null } = {
  current: null,
};
