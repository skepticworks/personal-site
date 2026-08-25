import fs from "node:fs";
import path from "node:path";

import {
  ALLOWED_ASTRO_WEB_EXTENSIONS,
  ASTROPHOTOGRAPHY_ASSET_ROOT,
  CAPTURE_DERIVATIVE_BASENAMES,
  PROHIBITED_ASTRO_SOURCE_EXTENSIONS,
  astrophotographyAssetPolicy,
  isAllowedAstroWebExtension,
  isProhibitedAstroSourceExtension,
  type CaptureDerivativeRole,
} from "@/config/astrophotography-assets";
import { listCaptures } from "@/features/captures/list-captures";
import {
  assertLocationPrivacyShape,
  resolveIntegrationSeconds,
} from "@/features/captures/formatting/captureFormatting";
import { getObjectById } from "@/features/astronomy/selectors/objectSelectors";
import type { AstrophotographyCapture } from "@/types/captures";
import type { CaptureImageAsset } from "@/types/assets";

export interface AstroAssetViolation {
  captureId: string;
  file: string;
  violation: string;
  expected: string;
}

export interface AstroAssetValidationResult {
  ok: boolean;
  violations: AstroAssetViolation[];
}

export interface ValidateAstroAssetsOptions {
  /** Repository root (defaults to process.cwd()). */
  rootDir?: string;
  /** When false, skip on-disk file checks (unit tests of metadata only). */
  checkFilesystem?: boolean;
  /** Override capture list (defaults to project captures). */
  captures?: AstrophotographyCapture[];
}

const ROLE_BY_BASENAME: Record<string, CaptureDerivativeRole> = {
  [CAPTURE_DERIVATIVE_BASENAMES.thumbnail]: "thumbnail",
  [CAPTURE_DERIVATIVE_BASENAMES.preview]: "preview",
  [CAPTURE_DERIVATIVE_BASENAMES.highQualityPreview]: "highQualityPreview",
};

/**
 * Validate published capture metadata and on-disk web derivatives.
 * Does not modify assets — fails with structured violations.
 */
export function validateAstroAssets(
  options: ValidateAstroAssetsOptions = {},
): AstroAssetValidationResult {
  const rootDir = options.rootDir ?? process.cwd();
  const checkFilesystem = options.checkFilesystem ?? true;
  const captures = options.captures ?? listCaptures();
  const violations: AstroAssetViolation[] = [];

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const capture of captures) {
    validateCaptureRecord(capture, seenIds, seenSlugs, violations);

    if (checkFilesystem) {
      validateCaptureFiles(rootDir, capture, violations);
    }
  }

  if (checkFilesystem) {
    scanForProhibitedFiles(rootDir, violations);
  }

  return {
    ok: violations.length === 0,
    violations,
  };
}

function validateCaptureRecord(
  capture: AstrophotographyCapture,
  seenIds: Set<string>,
  seenSlugs: Set<string>,
  violations: AstroAssetViolation[],
): void {
  if (seenIds.has(capture.id)) {
    violations.push({
      captureId: capture.id,
      file: "(metadata)",
      violation: "Duplicate capture ID",
      expected: "Unique AstrophotographyCapture.id",
    });
  }
  seenIds.add(capture.id);

  const slugKey = capture.slug.toLowerCase();
  if (seenSlugs.has(slugKey)) {
    violations.push({
      captureId: capture.id,
      file: "(metadata)",
      violation: `Duplicate capture slug "${capture.slug}"`,
      expected: "Unique AstrophotographyCapture.slug",
    });
  }
  seenSlugs.add(slugKey);

  if (!getObjectById(capture.targetObjectId)) {
    violations.push({
      captureId: capture.id,
      file: "(metadata)",
      violation: `Unknown targetObjectId "${capture.targetObjectId}"`,
      expected: "ID of an existing CelestialObject",
    });
  }

  if (capture.location) {
    const locationIssue = assertLocationPrivacyShape(capture.location);
    if (locationIssue) {
      violations.push({
        captureId: capture.id,
        file: "(metadata)",
        violation: locationIssue,
        expected: "Location fields matching LocationPrivacy",
      });
    }
  }

  try {
    resolveIntegrationSeconds(capture.acquisition);
  } catch (error) {
    violations.push({
      captureId: capture.id,
      file: "(metadata)",
      violation: error instanceof Error ? error.message : String(error),
      expected: "Consistent integrationSeconds vs exposureGroups",
    });
  }

  validateImageAsset(capture, "thumbnail", capture.images.thumbnail, violations);
  validateImageAsset(capture, "preview", capture.images.preview, violations);
  if (capture.images.highQualityPreview) {
    validateImageAsset(
      capture,
      "highQualityPreview",
      capture.images.highQualityPreview,
      violations,
    );
  }
}

