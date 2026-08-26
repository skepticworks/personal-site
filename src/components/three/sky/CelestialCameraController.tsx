"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  type Camera,
  type PerspectiveCamera,
  Quaternion,
  Vector3,
} from "three";

import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { getLookQuaternionForCelestialTarget,
  quatAngularDistanceRadians,
  slerpQuat,
  type Quat,
} from "@/features/astronomy/coordinates/camera-orientation";
import { isValidEquatorialCoordinates } from "@/features/astronomy/coordinates/validate";
import { getDeepSkyObjectById } from "@/features/astronomy/data/deep-sky-objects";
import { useExperienceStore } from "@/state/experience-store";
import {
  applySkyFov,
  setSkyOrientationFromYawPitch,
  skyRuntime,
} from "@/state/sky-runtime";
import {
  cameraOrientationRef,
  skyNavigationActiveRef,
} from "@/state/three-runtime";

function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
  return "isPerspectiveCamera" in camera && Boolean(camera.isPerspectiveCamera);
}

const _q = new Quaternion();
const _forward = new Vector3();

function applyQuatToThree(q: Quat, target: Quaternion): void {
  target.set(q.x, q.y, q.z, q.w);
}

/**
 * Owns the camera exclusively while `cameraOwner === "sky"`.
 *
 * Modes: free → targeting → focused. Manual drag cancels targeting.
 * Orientation is preserved across sky ↔ desktop round-trips until a new
 * transition pose seeds it on the next ownership transfer.
 */
export function CelestialCameraController() {
  const get = useThree((state) => state.get);
  const wasSkyOwner = useRef(false);
  const targetQuat = useRef<Quat | null>(null);

  useEffect(() => {
    return () => {
      skyNavigationActiveRef.current = false;
    };
  }, []);

  useFrame((_, delta) => {
    const owner = useExperienceStore.getState().cameraOwner;
    const cam = get().camera;

    if (owner !== "sky") {
      if (wasSkyOwner.current) {
        skyNavigationActiveRef.current = false;
        skyRuntime.cameraMode = "free";
        skyRuntime.targetingObjectId = null;
        // Do not resume targeting when the user later re-enters the sky.
        skyRuntime.pendingFocusObjectId = null;
        skyRuntime.isDragging = false;
        targetQuat.current = null;
      }
      wasSkyOwner.current = false;
      return;
    }

    if (!wasSkyOwner.current) {
      // Take ownership: seed from transition pose, preserve prior sky FOV if set
      const snap = cameraOrientationRef.current;
      setSkyOrientationFromYawPitch(snap.yaw, snap.pitch);
      applySkyFov(skyRuntime.fov || snap.fov || SKY_NAVIGATION.defaultFov);
      skyNavigationActiveRef.current = true;
      wasSkyOwner.current = true;
      // Deep-link / pre-sky selection: focus once the controller owns the camera
      if (skyRuntime.pendingFocusObjectId) {
        const pendingId = skyRuntime.pendingFocusObjectId;
        const object = getDeepSkyObjectById(pendingId);
        if (object && isValidEquatorialCoordinates(object.coordinates)) {
          targetQuat.current = getLookQuaternionForCelestialTarget(
            object.coordinates,
          );
          skyRuntime.targetingObjectId = pendingId;
          skyRuntime.cameraMode = "targeting";
          skyRuntime.pendingFocusObjectId = null;
        }
      }
    }

    // Targeting interpolation
    if (
      skyRuntime.cameraMode === "targeting" &&
      targetQuat.current &&
      !skyRuntime.isDragging
    ) {
      const reduceMotion = useExperienceStore.getState().reduceMotion;
      const rate = reduceMotion
        ? SKY_NAVIGATION.targetingSlerpRateReducedMotion
        : SKY_NAVIGATION.targetingSlerpRate;
      const t = 1 - Math.exp(-rate * Math.min(delta, 0.1));
      skyRuntime.orientation = slerpQuat(
        skyRuntime.orientation,
        targetQuat.current,
        t,
      );

      const dist = quatAngularDistanceRadians(
        skyRuntime.orientation,
        targetQuat.current,
      );
      if (dist <= SKY_NAVIGATION.targetingCompleteRadians) {
        skyRuntime.orientation = targetQuat.current;
        skyRuntime.cameraMode = "focused";
        targetQuat.current = null;
      }
    }

    applyQuatToThree(skyRuntime.orientation, _q);
    cam.quaternion.copy(_q);
    cam.position.set(0, 0, 0);

    if (isPerspectiveCamera(cam)) {
      if (Math.abs(cam.fov - skyRuntime.fov) > 1e-4) {
        cam.fov = skyRuntime.fov;
        cam.updateProjectionMatrix();
      }
    }

    // Sync discrete orientation snapshot for debug / handoff (not React state)
    _forward.set(0, 0, -1).applyQuaternion(cam.quaternion);
    cameraOrientationRef.current = {
      yaw: Math.atan2(_forward.x, _forward.z),
      pitch: Math.asin(Math.min(1, Math.max(-1, _forward.y))),
      fov: isPerspectiveCamera(cam) ? cam.fov : skyRuntime.fov,
    };
  });

  // Expose imperative targeting via module-level helper registration
  useEffect(() => {
    beginSkyTargetingRef.current = (objectId: string) => {
      const object = getDeepSkyObjectById(objectId);
      if (!object || !isValidEquatorialCoordinates(object.coordinates)) {
        return;
      }
      // Only animate while sky owns the camera; otherwise keep pending.
      if (useExperienceStore.getState().cameraOwner !== "sky") {
        skyRuntime.pendingFocusObjectId = objectId;
        return;
      }
      targetQuat.current = getLookQuaternionForCelestialTarget(
        object.coordinates,
      );
      skyRuntime.targetingObjectId = objectId;
      skyRuntime.pendingFocusObjectId = null;
      skyRuntime.cameraMode = "targeting";
      // Soft FOV nudge toward targeting FOV
      if (!useExperienceStore.getState().reduceMotion) {
        applySkyFov(
          skyRuntime.fov * 0.85 + SKY_NAVIGATION.targetingFov * 0.15,
        );
      }
    };

    cancelSkyTargetingRef.current = () => {
      targetQuat.current = null;
      skyRuntime.targetingObjectId = null;
      skyRuntime.pendingFocusObjectId = null;
      if (
        skyRuntime.cameraMode === "targeting" ||
        skyRuntime.cameraMode === "focused"
      ) {
        skyRuntime.cameraMode = "free";
      }
    };

    // Flush any focus queued before the controller mounted
    if (
      skyRuntime.pendingFocusObjectId &&
      useExperienceStore.getState().cameraOwner === "sky"
    ) {
      beginSkyTargetingRef.current(skyRuntime.pendingFocusObjectId);
    }

    return () => {
      beginSkyTargetingRef.current = null;
      cancelSkyTargetingRef.current = null;
    };
  }, []);

  return null;
}

