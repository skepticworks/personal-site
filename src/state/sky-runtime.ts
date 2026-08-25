import type { SkyCameraMode } from "@/config/sky-navigation";
import { SKY_NAVIGATION } from "@/config/sky-navigation";
import type { SkyRenderQuality } from "@/config/sky-quality";
import {
  type Quat,
  identityQuat,
} from "@/features/astronomy/coordinates/camera-orientation";

/**
 * High-frequency sky navigation state (refs / mutables).
 * Do not mirror these into Zustand every frame.
 */

export interface SkyRuntimeState {
  cameraMode: SkyCameraMode;
  /** Active look orientation while sky owns the camera. */
  orientation: Quat;
  fov: number;
  hoveredObjectId: string | null;
  /** Object currently being targeted (may match selection). */
  targetingObjectId: string | null;
  /** True while pointer drag is rotating the sky. */
  isDragging: boolean;
  /** Resolved render quality for the active session. */
  quality: SkyRenderQuality;
  /** Count of waypoints with visible labels (debug). */
  visibleLabelCount: number;
  /**
   * When true, wheel-at-max-FOV may hand progress back to the transition.
   * Sky zoom consumes wheel first.
   */
  zoomAtMaxFov: boolean;
  zoomAtMinFov: boolean;
  /**
   * Object to focus once the sky camera controller is ready.
   * Used for deep links / selection before `cameraOwner === "sky"`.
   */
  pendingFocusObjectId: string | null;
}

export const skyRuntime: SkyRuntimeState = {
  cameraMode: "free",
  orientation: identityQuat(),
  fov: SKY_NAVIGATION.defaultFov,
  hoveredObjectId: null,
  targetingObjectId: null,
  isDragging: false,
  quality: "medium",
  visibleLabelCount: 0,
  zoomAtMaxFov: false,
  zoomAtMinFov: false,
  pendingFocusObjectId: null,
};

/** Listeners for discrete sky UI signals (not per-frame). */
type SkyUiListener = () => void;
const skyUiListeners = new Set<SkyUiListener>();

export function subscribeSkyUi(listener: SkyUiListener): () => void {
  skyUiListeners.add(listener);
  return () => {
    skyUiListeners.delete(listener);
  };
}

export function notifySkyUi(): void {
  skyUiListeners.forEach((listener) => listener());
}

export function resetSkyNavigationGestures(): void {
  skyRuntime.isDragging = false;
  skyRuntime.cameraMode = "free";
  skyRuntime.targetingObjectId = null;
  skyRuntime.pendingFocusObjectId = null;
  skyRuntime.hoveredObjectId = null;
  notifySkyUi();
}

/**
 * Seed sky orientation from the transition camera when ownership transfers.
 * Euler YXZ → quaternion matching TransitionCameraController.
 */
export function setSkyOrientationFromYawPitch(
  yaw: number,
  pitch: number,
): void {
  // YXZ intrinsic: q = qYaw * qPitch
  const halfYaw = yaw * 0.5;
  const halfPitch = pitch * 0.5;
  const cy = Math.cos(halfYaw);
  const sy = Math.sin(halfYaw);
  const cp = Math.cos(halfPitch);
  const sp = Math.sin(halfPitch);

  skyRuntime.orientation = {
    x: sp * cy,
    y: cp * sy,
    z: -sp * sy,
    w: cp * cy,
  };
}

export function applySkyFov(fov: number): number {
  const clamped = Math.min(
    SKY_NAVIGATION.maxFov,
    Math.max(SKY_NAVIGATION.minFov, fov),
  );
  skyRuntime.fov = clamped;
  skyRuntime.zoomAtMaxFov = clamped >= SKY_NAVIGATION.maxFov - 1e-3;
  skyRuntime.zoomAtMinFov = clamped <= SKY_NAVIGATION.minFov + 1e-3;
  return clamped;
}
