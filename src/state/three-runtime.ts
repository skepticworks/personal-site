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
 * Future sky navigation should write here only when
 * `useExperienceStore.getState().cameraOwner === "sky"`.
 * During transition, `TransitionCameraController` owns the camera.
 */
export const skyNavigationActiveRef: { current: boolean } = {
  current: false,
};
