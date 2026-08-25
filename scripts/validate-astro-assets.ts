/**
 * CLI entry for `npm run validate:astro-assets`.
 * Fails non-zero when prohibited sources or policy violations are found.
 */

import {
  formatAstroAssetViolations,
  validateAstroAssets,
} from "../src/features/captures/validation/validateAstroAssets";

const result = validateAstroAssets({ rootDir: process.cwd() });

if (!result.ok) {
  console.error("Astrophotography asset validation failed:\n");
  console.error(formatAstroAssetViolations(result.violations));
  console.error(`\n${result.violations.length} violation(s).`);
  process.exit(1);
}

console.log(
  `Astrophotography asset validation passed (${result.violations.length} violations).`,
);
