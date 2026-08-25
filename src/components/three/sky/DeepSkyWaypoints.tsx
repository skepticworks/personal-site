"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, DoubleSide, type Group, type Mesh, Vector3 } from "three";

import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { equatorialToCartesian } from "@/features/astronomy/coordinates/conversions";
import { listDeepSkyObjects } from "@/features/astronomy/data/deep-sky-objects";
import { useExperienceStore } from "@/state/experience-store";
import { skyRuntime } from "@/state/sky-runtime";

interface DeepSkyWaypointsProps {
  /** Coarse pointer → larger markers / hit targets. */
  touchFriendly: boolean;
}

interface WaypointEntry {
  id: string;
  position: Vector3;
  ring: Mesh | null;
  core: Mesh | null;
  hit: Mesh | null;
}

/**
 * Deep-sky waypoints as camera-facing reticles on the celestial sphere.
 * Domain IDs only — no Three objects in global app state.
 */
export function DeepSkyWaypoints({ touchFriendly }: DeepSkyWaypointsProps) {
  const groupRef = useRef<Group>(null);
  const entriesRef = useRef<WaypointEntry[]>([]);
  const objects = useMemo(() => listDeepSkyObjects(), []);

  const positions = useMemo(() => {
    const radius = SKY_NAVIGATION.celestialSphereRadius * 0.98;
    return objects.map((object) => {
      const c = equatorialToCartesian(object.coordinates, radius);
      return {
        id: object.id,
        position: new Vector3(c.x, c.y, c.z),
      };
    });
  }, [objects]);

  useFrame(({ camera }) => {
    const selected = useExperienceStore.getState().selectedCelestialObjectId;
    const hovered = skyRuntime.hoveredObjectId;
    const base = touchFriendly
      ? SKY_NAVIGATION.waypointBaseScale * 1.25
      : SKY_NAVIGATION.waypointBaseScale;

    const fovScale = skyRuntime.fov / SKY_NAVIGATION.defaultFov;
    const scaleMul = Math.min(1.6, Math.max(0.75, fovScale));

    for (const entry of entriesRef.current) {
      if (!entry.ring || !entry.core) {
        continue;
      }

      entry.ring.quaternion.copy(camera.quaternion);
      entry.core.quaternion.copy(camera.quaternion);
      if (entry.hit) {
        entry.hit.quaternion.copy(camera.quaternion);
      }

      let scale = base * scaleMul;
      let ringColor = "#8eb4c8";
      let coreColor = "#d7e6ef";
      let ringOpacity = 0.75;
      let coreOpacity = 0.9;

      if (entry.id === selected) {
        scale *= SKY_NAVIGATION.waypointSelectedScale;
        ringColor = "#e8c27a";
        coreColor = "#f3f6f8";
        ringOpacity = 1;
        coreOpacity = 1;
      } else if (entry.id === hovered) {
        scale *= SKY_NAVIGATION.waypointHoverScale;
        ringColor = "#c9852f";
        ringOpacity = 0.95;
      }

      entry.ring.scale.setScalar(scale);
      entry.core.scale.setScalar(scale * 0.35);

      const ringMat = entry.ring.material;
      const coreMat = entry.core.material;
      if ("color" in ringMat && ringMat.color instanceof Color) {
        ringMat.color.set(ringColor);
      }
      if ("opacity" in ringMat) {
        ringMat.opacity = ringOpacity;
      }
      if ("color" in coreMat && coreMat.color instanceof Color) {
        coreMat.color.set(coreColor);
      }
      if ("opacity" in coreMat) {
        coreMat.opacity = coreOpacity;
      }
    }
  });

  return (
    <group ref={groupRef} renderOrder={4}>
      {positions.map((item, index) => (
        <group key={item.id} position={item.position}>
          <mesh
            ref={(mesh) => {
              const existing = entriesRef.current[index];
              entriesRef.current[index] = {
                id: item.id,
                position: item.position,
                ring: mesh,
                core: existing?.core ?? null,
                hit: existing?.hit ?? null,
              };
            }}
            userData={{ deepSkyId: item.id, kind: "waypoint-ring" }}
            renderOrder={4}
          >
            <ringGeometry args={[0.55, 0.78, 24]} />
            <meshBasicMaterial
              color="#8eb4c8"
              transparent
              depthWrite={false}
              depthTest={false}
              opacity={0.75}
              side={DoubleSide}
            />
          </mesh>
          <mesh
            ref={(mesh) => {
              const existing = entriesRef.current[index];
              entriesRef.current[index] = {
                id: item.id,
                position: item.position,
                ring: existing?.ring ?? null,
                core: mesh,
                hit: existing?.hit ?? null,
              };
            }}
            userData={{ deepSkyId: item.id, kind: "waypoint-core" }}
            renderOrder={4}
          >
            <circleGeometry args={[0.22, 16]} />
            <meshBasicMaterial
              color="#d7e6ef"
              transparent
              depthWrite={false}
              depthTest={false}
              opacity={0.9}
            />
          </mesh>
          <mesh
            ref={(mesh) => {
              const existing = entriesRef.current[index];
              entriesRef.current[index] = {
                id: item.id,
                position: item.position,
                ring: existing?.ring ?? null,
                core: existing?.core ?? null,
                hit: mesh,
              };
            }}
            userData={{ deepSkyId: item.id, kind: "waypoint-hit" }}
            renderOrder={4}
          >
            <circleGeometry
              args={[
                touchFriendly
                  ? SKY_NAVIGATION.waypointHitRadiusTouch
                  : SKY_NAVIGATION.waypointHitRadius,
                16,
              ]}
            />
            <meshBasicMaterial
              transparent
              opacity={0}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
