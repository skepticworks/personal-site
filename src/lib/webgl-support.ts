/**
 * Lightweight WebGL capability probes for graceful sky fallback.
 * Does not allocate a persistent context — only detects availability.
 */

export type WebGlSupportStatus =
  | "unknown"
  | "supported"
  | "unsupported"
  | "context-failed";

export function detectWebGlSupport(): WebGlSupportStatus {
  if (typeof document === "undefined") {
    return "unknown";
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ??
      canvas.getContext("experimental-webgl");

    if (!gl) {
      return "unsupported";
    }

    // Explicitly lose the temporary context when possible.
    const lose = (
      gl as WebGLRenderingContext
    ).getExtension?.("WEBGL_lose_context");
    lose?.loseContext();
    return "supported";
  } catch {
    return "context-failed";
  }
}

export function describeWebGlFailure(status: WebGlSupportStatus): string {
  switch (status) {
    case "unsupported":
      return "This browser or device does not expose WebGL, so the interactive night sky cannot start.";
    case "context-failed":
      return "WebGL failed to initialize on this device, so the interactive night sky is unavailable.";
    default:
      return "The interactive night sky is temporarily unavailable.";
  }
}
