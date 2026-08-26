"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, DoubleSide, type Group, type Mesh, Vector3 } from "three";

import { MOTION } from "@/config/motion";
import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { equatorialToCartesian } from "@/features/astronomy/coordinates/conversions";
import { isValidEquatorialCoordinates } from "@/features/astronomy/coordinates/validate";
import { listDeepSkyObjects } from "@/features/astronomy/data/deep-sky-objects";
import {
  getCaptureCountForObject,
  hasPersonalCapture,
} from "@/features/captures/selectors/captureSelectors";
import { useExperienceStore } from "@/state/experience-store";
import { skyRuntime } from "@/state/sky-runtime";

interface DeepSkyWaypointsProps {
  /** Coarse pointer → larger markers / hit targets. */
  touchFriendly: boolean;
}

type WaypointKind = "reference" | "personal" | "multi";

interface WaypointEntry {
  id: string;
  kind: WaypointKind;
  position: Vector3;
  ring: Mesh | null;
  core: Mesh | null;
  reticle: Mesh | null;
  hit: Mesh | null;
}

const COLORS = {
  referenceRing: "#7fa3b8",
  referenceCore: "#c5d7e4",
  personalRing: "#b8924a",
  personalCore: "#e8c27a",
  multiRing: "#c9852f",
  hoverRing: "#d4a04a",
  selectedRing: "#e8c27a",
  selectedCore: "#f3f6f8",
  searchRing: "#9ec4d8",
  reticle: "#e8c27a",
} as const;

/**
 * Deep-sky waypoints as camera-facing reticles on the celestial sphere.
 *
 * Visual hierarchy:
 * - reference-only → cool ring
 * - personal capture → amber core
 * - multiple captures → warmer outer ring
 * - search hit / hover / selected overlay those base styles
 */
