"use client";

import { formatCaptureDateRange, getCaptureDateRange } from "@/features/captures/formatting/captureFormatting";
import type { AstrophotographyCapture } from "@/types/captures";

interface CaptureSwitcherProps {
  captures: AstrophotographyCapture[];
  selectedCaptureId: string;
  onSelect: (captureId: string) => void;
}

/** Compact thumbnail list for switching among captures of one object. */
export function CaptureSwitcher({
  captures,
  selectedCaptureId,
  onSelect,
}: CaptureSwitcherProps) {
  if (captures.length <= 1) {
    return null;
  }

  return (
    <div className="capture-switcher" role="group" aria-label="Personal captures">
      {captures.map((capture) => {
        const selected = capture.id === selectedCaptureId;
        const thumb = capture.images.thumbnail;
        const date = formatCaptureDateRange(
          getCaptureDateRange({
            capturedAt: capture.capturedAt,
            captureStartDate: capture.captureStartDate,
            captureEndDate: capture.captureEndDate,
          }),
        );
        return (
          <button
            key={capture.id}
            type="button"
            className={
              selected
                ? "capture-switcher__item capture-switcher__item--selected"
                : "capture-switcher__item"
            }
            aria-pressed={selected}
            aria-label={capture.title}
            onClick={() => onSelect(capture.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="capture-switcher__thumb"
              src={thumb.src}
              alt=""
              width={thumb.width}
              height={thumb.height}
              sizes="4.5rem"
              loading="lazy"
              decoding="async"
            />
            <span className="capture-switcher__text">
              <span className="capture-switcher__title">{capture.title}</span>
              {date ? (
                <span className="capture-switcher__meta">{date}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
