"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Raycaster, Vector2 } from "three";

import {
  applySkyLookDelta,
  cancelSkyObjectTargeting,
} from "@/components/three/sky/CelestialCameraController";
import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { selectCelestialObject } from "@/features/astronomy/actions/selectCelestialObject";
import { useExperienceStore } from "@/state/experience-store";
import { applySkyFov, notifySkyUi, skyRuntime } from "@/state/sky-runtime";

interface SkyPointerControlsProps {
  /** Enable hover raycasts (fine pointer only). */
  enableHover: boolean;
  active: boolean;
}

interface ActivePointer {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  touch: boolean;
}

/**
 * Pointer drag navigation, pinch-to-zoom, and waypoint pick inside the R3F tree.
 *
 * - One finger / mouse: pan after drag threshold; tap selects.
 * - Two fingers: pinch zooms FOV; midpoint delta pans.
 * - Adding/removing fingers rebaselines so the camera does not jump.
 * - `touch-action: none` applies only on the canvas while controls are active.
 */
export function SkyPointerControls({
  enableHover,
  active,
}: SkyPointerControlsProps) {
  const getThree = useThree((state) => state.get);
  const raycaster = useRef(new Raycaster());
  const pointerNdc = useRef(new Vector2());
  const pointers = useRef(new Map<number, ActivePointer>());
  const gesture = useRef<{
    mode: "pending" | "pan" | "pinch";
    hitId: string | null;
    lastPinchDistance: number;
    lastMidX: number;
    lastMidY: number;
  }>({
    mode: "pending",
    hitId: null,
    lastPinchDistance: 0,
    lastMidX: 0,
    lastMidY: 0,
  });

  useEffect(() => {
    const { gl, camera, scene } = getThree();
    const el = gl.domElement;

    const setCursor = (value: string) => {
      el.style.cursor = value;
    };

    if (!active) {
      el.style.touchAction = "";
      setCursor("default");
      skyRuntime.isDragging = false;
      pointers.current.clear();
      gesture.current.mode = "pending";
      if (skyRuntime.hoveredObjectId) {
        skyRuntime.hoveredObjectId = null;
        notifySkyUi();
      }
      return;
    }

    el.style.touchAction = "none";

    const pickWaypoint = (clientX: number, clientY: number): string | null => {
      const rect = el.getBoundingClientRect();
      pointerNdc.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(pointerNdc.current, camera);
      const hits = raycaster.current.intersectObjects(scene.children, true);
      for (const hit of hits) {
        const id = hit.object.userData?.deepSkyId;
        if (typeof id === "string") {
          return id;
        }
      }
      return null;
    };

    const listPointers = () => Array.from(pointers.current.values());

    const midpoint = (pts: ActivePointer[]) => {
      const a = pts[0]!;
      const b = pts[1]!;
      return {
        x: (a.lastX + b.lastX) / 2,
        y: (a.lastY + b.lastY) / 2,
      };
    };

    const pinchDistance = (pts: ActivePointer[]) => {
      const a = pts[0]!;
      const b = pts[1]!;
      return Math.hypot(a.lastX - b.lastX, a.lastY - b.lastY);
    };

    const rebaselineGesture = () => {
      const pts = listPointers();
      if (pts.length >= 2) {
        const mid = midpoint(pts);
        gesture.current.mode = "pinch";
        gesture.current.lastPinchDistance = pinchDistance(pts);
        gesture.current.lastMidX = mid.x;
        gesture.current.lastMidY = mid.y;
        skyRuntime.isDragging = true;
        if (skyRuntime.cameraMode === "targeting") {
          cancelSkyObjectTargeting();
        }
        setCursor(SKY_NAVIGATION.cursorGrabbing);
        return;
      }
      const only = pts[0];
      if (only) {
        only.startX = only.lastX;
        only.startY = only.lastY;
        gesture.current.mode = "pending";
        skyRuntime.isDragging = false;
        return;
      }
      gesture.current.mode = "pending";
      skyRuntime.isDragging = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return;
      }
      if (useExperienceStore.getState().cameraOwner !== "sky") {
        return;
      }
      if (pointers.current.size >= 2) {
        return;
      }

      const hitId =
        pointers.current.size === 0
          ? pickWaypoint(event.clientX, event.clientY)
          : gesture.current.hitId;

      pointers.current.set(event.pointerId, {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        touch: event.pointerType === "touch",
      });

      if (pointers.current.size === 1) {
        gesture.current.hitId = hitId;
        gesture.current.mode = "pending";
      } else {
        rebaselineGesture();
      }

      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }

      if (event.cancelable && event.pointerType === "touch") {
        event.preventDefault();
      }

      setCursor(
        hitId && pointers.current.size === 1
          ? SKY_NAVIGATION.cursorPointer
          : SKY_NAVIGATION.cursorGrabbing,
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      if (useExperienceStore.getState().cameraOwner !== "sky") {
        return;
      }

      const pointer = pointers.current.get(event.pointerId);
      if (!pointer) {
        if (!enableHover || skyRuntime.isDragging) {
          return;
        }
        const hitId = pickWaypoint(event.clientX, event.clientY);
        if (hitId !== skyRuntime.hoveredObjectId) {
          skyRuntime.hoveredObjectId = hitId;
          setCursor(
            hitId ? SKY_NAVIGATION.cursorPointer : SKY_NAVIGATION.cursorGrab,
          );
          notifySkyUi();
        }
        return;
      }

      const prevX = pointer.lastX;
      const prevY = pointer.lastY;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;

      const pts = listPointers();

      if (pts.length >= 2) {
        if (gesture.current.mode !== "pinch") {
          rebaselineGesture();
        }
        const mid = midpoint(pts);
        const dist = pinchDistance(pts);
        const prevDist = gesture.current.lastPinchDistance || dist;
        applySkyFov(
          skyRuntime.fov +
            (prevDist - dist) * SKY_NAVIGATION.pinchZoomSensitivity,
        );
        gesture.current.lastPinchDistance = dist;

        const dx = mid.x - gesture.current.lastMidX;
        const dy = mid.y - gesture.current.lastMidY;
        gesture.current.lastMidX = mid.x;
        gesture.current.lastMidY = mid.y;
        if (dx !== 0 || dy !== 0) {
          applySkyLookDelta(dx, dy, true);
        }
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }

      const only = pts[0];
      if (!only) {
        return;
      }

      const total = Math.hypot(only.lastX - only.startX, only.lastY - only.startY);
      if (gesture.current.mode === "pending") {
        if (total < SKY_NAVIGATION.pointerDragThresholdPx) {
          return;
        }
        gesture.current.mode = "pan";
        skyRuntime.isDragging = true;
        if (skyRuntime.cameraMode === "targeting") {
          cancelSkyObjectTargeting();
        }
        setCursor(SKY_NAVIGATION.cursorGrabbing);
      }

      if (gesture.current.mode === "pan") {
        applySkyLookDelta(event.clientX - prevX, event.clientY - prevY, only.touch);
        if (event.cancelable && only.touch) {
          event.preventDefault();
        }
      }
    };

    const endPointer = (event: PointerEvent) => {
      const pointer = pointers.current.get(event.pointerId);
      if (!pointer) {
        return;
      }

      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }

      const wasPending = gesture.current.mode === "pending";
      const hitId = gesture.current.hitId;
      pointers.current.delete(event.pointerId);

      if (pointers.current.size === 0) {
        const shouldSelect = wasPending && Boolean(hitId);
        gesture.current.mode = "pending";
        gesture.current.hitId = null;
        skyRuntime.isDragging = false;

        if (shouldSelect && hitId) {
          selectCelestialObject(hitId, { focusCamera: true, updateUrl: true });
          notifySkyUi();
        }

        setCursor(
          skyRuntime.hoveredObjectId
            ? SKY_NAVIGATION.cursorPointer
            : SKY_NAVIGATION.cursorGrab,
        );
        return;
      }

      rebaselineGesture();
    };

    const onPointerLeave = () => {
      if (pointers.current.size === 0 && skyRuntime.hoveredObjectId) {
        skyRuntime.hoveredObjectId = null;
        notifySkyUi();
        setCursor(SKY_NAVIGATION.cursorGrab);
      }
    };

    const pointerMap = pointers.current;

    setCursor(SKY_NAVIGATION.cursorGrab);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endPointer);
    el.addEventListener("pointercancel", endPointer);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endPointer);
      el.removeEventListener("pointercancel", endPointer);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.style.touchAction = "";
      pointerMap.clear();
      skyRuntime.isDragging = false;
      setCursor("default");
    };
  }, [active, enableHover, getThree]);

  return null;
}
