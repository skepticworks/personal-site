"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Camera, PerspectiveCamera } from "three";

import {
  subscribeTransitionVisual,
  transitionRuntime,
  type TransitionVisualSnapshot,
} from "@/experience/transition/transition-runtime";
import { useExperienceStore } from "@/state/experience-store";
import { cameraOrientationRef } from "@/state/three-runtime";

function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
  return "isPerspectiveCamera" in camera && Boolean(camera.isPerspectiveCamera);
}

/**
 * Applies transition-driven camera pose while `cameraOwner !== "sky"`.
 *
 * When ownership is `"sky"`, this controller stops writing so
 * `CelestialCameraController` can navigate without fighting the transition.
 */
export function TransitionCameraController() {
  const getCamera = useThree((state) => state.get);
  const visualRef = useRef<TransitionVisualSnapshot>(transitionRuntime.visual);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot) => {
      visualRef.current = snapshot;
    });
  }, []);

  useEffect(() => {
    const onResize = () => {
      const cam = getCamera().camera;
      if (isPerspectiveCamera(cam)) {
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getCamera]);

  useFrame(() => {
    const owner = useExperienceStore.getState().cameraOwner;
    if (owner === "sky") {
      return;
    }

    const cam = getCamera().camera;
    const visual = visualRef.current;
    cam.position.set(0, visual.cameraY, 0.15);
    cam.rotation.order = "YXZ";
    cam.rotation.x = visual.cameraPitch;
    cam.rotation.y = visual.cameraYaw;
    cam.rotation.z = 0;
    if (isPerspectiveCamera(cam)) {
      cam.fov = visual.cameraFov;
      cam.updateProjectionMatrix();
    }

    cameraOrientationRef.current = {
      yaw: visual.cameraYaw,
      pitch: visual.cameraPitch,
      fov: isPerspectiveCamera(cam) ? cam.fov : 60,
    };
  });

  return null;
}