export function DeepSkyWaypoints({ touchFriendly }: DeepSkyWaypointsProps) {
  const groupRef = useRef<Group>(null);
  const entriesRef = useRef<WaypointEntry[]>([]);
  const objects = useMemo(() => listDeepSkyObjects(), []);
  const reduceMotion = useExperienceStore((state) => state.reduceMotion);

  const positions = useMemo(() => {
    const radius = SKY_NAVIGATION.celestialSphereRadius * 0.98;
    const placed: Array<{
      id: string;
      kind: WaypointKind;
      position: Vector3;
    }> = [];
    for (const object of objects) {
      if (!isValidEquatorialCoordinates(object.coordinates)) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[DeepSkyWaypoints] skipping invalid coordinates for ${object.id}`,
          );
        }
        continue;
      }
      try {
        const c = equatorialToCartesian(object.coordinates, radius);
        const captureCount = getCaptureCountForObject(object.id);
        const kind: WaypointKind =
          captureCount > 1
            ? "multi"
            : hasPersonalCapture(object.id)
              ? "personal"
              : "reference";
        placed.push({
          id: object.id,
          kind,
          position: new Vector3(c.x, c.y, c.z),
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[DeepSkyWaypoints] placement failed for ${object.id}`,
            error,
          );
        }
      }
    }
    return placed;
  }, [objects]);

  useFrame(({ camera }, delta) => {
    const selected = useExperienceStore.getState().selectedCelestialObjectId;
    const hovered = skyRuntime.hoveredObjectId;
    const searchHits = skyRuntime.searchHighlightObjectIds;
    const base = touchFriendly
      ? SKY_NAVIGATION.waypointBaseScale * 1.25
      : SKY_NAVIGATION.waypointBaseScale;

    const fovScale = skyRuntime.fov / SKY_NAVIGATION.defaultFov;
    const scaleMul = Math.min(1.6, Math.max(0.75, fovScale));

    const pulse =
      reduceMotion || !selected
        ? 1
        : 0.82 +
          0.18 *
            (0.5 +
              0.5 *
                Math.sin(
                  (performance.now() / MOTION.selectionPulseMs) * Math.PI * 2,
                ));

    void delta;

    for (const entry of entriesRef.current) {
      if (!entry.ring || !entry.core) {
        continue;
      }

      entry.ring.quaternion.copy(camera.quaternion);
      entry.core.quaternion.copy(camera.quaternion);
      if (entry.reticle) {
        entry.reticle.quaternion.copy(camera.quaternion);
      }
      if (entry.hit) {
        entry.hit.quaternion.copy(camera.quaternion);
      }

      let scale = base * scaleMul;
      let ringColor: string = COLORS.referenceRing;
      let coreColor: string = COLORS.referenceCore;
      let ringOpacity = 0.62;
      let coreOpacity = 0.78;
      let reticleVisible = false;
      let reticleOpacity = 0;

      if (entry.kind === "personal") {
        ringColor = COLORS.personalRing;
        coreColor = COLORS.personalCore;
        ringOpacity = 0.78;
        coreOpacity = 0.92;
      } else if (entry.kind === "multi") {
        ringColor = COLORS.multiRing;
        coreColor = COLORS.personalCore;
        ringOpacity = 0.88;
        coreOpacity = 0.95;
        scale *= 1.06;
      }

      const inSearch = searchHits.includes(entry.id);
      if (inSearch && entry.id !== selected) {
        ringColor = COLORS.searchRing;
        ringOpacity = Math.max(ringOpacity, 0.9);
        scale *= 1.08;
      }

      if (entry.id === selected) {
        scale *= SKY_NAVIGATION.waypointSelectedScale;
        ringColor = COLORS.selectedRing;
        coreColor = COLORS.selectedCore;
        ringOpacity = 1;
        coreOpacity = 1;
        reticleVisible = true;
        reticleOpacity = 0.55 * pulse;
      } else if (entry.id === hovered) {
        scale *= SKY_NAVIGATION.waypointHoverScale;
        ringColor = COLORS.hoverRing;
        ringOpacity = 0.95;
      }

      entry.ring.scale.setScalar(scale);
      entry.core.scale.setScalar(
        scale * (entry.kind === "reference" ? 0.32 : 0.38),
      );

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

      if (entry.reticle) {
        entry.reticle.visible = reticleVisible;
        entry.reticle.scale.setScalar(scale * 1.35);
        const reticleMat = entry.reticle.material;
        if ("opacity" in reticleMat) {
          reticleMat.opacity = reticleOpacity;
        }
        if ("color" in reticleMat && reticleMat.color instanceof Color) {
          reticleMat.color.set(COLORS.reticle);
        }
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
                kind: item.kind,
                position: item.position,
                ring: mesh,
                core: existing?.core ?? null,
                reticle: existing?.reticle ?? null,
                hit: existing?.hit ?? null,
              };
            }}
            userData={{ deepSkyId: item.id, kind: "waypoint-ring" }}
            renderOrder={4}
          >
            <ringGeometry
              args={
                item.kind === "multi" ? [0.5, 0.82, 28] : [0.55, 0.76, 24]
              }
            />
            <meshBasicMaterial
              color={
                item.kind === "reference"
                  ? COLORS.referenceRing
                  : COLORS.personalRing
              }
              transparent
              depthWrite={false}
              depthTest={false}
              opacity={0.7}
              side={DoubleSide}
            />
          </mesh>
          <mesh
            ref={(mesh) => {
              const existing = entriesRef.current[index];
              entriesRef.current[index] = {
                id: item.id,
                kind: item.kind,
                position: item.position,
                ring: existing?.ring ?? null,
                core: mesh,
                reticle: existing?.reticle ?? null,
                hit: existing?.hit ?? null,
              };
            }}
            userData={{ deepSkyId: item.id, kind: "waypoint-core" }}
            renderOrder={4}
            rotation={
              item.kind === "personal" || item.kind === "multi"
                ? [0, 0, Math.PI / 4]
                : [0, 0, 0]
            }
          >
            {item.kind === "reference" ? (
              <circleGeometry args={[0.2, 16]} />
            ) : (
              <planeGeometry args={[0.34, 0.34]} />
            )}
            <meshBasicMaterial
              color={
                item.kind === "reference"
                  ? COLORS.referenceCore
                  : COLORS.personalCore
              }
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
                kind: item.kind,
                position: item.position,
                ring: existing?.ring ?? null,
                core: existing?.core ?? null,
                reticle: mesh,
                hit: existing?.hit ?? null,
              };
            }}
            userData={{ deepSkyId: item.id, kind: "waypoint-reticle" }}
            renderOrder={5}
            visible={false}
          >
            <ringGeometry args={[0.92, 1.05, 32]} />
            <meshBasicMaterial
              color={COLORS.reticle}
              transparent
              depthWrite={false}
              depthTest={false}
              opacity={0.5}
              side={DoubleSide}
            />
          </mesh>
          <mesh
            ref={(mesh) => {
              const existing = entriesRef.current[index];
              entriesRef.current[index] = {
                id: item.id,
                kind: item.kind,
                position: item.position,
                ring: existing?.ring ?? null,
                core: existing?.core ?? null,
                reticle: existing?.reticle ?? null,
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
