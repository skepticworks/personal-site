import { publishedCaptures } from "@/features/captures/data/captures";
import type { AstrophotographyCapture } from "@/types/captures";

export function listCaptures(): AstrophotographyCapture[] {
  return [...publishedCaptures].sort(compareCaptureOrder);
}

export function resolveCapture(
  id: string,
): AstrophotographyCapture | undefined {
  return publishedCaptures.find((capture) => capture.id === id);
}

function compareCaptureOrder(
  a: AstrophotographyCapture,
  b: AstrophotographyCapture,
): number {
  const orderA = a.sortOrder ?? Number.POSITIVE_INFINITY;
  const orderB = b.sortOrder ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return a.id.localeCompare(b.id);
}