function validateImageAsset(
  capture: AstrophotographyCapture,
  role: CaptureDerivativeRole,
  asset: CaptureImageAsset,
  violations: AstroAssetViolation[],
): void {
  if (!asset.src || !asset.alt?.trim()) {
    violations.push({
      captureId: capture.id,
      file: asset.src || "(missing src)",
      violation: `Missing src or alt on ${role}`,
      expected: "Non-empty src and meaningful alt text",
    });
  }

  const ext = path.extname(asset.src).toLowerCase();
  if (ext && !isAllowedAstroWebExtension(ext)) {
    violations.push({
      captureId: capture.id,
      file: asset.src,
      violation: `Disallowed extension "${ext}" for ${role}`,
      expected: ALLOWED_ASTRO_WEB_EXTENSIONS.join(", "),
    });
  }

  if (isProhibitedAstroSourceExtension(ext)) {
    violations.push({
      captureId: capture.id,
      file: asset.src,
      violation: `Prohibited source format "${ext}"`,
      expected: "Web derivative only (AVIF/WebP)",
    });
  }

  const expectedPrefix = `/assets/astrophotography/captures/${capture.id}/`;
  if (!asset.src.startsWith(expectedPrefix)) {
    violations.push({
      captureId: capture.id,
      file: asset.src,
      violation: `${role} path is outside the capture asset directory`,
      expected: `Path under ${expectedPrefix}`,
    });
  }

  const basename = path.basename(asset.src, ext);
  const expectedBasename = CAPTURE_DERIVATIVE_BASENAMES[role];
  if (basename !== expectedBasename) {
    violations.push({
      captureId: capture.id,
      file: asset.src,
      violation: `Unexpected ${role} filename stem "${basename}"`,
      expected: `${expectedBasename}.avif|webp`,
    });
  }

  if (asset.width <= 0 || asset.height <= 0) {
    violations.push({
      captureId: capture.id,
      file: asset.src,
      violation: `Invalid dimensions ${asset.width}×${asset.height}`,
      expected: "Positive width and height in metadata",
    });
  }

  const longEdge = Math.max(asset.width, asset.height);
  const policy = astrophotographyAssetPolicy[role];
  if (longEdge > policy.maxLongEdge) {
    violations.push({
      captureId: capture.id,
      file: asset.src,
      violation: `${role} longest edge ${longEdge}px exceeds limit`,
      expected: `≤ ${policy.maxLongEdge}px`,
    });
  }

  if (asset.bytes !== undefined && asset.bytes > policy.maxBytes) {
    violations.push({
      captureId: capture.id,
      file: asset.src,
      violation: `${role} size ${asset.bytes} bytes exceeds limit`,
      expected: `≤ ${policy.maxBytes} bytes`,
    });
  }
}

