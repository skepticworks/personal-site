"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Points,
} from "three";

import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { equatorialToCartesian } from "@/features/astronomy/coordinates/conversions";
import { getStarsForRender } from "@/features/astronomy/data/stars";
import {
  colorIndexToRgb,
  magnitudeToIntensity,
  magnitudeToPointSize,
} from "@/features/astronomy/stars/magnitude";
import {
  subscribeTransitionVisual,
  type TransitionVisualSnapshot,
} from "@/experience/transition/transition-runtime";

interface StarFieldProps {
  starCount: number;
}

/**
 * Batched star field via THREE.Points.
 * Data is equatorial → cartesian; architecture ready for larger catalogs.
 */
export function StarField({ starCount }: StarFieldProps) {
  const pointsRef = useRef<Points>(null);
  const opacityRef = useRef(1);

  const geometry = useMemo(() => {
    const stars = getStarsForRender(starCount);
    const n = stars.length;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const radius = SKY_NAVIGATION.celestialSphereRadius;

    for (let i = 0; i < n; i += 1) {
      const star = stars[i]!;
      const p = equatorialToCartesian(star.coordinates, radius);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;

      const rgb = colorIndexToRgb(star.colorIndex);
      const intensity = magnitudeToIntensity(star.magnitude);
      colors[i * 3] = rgb.r * intensity;
      colors[i * 3 + 1] = rgb.g * intensity;
      colors[i * 3 + 2] = rgb.b * intensity;
      sizes[i] = magnitudeToPointSize(star.magnitude);
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("color", new BufferAttribute(colors, 3));
    geo.setAttribute("size", new BufferAttribute(sizes, 1));
    return geo;
  }, [starCount]);

  // Average size for PointsMaterial (per-vertex size needs a shader;
  // use magnitude-weighted mean for a single material size).
  const averageSize = useMemo(() => {
    const stars = getStarsForRender(starCount);
    if (stars.length === 0) {
      return 0.55;
    }
    let sum = 0;
    for (const star of stars) {
      sum += magnitudeToPointSize(star.magnitude);
    }
    return sum / stars.length;
  }, [starCount]);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot: TransitionVisualSnapshot) => {
      opacityRef.current = snapshot.starsOpacity;
    });
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

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
    <points
      ref={pointsRef}
      geometry={geometry}
      frustumCulled={false}
      // Paint after atmosphere/glow so transparent sort never veils the field.
      renderOrder={3}
    >
      <pointsMaterial
        vertexColors
        size={averageSize}
        // Celestial sphere: keep screen size stable while looking around.
        sizeAttenuation={false}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        blending={AdditiveBlending}
        opacity={1}
        color={new Color("#ffffff")}
      />
    </points>
  );
}
