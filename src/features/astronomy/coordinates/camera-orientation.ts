/**
 * Camera look orientation for celestial targets.
 *
 * Three.js cameras look down local −Z with local +Y as up.
 * We build a basis that aims −Z along the celestial direction while keeping
 * celestial +Y as the preferred up (with a safe fallback near the poles).
 */

import type { EquatorialCoordinates } from "@/types/astronomy";

import {
  type Cartesian3,
  equatorialToDirection,
  normalize3,
} from "./conversions";

/** Plain quaternion (x, y, z, w) — independent of Three.js. */
export interface Quat {
  x: number;
  y: number;
  z: number;
  w: number;
}

const WORLD_UP: Cartesian3 = { x: 0, y: 1, z: 0 };
const EPSILON = 1e-5;

function cross(a: Cartesian3, b: Cartesian3): Cartesian3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function negate(v: Cartesian3): Cartesian3 {
  return { x: -v.x, y: -v.y, z: -v.z };
}

/**
 * Build a look quaternion whose forward (−Z) aims along `direction`
 * (from camera origin toward the celestial target).
 */
export function getLookQuaternionForDirection(direction: Cartesian3): Quat {
  const forward = normalize3(direction); // world direction the camera should face
  // Camera looks down −Z, so local −Z = forward ⇒ local +Z = −forward
  const zAxis = negate(forward);

  let up = WORLD_UP;
  const upDot = Math.abs(
    forward.x * up.x + forward.y * up.y + forward.z * up.z,
  );
  if (upDot > 1 - EPSILON) {
    // Looking nearly along ±Y — pick a stable alternate up
    up = { x: 0, y: 0, z: forward.y >= 0 ? -1 : 1 };
  }

  const xAxis = normalize3(cross(up, zAxis));
  const yAxis = cross(zAxis, xAxis);

  // Rotation matrix columns are the basis vectors; convert to quaternion
  return rotationMatrixToQuaternion(xAxis, yAxis, zAxis);
}

/** Look quaternion that centers the given equatorial coordinates. */
export function getLookQuaternionForCelestialTarget(
  coordinates: EquatorialCoordinates,
): Quat {
  return getLookQuaternionForDirection(equatorialToDirection(coordinates));
}

function rotationMatrixToQuaternion(
  xAxis: Cartesian3,
  yAxis: Cartesian3,
  zAxis: Cartesian3,
): Quat {
  // m00 m01 m02
  // m10 m11 m12
  // m20 m21 m22
  const m00 = xAxis.x;
  const m01 = yAxis.x;
  const m02 = zAxis.x;
  const m10 = xAxis.y;
  const m11 = yAxis.y;
  const m12 = zAxis.y;
  const m20 = xAxis.z;
  const m21 = yAxis.z;
  const m22 = zAxis.z;

  const trace = m00 + m11 + m22;
  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);
    return {
      w: 0.25 / s,
      x: (m21 - m12) * s,
      y: (m02 - m20) * s,
      z: (m10 - m01) * s,
    };
  }
  if (m00 > m11 && m00 > m22) {
    const s = 2 * Math.sqrt(1 + m00 - m11 - m22);
    return {
      w: (m21 - m12) / s,
      x: 0.25 * s,
      y: (m01 + m10) / s,
      z: (m02 + m20) / s,
    };
  }
  if (m11 > m22) {
    const s = 2 * Math.sqrt(1 + m11 - m00 - m22);
    return {
      w: (m02 - m20) / s,
      x: (m01 + m10) / s,
      y: 0.25 * s,
      z: (m12 + m21) / s,
    };
  }
  const s = 2 * Math.sqrt(1 + m22 - m00 - m11);
  return {
    w: (m10 - m01) / s,
    x: (m02 + m20) / s,
    y: (m12 + m21) / s,
    z: 0.25 * s,
  };
}

/** Spherical linear interpolation between unit quaternions. */
export function slerpQuat(a: Quat, b: Quat, t: number): Quat {
  let bx = b.x;
  let by = b.y;
  let bz = b.z;
  let bw = b.w;

  const ax = a.x;
  const ay = a.y;
  const az = a.z;
  const aw = a.w;

  let cosHalf = ax * bx + ay * by + az * bz + aw * bw;
  if (cosHalf < 0) {
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
    cosHalf = -cosHalf;
  }

  if (cosHalf >= 1 - 1e-8) {
    return normalizeQuat({
      x: ax + (bx - ax) * t,
      y: ay + (by - ay) * t,
      z: az + (bz - az) * t,
      w: aw + (bw - aw) * t,
    });
  }

  const halfAngle = Math.acos(cosHalf);
  const sinHalf = Math.sin(halfAngle);
  const ratioA = Math.sin((1 - t) * halfAngle) / sinHalf;
  const ratioB = Math.sin(t * halfAngle) / sinHalf;

  return {
    x: ax * ratioA + bx * ratioB,
    y: ay * ratioA + by * ratioB,
    z: az * ratioA + bz * ratioB,
    w: aw * ratioA + bw * ratioB,
  };
}

export function normalizeQuat(q: Quat): Quat {
  const len = Math.hypot(q.x, q.y, q.z, q.w);
  if (len < 1e-12) {
    return { x: 0, y: 0, z: 0, w: 1 };
  }
  return { x: q.x / len, y: q.y / len, z: q.z / len, w: q.w / len };
}

/** Shortest angular distance between two quaternions, radians. */
export function quatAngularDistanceRadians(a: Quat, b: Quat): number {
  const dot = Math.min(
    1,
    Math.max(-1, Math.abs(a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w)),
  );
  return 2 * Math.acos(dot);
}

export function identityQuat(): Quat {
  return { x: 0, y: 0, z: 0, w: 1 };
}

/** Rotate a vector by a quaternion. */
export function rotateVectorByQuat(v: Cartesian3, q: Quat): Cartesian3 {
  const ix = q.w * v.x + q.y * v.z - q.z * v.y;
  const iy = q.w * v.y + q.z * v.x - q.x * v.z;
  const iz = q.w * v.z + q.x * v.y - q.y * v.x;
  const iw = -q.x * v.x - q.y * v.y - q.z * v.z;

  return {
    x: ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
    y: iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
    z: iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x,
  };
}

/** Camera forward (−Z) in world space for the given orientation. */
export function getCameraForward(q: Quat): Cartesian3 {
  return rotateVectorByQuat({ x: 0, y: 0, z: -1 }, q);
}