function validateCaptureFiles(
  rootDir: string,
  capture: AstrophotographyCapture,
  violations: AstroAssetViolation[],
): void {
  const roles: Array<{
    role: CaptureDerivativeRole;
    asset: CaptureImageAsset;
    required: boolean;
  }> = [
    { role: "thumbnail", asset: capture.images.thumbnail, required: true },
    { role: "preview", asset: capture.images.preview, required: true },
  ];
  if (capture.images.highQualityPreview) {
    roles.push({
      role: "highQualityPreview",
      asset: capture.images.highQualityPreview,
      required: true,
    });
  }

  for (const { role, asset, required } of roles) {
    const relative = asset.src.replace(/^\//, "");
    // asset.src is like /assets/... → public/assets/...
    const publicPath = path.join(rootDir, "public", relative);

    if (!fs.existsSync(publicPath)) {
      if (required) {
        violations.push({
          captureId: capture.id,
          file: asset.src,
          violation: `Missing ${role} file on disk`,
          expected: `File at public/${relative}`,
        });
      }
      continue;
    }

    const stats = fs.statSync(publicPath);
    const policy = astrophotographyAssetPolicy[role];
    if (stats.size > policy.maxBytes) {
      violations.push({
        captureId: capture.id,
        file: asset.src,
        violation: `${role} file is ${stats.size} bytes`,
        expected: `≤ ${policy.maxBytes} bytes`,
      });
    }
  }
}

function scanForProhibitedFiles(
  rootDir: string,
  violations: AstroAssetViolation[],
): void {
  const capturesRoot = path.join(rootDir, ASTROPHOTOGRAPHY_ASSET_ROOT);
  if (!fs.existsSync(capturesRoot)) {
    return;
  }

  walkFiles(capturesRoot, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const relative = path.relative(rootDir, filePath).replace(/\\/g, "/");
    const captureId = inferCaptureIdFromPath(relative);

    if (isProhibitedAstroSourceExtension(ext)) {
      violations.push({
        captureId,
        file: relative,
        violation: `Prohibited source format "${ext}" in website asset tree`,
        expected: `Only ${ALLOWED_ASTRO_WEB_EXTENSIONS.join(", ")} (plus README.md)`,
      });
      return;
    }

    const base = path.basename(filePath);
    if (base.toLowerCase() === "readme.md") {
      return;
    }

    if (!isAllowedAstroWebExtension(ext)) {
      violations.push({
        captureId,
        file: relative,
        violation: `Unexpected file type "${ext || "(none)"}" in capture assets`,
        expected: `${ALLOWED_ASTRO_WEB_EXTENSIONS.join(", ")} or README.md`,
      });
      return;
    }

    const stem = path.basename(filePath, ext);
    if (!(stem in ROLE_BY_BASENAME)) {
      violations.push({
        captureId,
        file: relative,
        violation: `Unexpected derivative filename "${base}"`,
        expected: Object.values(CAPTURE_DERIVATIVE_BASENAMES)
          .map((name) => `${name}.avif|webp`)
          .join(", "),
      });
      return;
    }

    const role = ROLE_BY_BASENAME[stem]!;
    const stats = fs.statSync(filePath);
    const maxBytes = astrophotographyAssetPolicy[role].maxBytes;
    if (stats.size > maxBytes) {
      violations.push({
        captureId,
        file: relative,
        violation: `File exceeds ${role} size limit (${stats.size} bytes)`,
        expected: `≤ ${maxBytes} bytes`,
      });
    }
  });
}

function inferCaptureIdFromPath(relativePosix: string): string {
  const marker = "astrophotography/captures/";
  const index = relativePosix.indexOf(marker);
  if (index === -1) {
    return "(unknown)";
  }
  const rest = relativePosix.slice(index + marker.length);
  return rest.split("/")[0] || "(unknown)";
}

function walkFiles(dir: string, visit: (filePath: string) => void): void {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, visit);
    } else if (entry.isFile()) {
      visit(full);
    }
  }
}

export function formatAstroAssetViolations(
  violations: AstroAssetViolation[],
): string {
  if (violations.length === 0) {
    return "No astrophotography asset violations.";
  }
  return violations
    .map(
      (v) =>
        `[${v.captureId}] ${v.file}\n  violation: ${v.violation}\n  expected:  ${v.expected}`,
    )
    .join("\n\n");
}

/** Helpers exported for focused unit tests (path/extension policy). */
export function wouldRejectAstroFilename(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  if (isProhibitedAstroSourceExtension(ext)) {
    return true;
  }
  if (!isAllowedAstroWebExtension(ext)) {
    return true;
  }
  const stem = path.basename(filename, ext);
  return !(stem in ROLE_BY_BASENAME);
}

export function listProhibitedExtensionsForTests(): readonly string[] {
  return PROHIBITED_ASTRO_SOURCE_EXTENSIONS;
}
