"use client";

import { useMemo, useState } from "react";

import { DeepSkyObjectDetails } from "@/features/astronomy/components/DeepSkyObjectDetails";
import { listObjects } from "@/features/astronomy/selectors/objectSelectors";
import { searchDeepSkyObjects } from "@/features/astronomy/search/searchDeepSkyObjects";
import {
  formatCatalogIdentifier,
  formatObjectType,
} from "@/features/astronomy/formatting/astronomyFormatting";
import { hasPersonalCapture } from "@/features/captures/selectors/captureSelectors";

interface AstronomyFallbackBrowserProps {
  /** Why the interactive sky is unavailable. */
  reason: string;
  /** Optional retry for transient WebGL / import failures. */
  onRetry?: () => void;
  /** Return to portfolio without relying on the sky. */
  onReturnToPortfolio?: () => void;
}

/**
 * Non-WebGL astronomy / photography browse path.
 * Shares the same catalogs and object details as the interactive sky.
 */
export function AstronomyFallbackBrowser({
  reason,
  onRetry,
  onReturnToPortfolio,
}: AstronomyFallbackBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const allObjects = useMemo(() => listObjects(), []);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return allObjects.map((object) => ({ object, score: 0 }));
    }
    return searchDeepSkyObjects(trimmed, { limit: 40 });
  }, [allObjects, query]);

  const selected =
    selectedId != null
      ? allObjects.find((object) => object.id === selectedId)
      : undefined;

  return (
    <section
      className="astro-fallback"
      aria-label="Astronomy catalog without interactive sky"
    >
      <header className="astro-fallback__banner">
        <h2 className="astro-fallback__title">Interactive sky unavailable</h2>
        <p className="astro-fallback__reason">{reason}</p>
        <p className="astro-fallback__note">
          Portfolio content and personal astrophotography remain available below.
          You can search and browse catalog objects without WebGL.
        </p>
        <div className="astro-fallback__actions">
          {onRetry ? (
            <button type="button" className="astro-fallback__button" onClick={onRetry}>
              Try again
            </button>
          ) : null}
          {onReturnToPortfolio ? (
            <button
              type="button"
              className="astro-fallback__button astro-fallback__button--secondary"
              onClick={onReturnToPortfolio}
            >
              Return to portfolio
            </button>
          ) : null}
        </div>
      </header>

      <div className="astro-fallback__layout">
        <div className="astro-fallback__list-pane">
          <label className="astro-fallback__search-label" htmlFor="astro-fallback-search">
            Search or browse deep-sky objects
          </label>
          <input
            id="astro-fallback-search"
            className="astro-fallback__search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search M31, Orion Nebula…"
            autoComplete="off"
            spellCheck={false}
          />
          <ul className="astro-fallback__list" role="list">
            {results.map(({ object }) => {
              const catalog = object.catalogIds[0]
                ? formatCatalogIdentifier(object.catalogIds[0])
                : null;
              const photographed = hasPersonalCapture(object.id);
              return (
                <li key={object.id}>
                  <button
                    type="button"
                    className={
                      selectedId === object.id
                        ? "astro-fallback__item is-active"
                        : "astro-fallback__item"
                    }
                    aria-current={selectedId === object.id ? "true" : undefined}
                    onClick={() => setSelectedId(object.id)}
                  >
                    <span className="astro-fallback__item-name">{object.commonName}</span>
                    <span className="astro-fallback__item-meta">
                      {catalog ?? formatObjectType(object.objectType)}
                      {photographed ? " · Photographed" : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="astro-fallback__detail-pane">
          {selected ? (
            <DeepSkyObjectDetails object={selected} headingId="astro-fallback-heading" />
          ) : (
            <p className="astro-fallback__empty">
              Select an object to read catalog details and open available photographs.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
