"use client";

import { useState } from "react";

import type { ObjectDisplayImage } from "@/features/astronomy/selectors/displayImage";
import { useExperienceStore } from "@/state/experience-store";

interface DeepSkyObjectImageProps {
  display: ObjectDisplayImage;
  objectName: string;
}

/**
 * Personal → reference → intentional no-image fallback.
 * Load failures resolve to the no-image state (missing local assets).
 */
export function DeepSkyObjectImage({
  display,
  objectName,
}: DeepSkyObjectImageProps) {
  const imageKey = getDisplayImageKey(display);
  return (
    <DeepSkyObjectImageInner
      key={imageKey}
      display={display}
      objectName={objectName}
    />
  );
}

function DeepSkyObjectImageInner({
  display,
  objectName,
}: DeepSkyObjectImageProps) {
  const reduceMotion = useExperienceStore((state) => state.reduceMotion);
  const [failed, setFailed] = useState(false);

  if (display.kind === "none" || failed) {
    return (
      <div
        className="dso-image dso-image--empty"
        role="img"
        aria-label="No image available"
      >
        <span className="dso-image__placeholder">No image available</span>
      </div>
    );
  }

  if (display.kind === "personal") {
    const { image, capture, captureCount } = display;
    const alt =
      image.alt && !image.alt.toLowerCase().startsWith("preview")
        ? image.alt
        : `My photograph of ${objectName}`;
    return (
      <figure
        className={
          reduceMotion
            ? "dso-image dso-image--personal"
            : "dso-image dso-image--personal dso-image--fade"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local optional assets; next/image not required for missing files */}
        <img
          className="dso-image__media"
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
        <figcaption className="dso-image__caption">
          <span className="dso-image__badge">Photographed by me</span>
          {captureCount > 1 ? (
            <span className="dso-image__meta">
              {captureCount} personal captures
            </span>
          ) : (
            <span className="dso-image__meta">
              {formatCaptureDate(capture.capturedAt.start)}
            </span>
          )}
        </figcaption>
      </figure>
    );
  }

  const { image } = display;
  return (
    <figure
      className={
        reduceMotion
          ? "dso-image dso-image--reference"
          : "dso-image dso-image--reference dso-image--fade"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="dso-image__media"
        src={image.src}
        alt={image.alt || `Reference image of ${objectName}`}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
      <figcaption className="dso-image__caption">
        <span className="dso-image__badge dso-image__badge--reference">
          Reference image
        </span>
        {image.credit || image.sourceName ? (
          <span className="dso-image__credit">
            {image.sourceUrl ? (
              <a
                href={image.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {image.credit ?? image.sourceName}
              </a>
            ) : (
              (image.credit ?? image.sourceName)
            )}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

function getDisplayImageKey(display: ObjectDisplayImage): string {
  if (display.kind === "personal") {
    return `personal:${display.capture.id}:${display.image.src}`;
  }
  if (display.kind === "reference") {
    return `reference:${display.image.src}`;
  }
  return "none";
}

function formatCaptureDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
