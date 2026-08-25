"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { selectCelestialObject } from "@/features/astronomy/actions/selectCelestialObject";
import { DeepSkySearchResults } from "@/features/astronomy/components/DeepSkySearchResults";
import { searchDeepSkyObjects } from "@/features/astronomy/search/searchDeepSkyObjects";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Compact floating deep-sky search. Uses a labeled input + result buttons
 * (not a partial combobox ARIA pattern).
 */
export function DeepSkySearch() {
  const selectedId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const inputId = `${baseId}-input`;

  const results = useMemo(
    () => searchDeepSkyObjects(query, { limit: 10 }),
    [query],
  );

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const showResults = open && query.trim().length > 0;
  const safeActiveIndex =
    results.length === 0
      ? 0
      : Math.min(activeIndex, results.length - 1);

  const choose = (objectId: string) => {
    selectCelestialObject(objectId, { focusCamera: true, updateUrl: true });
    setQuery("");
    setActiveIndex(0);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={rootRef} className="dso-search">
      <label className="dso-search__label" htmlFor={inputId}>
        Search deep-sky objects
      </label>
      <div className="dso-search__field">
        <input
          ref={inputRef}
          id={inputId}
          className="dso-search__input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search M31, Orion Nebula…"
          value={query}
          aria-controls={showResults ? listId : undefined}
          aria-activedescendant={
            showResults && results[safeActiveIndex]
              ? `${listId}-option-${safeActiveIndex}`
              : undefined
          }
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              if (query) {
                setQuery("");
                setActiveIndex(0);
              } else {
                setOpen(false);
                inputRef.current?.blur();
              }
              return;
            }
            if (!showResults || results.length === 0) {
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % results.length);
              return;
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex(
                (index) => (index - 1 + results.length) % results.length,
              );
              return;
            }
            if (event.key === "Enter") {
              event.preventDefault();
              const hit = results[safeActiveIndex] ?? results[0];
              if (hit) {
                choose(hit.object.id);
              }
            }
          }}
        />
      </div>
      {showResults ? (
        <DeepSkySearchResults
          results={results}
          query={query}
          activeIndex={safeActiveIndex}
          selectedObjectId={selectedId}
          listId={listId}
          onSelect={choose}
          onHoverIndex={setActiveIndex}
        />
      ) : null}
    </div>
  );
}
