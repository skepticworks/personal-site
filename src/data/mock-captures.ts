/**
 * @deprecated Import from `@/features/captures/data/captures` or use
 * `@/features/captures/list-captures` / capture selectors instead.
 */
export {
  publishedCaptures,
  mockCaptures,
} from "@/features/captures/data/captures";

import { publishedCaptures } from "@/features/captures/data/captures";
import type { AstrophotographyCapture } from "@/types/captures";

/** @deprecated Prefer `getCaptureById` from capture selectors. */
export function getCaptureById(
  id: string,
): AstrophotographyCapture | undefined {
  return publishedCaptures.find((capture) => capture.id === id);
}
