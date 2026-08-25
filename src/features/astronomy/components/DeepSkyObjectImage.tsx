"use client";

import { useState } from "react";

import type { ObjectDisplayImage } from "@/features/astronomy/selectors/displayImage";
import { useExperienceStore } from "@/state/experience-store";

interface DeepSkyObjectImageProps {
  display: ObjectDisplayImage;
  objectName: string;
  onOpenViewer?: () => void;
}

/**
 * Personal → reference → intentional no-image fallback.
 * Load failures resolve to the no-image state (missing local assets).
 */
export function DeepSkyObjectImage({
  display,
  objectName,
  onOpenViewer,
}: DeepSkyObjectImageProps) {
  const imageKey = getDisplayImageKey(display);
  return (
    <DeepSkyObjectImageInner
      key={imageKey}
      display={display}
      objectName={objectName}
      onOpenViewer={onOpenViewer}
    />
  );
}

function DeepSkyObjectImageInner({
  display,
  objectName,
  onOpenViewer,
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
        {onOpenViewer ? (
          <button
            type="button"
            className="dso-image__open"
            onClick={onOpenViewer}
            aria-label={`View ${capture.title} full screen`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="dso-image__media"
              src={image.src}
              alt={alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 767px) 92vw, 22rem"
              loading="eager"
              decoding="async"
              onError={() => setFailed(true)}
            />
          </button>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="dso-image__media"
            src={image.src}
            alt={alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 767px) 92vw, 22rem"
            loading="eager"
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
        <figcaption className="dso-image__caption">
          <span className="dso-image__badge">Photographed by me</span>
          {captureCount > 1 ? (
            <span className="dso-image__meta">
              {captureCount} personal captures
            </span>
          ) : (
            <span className="dso-image__meta">{capture.title}</span>
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
        sizes="(max-width: 767px) 92vw, 22rem"
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
