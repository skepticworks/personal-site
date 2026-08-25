import { SKY_NAVIGATION } from "@/config/sky-navigation";
import type { Cartesian3 } from "@/features/astronomy/coordinates/conversions";
import { angularSeparationDegrees } from "@/features/astronomy/coordinates/angular";

export type WaypointVisualPriority =
  | "selected"
  | "hovered"
  | "ordinary"
  | "hidden";

export interface WaypointVisibilityInput {
  objectId: string;
  /** World-space direction (or position) of the waypoint. */
  worldDirection: Cartesian3;
  /** Camera forward direction. */
  cameraForward: Cartesian3;
  selectedId: string | null;
  hoveredId: string | null;
  /** NDC x in [-1, 1] when projected and in front; null if behind / invalid. */
  ndcX: number | null;
  ndcY: number | null;
  /** Camera FOV in degrees. */
  fov: number;
  maxOrdinaryLabels: number;
  /** Running list of ordinary candidates sorted by center distance (caller). */
  ordinaryRank: number;
}

export interface WaypointVisibilityResult {
  priority: WaypointVisualPriority;
  showMarker: boolean;
  showLabel: boolean;
}

/**
 * Centralized waypoint / label visibility policy.
 *
 * Priority: selected > hovered > ordinary visible > hidden
 * Labels never show for objects behind the camera.
 */
export function evaluateWaypointVisibility(
  input: WaypointVisibilityInput,
): WaypointVisibilityResult {
  const behind =
    input.ndcX === null ||
    input.ndcY === null ||
    input.worldDirection.x * input.cameraForward.x +
      input.worldDirection.y * input.cameraForward.y +
      input.worldDirection.z * input.cameraForward.z <=
      0;

  if (behind) {
    return { priority: "hidden", showMarker: false, showLabel: false };
  }

  const onScreen =
    Math.abs(input.ndcX!) <= 1.15 && Math.abs(input.ndcY!) <= 1.15;

  if (input.selectedId === input.objectId) {
    return { priority: "selected", showMarker: true, showLabel: true };
  }

  if (input.hoveredId === input.objectId) {
    return {
      priority: "hovered",
      showMarker: true,
      showLabel: true,
    };
  }

  if (!onScreen) {
    return { priority: "hidden", showMarker: false, showLabel: false };
  }

  // Widen label cone slightly when zoomed in
  const fovScale = SKY_NAVIGATION.defaultFov / Math.max(input.fov, 1);
  const cone =
    SKY_NAVIGATION.labelCenterConeDegrees * Math.min(1.6, Math.max(0.7, fovScale));

  const separation = angularSeparationDegrees(
    input.worldDirection,
    input.cameraForward,
  );

  const nearCenter = separation <= cone;
  const showOrdinaryLabel =
    nearCenter && input.ordinaryRank < input.maxOrdinaryLabels;

  return {
    priority: showOrdinaryLabel ? "ordinary" : "ordinary",
    showMarker: true,
    showLabel: showOrdinaryLabel,
  };
}
