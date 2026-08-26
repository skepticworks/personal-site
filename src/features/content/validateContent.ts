import { listDeepSkyObjects } from "@/features/astronomy/data/deep-sky-objects";
import { isValidEquatorialCoordinates } from "@/features/astronomy/coordinates/validate";
import { publishedCaptures } from "@/features/captures/data/captures";
import { listPortfolioProjects } from "@/features/portfolio/data/projects";
import type { CelestialObject } from "@/types/astronomy";
import type { AstrophotographyCapture } from "@/types/captures";
import type { PortfolioProject } from "@/types/portfolio";

export interface ContentViolation {
  domain: "project" | "object" | "capture" | "cross-reference";
  id: string;
  message: string;
}

export interface ContentValidationResult {
  ok: boolean;
  violations: ContentViolation[];
}

export interface ValidateContentOptions {
  projects?: PortfolioProject[];
  objects?: CelestialObject[];
  captures?: AstrophotographyCapture[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validate portfolio projects, deep-sky objects, and captures as a set.
 * Prefer calling this at build / `npm run validate` so malformed content fails early.
 */
export function validateContent(
  options: ValidateContentOptions = {},
): ContentValidationResult {
  const projects = options.projects ?? listPortfolioProjects();
  const objects = options.objects ?? [...listDeepSkyObjects()];
  const captures = options.captures ?? publishedCaptures;
  const violations: ContentViolation[] = [];

  const projectIds = new Set<string>();
  const projectSlugs = new Set<string>();
  for (const project of projects) {
    validateProject(project, projectIds, projectSlugs, violations);
  }

  const objectIds = new Set<string>();
  const objectSlugs = new Set<string>();
  for (const object of objects) {
    validateObject(object, objectIds, objectSlugs, violations);
  }

  const captureIds = new Set<string>();
  const captureSlugs = new Set<string>();
  for (const capture of captures) {
    validateCapture(
      capture,
      captureIds,
      captureSlugs,
      objectIds,
      projectIds,
      violations,
    );
  }

  for (const project of projects) {
    for (const captureId of project.relatedCaptureIds ?? []) {
      if (!captureIds.has(captureId)) {
        violations.push({
          domain: "cross-reference",
          id: project.id,
          message: `Project "${project.id}" references unknown capture "${captureId}".`,
        });
      }
    }
  }

  return {
    ok: violations.length === 0,
    violations,
  };
}

function validateProject(
  project: PortfolioProject,
  seenIds: Set<string>,
  seenSlugs: Set<string>,
  violations: ContentViolation[],
): void {
  if (!project.id?.trim()) {
    violations.push({
      domain: "project",
      id: "(missing)",
      message: "Project is missing a stable id.",
    });
    return;
  }

  if (seenIds.has(project.id)) {
    violations.push({
      domain: "project",
      id: project.id,
      message: `Duplicate project id "${project.id}".`,
    });
  }
  seenIds.add(project.id);

  if (!project.slug || !SLUG.test(project.slug)) {
    violations.push({
      domain: "project",
      id: project.id,
      message: `Invalid project slug "${project.slug ?? ""}" (expected lowercase kebab-case).`,
    });
  } else if (seenSlugs.has(project.slug)) {
    violations.push({
      domain: "project",
      id: project.id,
      message: `Duplicate project slug "${project.slug}".`,
    });
  } else {
    seenSlugs.add(project.slug);
  }

  if (!project.title?.trim() || !project.summary?.trim()) {
    violations.push({
      domain: "project",
      id: project.id,
      message: "Project requires non-empty title and summary.",
    });
  }

  if (project.startedAt && !ISO_DATE.test(project.startedAt)) {
    violations.push({
      domain: "project",
      id: project.id,
      message: `Invalid startedAt date "${project.startedAt}".`,
    });
  }

  for (const [label, url] of Object.entries(project.links ?? {})) {
    if (url && !isHttpUrl(url)) {
      violations.push({
        domain: "project",
        id: project.id,
        message: `Invalid ${label} URL "${url}".`,
      });
    }
  }
}

function validateObject(
  object: CelestialObject,
  seenIds: Set<string>,
  seenSlugs: Set<string>,
  violations: ContentViolation[],
): void {
  if (!object.id?.trim()) {
    violations.push({
      domain: "object",
      id: "(missing)",
      message: "Deep-sky object is missing a stable id.",
    });
    return;
  }

  if (seenIds.has(object.id)) {
    violations.push({
      domain: "object",
      id: object.id,
      message: `Duplicate object id "${object.id}".`,
    });
  }
  seenIds.add(object.id);

  if (!object.slug || !SLUG.test(object.slug)) {
    violations.push({
      domain: "object",
      id: object.id,
      message: `Invalid object slug "${object.slug ?? ""}" (expected lowercase kebab-case).`,
    });
  } else if (seenSlugs.has(object.slug)) {
    violations.push({
      domain: "object",
      id: object.id,
      message: `Duplicate object slug "${object.slug}".`,
    });
  } else {
    seenSlugs.add(object.slug);
  }

  if (!object.commonName?.trim()) {
    violations.push({
      domain: "object",
      id: object.id,
      message: "Object requires a commonName.",
    });
  }

  if (!Array.isArray(object.catalogIds) || object.catalogIds.length === 0) {
    violations.push({
      domain: "object",
      id: object.id,
      message: "Object requires at least one catalogIds entry.",
    });
  }

  const ra = object.coordinates.rightAscensionHours;
  const dec = object.coordinates.declinationDegrees;
  if (!isValidEquatorialCoordinates(object.coordinates)) {
    violations.push({
      domain: "object",
      id: object.id,
      message: `Invalid coordinates RA=${ra}, Dec=${dec}.`,
    });
  }

  if (
    object.magnitude != null &&
    (!Number.isFinite(object.magnitude) ||
      object.magnitude < -2 ||
      object.magnitude > 30)
  ) {
    violations.push({
      domain: "object",
      id: object.id,
      message: `Magnitude ${object.magnitude} is outside a plausible visual range.`,
    });
  }

  if (
    object.distanceLy != null &&
    (!Number.isFinite(object.distanceLy) || object.distanceLy <= 0)
  ) {
    violations.push({
      domain: "object",
      id: object.id,
      message: `distanceLy must be a positive number (got ${object.distanceLy}).`,
    });
  }

  if (object.referenceImage) {
    if (!object.referenceImage.src?.startsWith("/assets/")) {
      violations.push({
        domain: "object",
        id: object.id,
        message: `referenceImage.src must be a site-relative /assets/ path (got "${object.referenceImage.src}").`,
      });
    }
    if (!object.referenceImage.alt?.trim()) {
      violations.push({
        domain: "object",
        id: object.id,
        message: "referenceImage requires meaningful alt text.",
      });
    }
  }
}

function validateCapture(
  capture: AstrophotographyCapture,
  seenIds: Set<string>,
  seenSlugs: Set<string>,
  objectIds: Set<string>,
  projectIds: Set<string>,
  violations: ContentViolation[],
): void {
  if (!capture.id?.trim()) {
    violations.push({
      domain: "capture",
      id: "(missing)",
      message: "Capture is missing a stable id.",
    });
    return;
  }

  if (seenIds.has(capture.id)) {
    violations.push({
      domain: "capture",
      id: capture.id,
      message: `Duplicate capture id "${capture.id}".`,
    });
  }
  seenIds.add(capture.id);

  if (!capture.slug || !SLUG.test(capture.slug)) {
    violations.push({
      domain: "capture",
      id: capture.id,
      message: `Invalid capture slug "${capture.slug ?? ""}".`,
    });
  } else if (seenSlugs.has(capture.slug)) {
    violations.push({
      domain: "capture",
      id: capture.id,
      message: `Duplicate capture slug "${capture.slug}".`,
    });
  } else {
    seenSlugs.add(capture.slug);
  }

  if (!objectIds.has(capture.targetObjectId)) {
    violations.push({
      domain: "capture",
      id: capture.id,
      message: `Capture "${capture.id}" references unknown object "${capture.targetObjectId}".`,
    });
  }

  if (!capture.images?.thumbnail?.src || !capture.images?.preview?.src) {
    violations.push({
      domain: "capture",
      id: capture.id,
      message: "Capture requires thumbnail and preview image paths.",
    });
  }

  for (const dateField of [
    capture.capturedAt,
    capture.captureStartDate,
    capture.captureEndDate,
  ]) {
    if (dateField && !ISO_DATE.test(dateField)) {
      violations.push({
        domain: "capture",
        id: capture.id,
        message: `Invalid capture date "${dateField}".`,
      });
    }
  }

  if (!isValidEquatorialCoordinates(capture.celestialCoordinates)) {
    violations.push({
      domain: "capture",
      id: capture.id,
      message: "Capture celestialCoordinates are invalid.",
    });
  }

  for (const projectId of capture.relatedProjectIds ?? []) {
    if (!projectIds.has(projectId)) {
      violations.push({
        domain: "capture",
        id: capture.id,
        message: `Capture "${capture.id}" references unknown project "${projectId}".`,
      });
    }
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatContentViolations(
  violations: ContentViolation[],
): string {
  if (violations.length === 0) {
    return "No content violations.";
  }
  return violations
    .map((v) => `[${v.domain}] ${v.id}: ${v.message}`)
    .join("\n");
}
