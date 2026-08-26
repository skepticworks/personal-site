"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import {
  getCaptureDisplayImage,
  hasHighQualityPreview,
} from "@/features/captures/selectors/captureSelectors";
import {
  IconClose,
  IconZoomIn,
  IconZoomOut,
} from "@/components/icons/UiIcons";
import { trapFocus, restoreFocus } from "@/lib/focus-management";
import { buildCaptureSrcSet } from "@/lib/responsive-image";
import type { AstrophotographyCapture } from "@/types/captures";
import { useExperienceStore } from "@/state/experience-store";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 1.25;

interface CaptureImageViewerProps {
  capture: AstrophotographyCapture;
  targetName: string;
  onClose: () => void;
}

/**
 * DOM-only full-screen web-preview viewer with zoom/pan.
 * Uses highQualityPreview when present, otherwise preview — never originals.
 */
export function CaptureImageViewer({
  capture,
  targetName,
  onClose,
}: CaptureImageViewerProps) {
  const titleId = useId();
  const reduceMotion = useExperienceStore((state) => state.reduceMotion);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<HTMLDivElement>(null);

  const preview = capture.images.preview;
  const hq = capture.images.highQualityPreview;
  const useHq = hasHighQualityPreview(capture);

  const [hqReady, setHqReady] = useState(!useHq);
  const [hqFailed, setHqFailed] = useState(false);
  const scaleRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [uiScale, setUiScale] = useState(1);

  const applyTransform = useCallback(() => {
    const el = transformRef.current;
    if (!el) {
      return;
    }
    const { x, y } = panRef.current;
    const scale = scaleRef.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);

  const clampPan = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const scale = scaleRef.current;
    if (scale <= MIN_SCALE) {
      panRef.current = { x: 0, y: 0 };
      return;
    }
    const maxX = (viewport.clientWidth * (scale - 1)) / 2;
    const maxY = (viewport.clientHeight * (scale - 1)) / 2;
    panRef.current = {
      x: Math.min(maxX, Math.max(-maxX, panRef.current.x)),
      y: Math.min(maxY, Math.max(-maxY, panRef.current.y)),
    };
  }, []);

  const setScale = useCallback(
    (next: number, origin?: { x: number; y: number }) => {
      const viewport = viewportRef.current;
      const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      const prev = scaleRef.current;
      if (clamped === prev) {
        return;
      }

      if (viewport && origin && prev > 0) {
        const rect = viewport.getBoundingClientRect();
        const cx = origin.x - rect.left - rect.width / 2;
        const cy = origin.y - rect.top - rect.height / 2;
        const ratio = clamped / prev;
        panRef.current = {
          x: cx - (cx - panRef.current.x) * ratio,
          y: cy - (cy - panRef.current.y) * ratio,
        };
      }

      scaleRef.current = clamped;
      if (clamped === MIN_SCALE) {
        panRef.current = { x: 0, y: 0 };
      } else {
        clampPan();
      }
      applyTransform();
      setUiScale(clamped);
    },
    [applyTransform, clampPan],
  );

  const resetView = useCallback(() => {
    scaleRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    applyTransform();
    setUiScale(1);
  }, [applyTransform]);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    useExperienceStore.getState().setCaptureViewerOpen(true);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const dialog = closeButtonRef.current?.closest(
      '[role="dialog"]',
    ) as HTMLElement | null;
    const releaseTrap = dialog ? trapFocus(dialog) : undefined;

    return () => {
      releaseTrap?.();
      document.body.style.overflow = overflow;
      useExperienceStore.getState().setCaptureViewerOpen(false);
      restoreFocus(previouslyFocused.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true]")) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setScale(scaleRef.current * ZOOM_STEP);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setScale(scaleRef.current / ZOOM_STEP);
      } else if (event.key === "0") {
        event.preventDefault();
        resetView();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onClose, resetView, setScale]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scaleRef.current <= MIN_SCALE) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: panRef.current.x,
      originY: panRef.current.y,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    panRef.current = {
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    };
    clampPan();
    applyTransform();
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  const onDoubleClick = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scaleRef.current > MIN_SCALE) {
      resetView();
    } else {
      setScale(2.5, { x: event.clientX, y: event.clientY });
    }
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const direction = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    setScale(scaleRef.current * direction, {
      x: event.clientX,
      y: event.clientY,
    });
  };

  const displaySrc =
    useHq && hqReady && !hqFailed && hq ? hq.src : preview.src;
  const displayAsset =
    useHq && hqReady && !hqFailed && hq
      ? hq
      : getCaptureDisplayImage(capture, "panel");
  const viewerSrcSet = buildCaptureSrcSet(capture.images, "viewer");

  return (
    <div
      className={
        reduceMotion
          ? "capture-viewer"
          : "capture-viewer capture-viewer--animated"
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="capture-viewer__backdrop" onClick={onClose} />
      <div className="capture-viewer__chrome">
        <div className="capture-viewer__titles">
          <h2 id={titleId} className="capture-viewer__title">
            {capture.title}
          </h2>
          <p className="capture-viewer__subtitle">{targetName}</p>
        </div>
        <div className="capture-viewer__controls">
          <button
            type="button"
            className="capture-viewer__control"
            onClick={() => setScale(scaleRef.current / ZOOM_STEP)}
            aria-label="Zoom out"
          >
            <IconZoomOut className="capture-viewer__control-icon" />
          </button>
          <button
            type="button"
            className="capture-viewer__control"
            onClick={resetView}
            aria-label="Reset zoom"
          >
            Reset
          </button>
          <button
            type="button"
            className="capture-viewer__control"
            onClick={() => setScale(scaleRef.current * ZOOM_STEP)}
            aria-label="Zoom in"
          >
            <IconZoomIn className="capture-viewer__control-icon" />
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            className="capture-viewer__control capture-viewer__control--close"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <IconClose className="capture-viewer__control-icon" />
            <span>Close</span>
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="capture-viewer__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={onDoubleClick}
        onWheel={onWheel}
        style={{
          cursor: uiScale > MIN_SCALE ? "grab" : "default",
        }}
      >
        <div ref={transformRef} className="capture-viewer__transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="capture-viewer__image"
            src={displaySrc}
            srcSet={viewerSrcSet}
            sizes="100vw"
            alt={displayAsset.alt || `Web preview of ${capture.title}`}
            width={displayAsset.width}
            height={displayAsset.height}
            draggable={false}
            decoding="async"
          />
        </div>
        {useHq && !hqReady && !hqFailed ? (
          <p className="capture-viewer__loading" role="status">
            Loading higher-quality preview…
          </p>
        ) : null}
      </div>

      {useHq && hq ? (
        // Prefetch HQ while showing standard preview; swap when ready.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hq.src}
          alt=""
          width={hq.width}
          height={hq.height}
          hidden
          onLoad={() => setHqReady(true)}
          onError={() => {
            setHqFailed(true);
            setHqReady(false);
          }}
        />
      ) : null}

      <p className="capture-viewer__hint">
        Web preview only — zoom with +/− or scroll; drag to pan when zoomed.
        Escape closes.
      </p>
    </div>
  );
}
