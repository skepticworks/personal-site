"use client";

import type { DeepSkySearchHit } from "@/features/astronomy/search/searchDeepSkyObjects";

interface DeepSkySearchResultsProps {
  results: DeepSkySearchHit[];
  query: string;
  activeIndex: number;
  selectedObjectId: string | null;
  listId: string;
  onSelect: (objectId: string) => void;
  onHoverIndex: (index: number) => void;
}

export function DeepSkySearchResults({
  results,
  query,
  activeIndex,
  selectedObjectId,
  listId,
  onSelect,
  onHoverIndex,
}: DeepSkySearchResultsProps) {
  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="dso-search__empty" role="status">
        No objects found
      </div>
    );
  }

  return (
    <ul id={listId} className="dso-search__results" role="listbox">
      {results.map((hit, index) => {
        const selected = hit.object.id === selectedObjectId;
        const active = index === activeIndex;
        return (
          <li key={hit.object.id} role="presentation">
            <button
              type="button"
              role="option"
              id={`${listId}-option-${index}`}
              className={[
                "dso-search__result",
                active ? "dso-search__result--active" : "",
                selected ? "dso-search__result--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-selected={active}
              onMouseEnter={() => onHoverIndex(index)}
              onClick={() => onSelect(hit.object.id)}
            >
              <span className="dso-search__result-name">
                {hit.object.commonName}
              </span>
              <span className="dso-search__result-meta">
                {hit.catalogSummary}
              </span>
              <span className="dso-search__result-meta">
                {hit.typeLabel}
                {hit.object.constellation
                  ? ` · ${hit.object.constellation}`
                  : ""}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
