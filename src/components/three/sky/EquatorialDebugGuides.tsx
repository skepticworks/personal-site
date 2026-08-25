"use client";

import { useMemo } from "react";
import { BufferAttribute, BufferGeometry, Color } from "three";

import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { equatorialToCartesian } from "@/features/astronomy/coordinates/conversions";

/**
 * Development-only celestial reference markers (NCP, SCP, RA=0 / RA=6 equator).
 * Not mounted in production builds.
 */
export function EquatorialDebugGuides() {
  const radius = SKY_NAVIGATION.celestialSphereRadius * 0.92;

  const markers = useMemo(() => {
    return {
      north: equatorialToCartesian(
        { rightAscensionHours: 0, declinationDegrees: 90 },
        radius,
      ),
      south: equatorialToCartesian(
        { rightAscensionHours: 0, declinationDegrees: -90 },
        radius,
      ),
      ra0: equatorialToCartesian(
        { rightAscensionHours: 0, declinationDegrees: 0 },
        radius,
      ),
      ra6: equatorialToCartesian(
        { rightAscensionHours: 6, declinationDegrees: 0 },
        radius,
      ),
    };
  }, [radius]);

  const equatorGeometry = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 64; i += 1) {
      const ra = (i / 64) * 24;
      const p = equatorialToCartesian(
        { rightAscensionHours: ra, declinationDegrees: 0 },
        radius,
      );
      pts.push(p.x, p.y, p.z);
    }
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(pts), 3),
    );
    return geo;
  }, [radius]);

  return (
    <group>
      <mesh position={[markers.north.x, markers.north.y, markers.north.z]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshBasicMaterial color={new Color("#6ec8ff")} />
      </mesh>
      <mesh position={[markers.south.x, markers.south.y, markers.south.z]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshBasicMaterial color={new Color("#ff8e6e")} />
      </mesh>
      <mesh position={[markers.ra0.x, markers.ra0.y, markers.ra0.z]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color={new Color("#b8f0a8")} />
      </mesh>
      <mesh position={[markers.ra6.x, markers.ra6.y, markers.ra6.z]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color={new Color("#f0e0a8")} />
      </mesh>
      <lineLoop geometry={equatorGeometry}>
        <lineBasicMaterial
          color={new Color("#3d5a6c")}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </lineLoop>
    </group>
  );
}
