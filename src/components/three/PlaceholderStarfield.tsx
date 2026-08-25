"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Points } from "three";
import { BufferAttribute, BufferGeometry, Color } from "three";

import {
  subscribeTransitionVisual,
  type TransitionVisualSnapshot,
} from "@/experience/transition/transition-runtime";

const STAR_COUNT = 1400;

/** Deterministic placeholder star positions (stable across remounts). */
function createStarGeometry(): BufferGeometry {
  const positions = new Float32Array(STAR_COUNT * 3);
  let seed = 0x2f6f78;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  for (let i = 0; i < STAR_COUNT; i += 1) {
    const theta = next() * Math.PI * 2;
    const phi = Math.acos(next()) * 0.5;
    const r = 40 + next() * 60;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(positions, 3));
  return geo;
}

const STAR_GEOMETRY = createStarGeometry();

/**
 * Lightweight placeholder starfield.
 *
 * Replaceable by the real astronomy renderer later — it only reads transition
 * visual opacity and does not own scroll, mode, or camera ownership.
 */
export function PlaceholderStarfield() {
  const pointsRef = useRef<Points>(null);
  const opacityRef = useRef(0);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot: TransitionVisualSnapshot) => {
      opacityRef.current = snapshot.starsOpacity;
    });
  }, []);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) {
      return;
    }
    const material = points.material;
    if ("opacity" in material) {
      material.opacity = opacityRef.current;
      material.visible = opacityRef.current > 0.001;
    }
  });

  return (
    <points ref={pointsRef} geometry={STAR_GEOMETRY} frustumCulled={false}>
      <pointsMaterial
        color={new Color("#e8eef5")}
        size={0.55}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0}
      />
    </points>
  );
}
