/**
 * CLI entry for `npm run validate:content`.
 * Fails non-zero when projects, objects, or captures are inconsistent.
 */

import {
  formatContentViolations,
  validateContent,
} from "../src/features/content/validateContent";

const result = validateContent();

if (!result.ok) {
  console.error("Content validation failed:\n");
  console.error(formatContentViolations(result.violations));
  console.error(`\n${result.violations.length} violation(s).`);
  process.exit(1);
}

console.log(
  `Content validation passed (${result.violations.length} violations).`,
);
