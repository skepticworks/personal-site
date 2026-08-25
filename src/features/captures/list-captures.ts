import { getCaptureById, mockCaptures } from "@/data/mock-captures";
import type { AstrophotographyCapture } from "@/types/captures";

export function listCaptures(): AstrophotographyCapture[] {
  return mockCaptures;
}

export function resolveCapture(
  id: string,
): AstrophotographyCapture | undefined {
  return getCaptureById(id);
}
