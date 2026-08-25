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
import { notifySkyUi, skyRuntime } from "@/state/sky-runtime";

interface SkyPointerControlsProps {
  /** Enable hover raycasts (fine pointer only). */
  enableHover: boolean;
  active: boolean;
}

/**
 * Pointer drag navigation + waypoint pick inside the R3F tree.
 * Distinguishes tap (select) from drag (look) via movement threshold.
 *
 * Cursor feedback is applied on the experience sky container (not by mutating
 * the R3F `gl` object graph from React's perspective).
 */
export function SkyPointerControls({
  enableHover,
  active,
}: SkyPointerControlsProps) {
  const getThree = useThree((state) => state.get);
  const raycaster = useRef(new Raycaster());
  const pointerNdc = useRef(new Vector2());
  const gesture = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    dragging: boolean;
    hitId: string | null;
    touch: boolean;
  } | null>(null);

  useEffect(() => {
    const { gl, camera, scene } = getThree();
    const el = gl.domElement;

    const setCursor = (value: string) => {
      el.style.cursor = value;
    };

    if (!active) {
      setCursor("default");
      skyRuntime.isDragging = false;
      gesture.current = null;
      if (skyRuntime.hoveredObjectId) {
        skyRuntime.hoveredObjectId = null;
        notifySkyUi();
      }
      return;
    }

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

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return;
      }
      if (useExperienceStore.getState().cameraOwner !== "sky") {
        return;
      }

      const hitId = pickWaypoint(event.clientX, event.clientY);
      gesture.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        dragging: false,
        hitId,
        touch: event.pointerType === "touch",
      };

      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }
      setCursor(
        hitId ? SKY_NAVIGATION.cursorPointer : SKY_NAVIGATION.cursorGrabbing,
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      if (useExperienceStore.getState().cameraOwner !== "sky") {
        return;
      }

      const g = gesture.current;
      if (g && g.pointerId === event.pointerId) {
        const dx = event.clientX - g.lastX;
        const dy = event.clientY - g.lastY;
        g.lastX = event.clientX;
        g.lastY = event.clientY;

        const total = Math.hypot(
          event.clientX - g.startX,
          event.clientY - g.startY,
        );

        if (!g.dragging) {
          if (total < SKY_NAVIGATION.pointerDragThresholdPx) {
            return;
          }
          g.dragging = true;
          skyRuntime.isDragging = true;
          if (skyRuntime.cameraMode === "targeting") {
            cancelSkyObjectTargeting();
          }
          setCursor(SKY_NAVIGATION.cursorGrabbing);
        }

        applySkyLookDelta(dx, dy, g.touch);
        return;
      }

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
    };

    const endPointer = (event: PointerEvent) => {
      const g = gesture.current;
      if (!g || g.pointerId !== event.pointerId) {
        return;
      }

      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }

      const wasDrag = g.dragging;
      const hitId = g.hitId;
      gesture.current = null;
      skyRuntime.isDragging = false;

      if (!wasDrag && hitId) {
        selectCelestialObject(hitId, { focusCamera: true, updateUrl: true });
        notifySkyUi();
      }

      setCursor(
        skyRuntime.hoveredObjectId
          ? SKY_NAVIGATION.cursorPointer
          : SKY_NAVIGATION.cursorGrab,
      );
    };

    const onPointerLeave = () => {
      if (!gesture.current && skyRuntime.hoveredObjectId) {
        skyRuntime.hoveredObjectId = null;
        notifySkyUi();
        setCursor(SKY_NAVIGATION.cursorGrab);
      }
    };

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
      setCursor("default");
    };
  }, [active, enableHover, getThree]);

  return null;
}
