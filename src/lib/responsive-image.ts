import type { CaptureImageSet, WebImageAsset } from "@/types/assets";

/**
 * Build a conservative `srcset` from available capture derivatives.
 * Only includes distinct widths — does not invent denser variants.
 */
export function buildCaptureSrcSet(
  images: CaptureImageSet,
  role: "thumbnail" | "preview" | "viewer",
): string | undefined {
  if (role === "thumbnail") {
    return `${images.thumbnail.src} ${images.thumbnail.width}w`;
  }

  const entries: Array<{ src: string; width: number }> = [
    { src: images.preview.src, width: images.preview.width },
  ];

  if (
    images.thumbnail.width < images.preview.width &&
    role === "preview"
  ) {
    entries.unshift({
      src: images.thumbnail.src,
      width: images.thumbnail.width,
    });
  }

  if (role === "viewer" && images.highQualityPreview) {
    entries.push({
      src: images.highQualityPreview.src,
      width: images.highQualityPreview.width,
    });
  }

  const unique = new Map<number, string>();
  for (const entry of entries) {
    unique.set(entry.width, entry.src);
  }

  if (unique.size < 2) {
    return undefined;
  }

  return Array.from(unique.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([width, src]) => `${src} ${width}w`)
    .join(", ");
}

export function defaultSizesForContext(
  context: "thumbnail" | "panel" | "sheet" | "viewer",
): string {
  switch (context) {
    case "thumbnail":
      return "(max-width: 767px) 4.5rem, 5rem";
    case "sheet":
      return "(max-width: 767px) 92vw, 22rem";
    case "viewer":
      return "100vw";
    case "panel":
    default:
      return "(max-width: 767px) 92vw, 22rem";
  }
}

export function pickPrimaryImage(
  images: CaptureImageSet,
  context: "thumbnail" | "panel" | "sheet" | "viewer",
): WebImageAsset {
  if (context === "thumbnail") {
    return images.thumbnail;
  }
  if (context === "viewer") {
    return images.highQualityPreview ?? images.preview;
  }
  return images.preview;
}