const beginSkyTargetingRef: {
  current: ((objectId: string) => void) | null;
} = { current: null };

const cancelSkyTargetingRef: { current: (() => void) | null } = {
  current: null,
};

export function beginSkyObjectTargeting(objectId: string): void {
  beginSkyTargetingRef.current?.(objectId);
}

export function cancelSkyObjectTargeting(): void {
  cancelSkyTargetingRef.current?.();
}

/** Apply incremental look rotation from pointer drag (world-Y + camera-right). */
export function applySkyLookDelta(dxPx: number, dyPx: number, touch: boolean): void {
  if (useExperienceStore.getState().cameraOwner !== "sky") {
    return;
  }

  if (skyRuntime.cameraMode === "targeting") {
    cancelSkyObjectTargeting();
    skyRuntime.cameraMode = "free";
  } else if (skyRuntime.cameraMode === "focused") {
    skyRuntime.cameraMode = "free";
  }

  const sens =
    SKY_NAVIGATION.dragSensitivity *
    (touch ? SKY_NAVIGATION.touchDragSensitivityScale : 1);

  const yaw = -dxPx * sens;
  const pitch = -dyPx * sens;

  const q = skyRuntime.orientation;
  const threeQ = new Quaternion(q.x, q.y, q.z, q.w);

  // Yaw around world up
  const yawQ = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), yaw);
  threeQ.premultiply(yawQ);

  // Pitch around camera local right
  const right = new Vector3(1, 0, 0).applyQuaternion(threeQ);
  const pitchQ = new Quaternion().setFromAxisAngle(right, pitch);
  threeQ.premultiply(pitchQ);
  threeQ.normalize();

  skyRuntime.orientation = {
    x: threeQ.x,
    y: threeQ.y,
    z: threeQ.z,
    w: threeQ.w,
  };
}
