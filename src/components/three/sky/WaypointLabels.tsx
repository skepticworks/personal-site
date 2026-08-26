"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";

import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { getCameraForward } from "@/features/astronomy/coordinates/camera-orientation";
import {
  type Cartesian3,
  equatorialToCartesian,
} from "@/features/astronomy/coordinates/conversions";
import { listDeepSkyObjects } from "@/features/astronomy/data/deep-sky-objects";
import { evaluateWaypointVisibility } from "@/features/astronomy/waypoints/label-visibility";
import { hasPersonalCapture } from "@/features/captures/selectors/captureSelectors";
import { useExperienceStore } from "@/state/experience-store";
import { skyRuntime } from "@/state/sky-runtime";

interface WaypointLabelsProps {
  maxOrdinaryLabels: number;
  /** DOM host outside the WebGL canvas (sibling overlay). */
  host: HTMLElement | null;
}

interface LabelModel {
  id: string;
  name: string;
  secondary: string;
  hasPersonalPhoto: boolean;
  world: Vector3;
  direction: Cartesian3;
}

/**
 * Projects deep-sky labels into a DOM overlay host.
 *
 * Intentionally returns `null` into the R3F tree — DOM must not be reconciled
 * by the Three.js reconciler (createPortal from inside Canvas breaks Next/R3F).
 */
export function WaypointLabels({ maxOrdinaryLabels, host }: WaypointLabelsProps) {
  const labelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { camera, size } = useThree();
  const projected = useRef(new Vector3());

  const models = useMemo<LabelModel[]>(() => {
    const radius = SKY_NAVIGATION.celestialSphereRadius * 0.98;
    return listDeepSkyObjects().map((object) => {
      const c = equatorialToCartesian(object.coordinates, radius);
      const catalog = object.catalogIds[0];
      const secondary = catalog
        ? `${catalog.catalog}${catalog.id} · ${formatObjectType(object.objectType)}`
        : formatObjectType(object.objectType);
      return {
        id: object.id,
        name: object.commonName,
        secondary,
        hasPersonalPhoto: hasPersonalCapture(object.id),
        world: new Vector3(c.x, c.y, c.z),
        direction: { x: c.x, y: c.y, z: c.z },
      };
    });
  }, []);

  // Build / tear down label DOM under the host (outside R3F reconciliation)
  useEffect(() => {
    if (!host) {
      return;
    }

    host.replaceChildren();
    const map = new Map<string, HTMLDivElement>();
    const root = document.createElement("div");
    root.className = "sky-waypoint-labels";
    root.setAttribute("aria-hidden", "true");

    for (const model of models) {
      const el = document.createElement("div");
      el.className = "sky-waypoint-label";
      el.dataset.personal = model.hasPersonalPhoto ? "true" : "false";
      el.style.opacity = "0";
      el.style.visibility = "hidden";

      const name = document.createElement("span");
      name.className = "sky-waypoint-label__name";
      name.textContent = model.name;

      const meta = document.createElement("span");
      meta.className = "sky-waypoint-label__meta";
      meta.textContent = model.hasPersonalPhoto
        ? `${model.secondary} · my photo`
        : model.secondary;

      el.append(name, meta);
      root.append(el);
      map.set(model.id, el);
    }

    host.append(root);
    labelRefs.current = map;

    return () => {
      host.replaceChildren();
      labelRefs.current = new Map();
    };
  }, [host, models]);

  useFrame(() => {
    if (!host || labelRefs.current.size === 0) {
      return;
    }

    const selected = useExperienceStore.getState().selectedCelestialObjectId;
    const hovered = skyRuntime.hoveredObjectId;
    const forward = getCameraForward(skyRuntime.orientation);

    const ordinaryDistances: { id: string; separation: number }[] = [];
    const evaluations: {
      model: LabelModel;
      ndcX: number | null;
      ndcY: number | null;
      screenX: number;
      screenY: number;
    }[] = [];

    for (const model of models) {
      projected.current.copy(model.world).project(camera);
      const inFront = projected.current.z < 1;
      const ndcX = inFront ? projected.current.x : null;
      const ndcY = inFront ? projected.current.y : null;
      const screenX = ((projected.current.x + 1) / 2) * size.width;
      const screenY = ((1 - projected.current.y) / 2) * size.height;
      evaluations.push({ model, ndcX, ndcY, screenX, screenY });

      if (
        inFront &&
        model.id !== selected &&
        model.id !== hovered &&
        ndcX !== null &&
        ndcY !== null &&
        Math.abs(ndcX) <= 1.15 &&
        Math.abs(ndcY) <= 1.15
      ) {
        const dirLen = Math.hypot(
          model.direction.x,
          model.direction.y,
          model.direction.z,
        );
        const fwdLen = Math.hypot(forward.x, forward.y, forward.z) || 1;
        const cos = Math.min(
          1,
          Math.max(
            -1,
            (model.direction.x * forward.x +
              model.direction.y * forward.y +
              model.direction.z * forward.z) /
              (dirLen * fwdLen),
          ),
        );
        ordinaryDistances.push({ id: model.id, separation: Math.acos(cos) });
      }
    }

    ordinaryDistances.sort((a, b) => a.separation - b.separation);
    const ordinaryRank = new Map<string, number>();
    ordinaryDistances.forEach((item, index) => {
      ordinaryRank.set(item.id, index);
    });

    let visibleCount = 0;

    for (const evaluation of evaluations) {
      const el = labelRefs.current.get(evaluation.model.id);
      if (!el) {
        continue;
      }

      const result = evaluateWaypointVisibility({
        objectId: evaluation.model.id,
        worldDirection: evaluation.model.direction,
        cameraForward: forward,
        selectedId: selected,
        hoveredId: hovered,
        ndcX: evaluation.ndcX,
        ndcY: evaluation.ndcY,
        fov: skyRuntime.fov,
        maxOrdinaryLabels,
        ordinaryRank: ordinaryRank.get(evaluation.model.id) ?? 999,
      });

      if (!result.showLabel) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        el.dataset.priority = result.priority;
        continue;
      }

      visibleCount += 1;
      el.style.visibility = "visible";
      el.style.opacity = result.priority === "ordinary" ? "0.82" : "1";
      el.style.transform = `translate(-50%, -120%) translate(${evaluation.screenX}px, ${evaluation.screenY}px)`;
      el.dataset.priority = result.priority;
    }

    skyRuntime.visibleLabelCount = visibleCount;
  });

  return null;
}

function formatObjectType(type: string): string {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
