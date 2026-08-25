import {
  formatCatalogIdentifier,
  formatObjectType,
} from "@/features/astronomy/formatting/astronomyFormatting";
import { listDeepSkyObjects } from "@/features/astronomy/data/deep-sky-objects";
import {
  catalogIdentifierToken,
  normalizeCatalogQuery,
  normalizeNameToken,
  normalizeSearchQuery,
} from "@/features/astronomy/search/normalizeSearch";
import type { CelestialObject } from "@/types/astronomy";

export interface DeepSkySearchHit {
  object: CelestialObject;
  score: number;
  /** Compact one-line catalog summary for result rows. */
  catalogSummary: string;
  typeLabel: string;
}

interface SearchIndexEntry {
  object: CelestialObject;
  primaryName: string;
  primaryCompact: string;
  aliases: string[];
  aliasCompacts: string[];
  catalogTokens: string[];
  catalogDisplay: string[];
  typeLabel: string;
  constellation: string;
}

const DEFAULT_LIMIT = 12;

let cachedIndex: SearchIndexEntry[] | null = null;

function buildSearchIndex(): SearchIndexEntry[] {
  return listDeepSkyObjects().map((object) => {
    const primaryName = normalizeNameToken(object.commonName);
    const aliases = (object.aliases ?? []).map(normalizeNameToken);
    const catalogDisplay = object.catalogIds.map(formatCatalogIdentifier);
    return {
      object,
      primaryName,
      primaryCompact: primaryName.replace(/\s+/g, ""),
      aliases,
      aliasCompacts: aliases.map((alias) => alias.replace(/\s+/g, "")),
      catalogTokens: object.catalogIds.map((entry) =>
        catalogIdentifierToken(entry.catalog, entry.id),
      ),
      catalogDisplay,
      typeLabel: formatObjectType(object.objectType),
      constellation: normalizeNameToken(object.constellation ?? ""),
    };
  });
}

function getSearchIndex(): SearchIndexEntry[] {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return cachedIndex;
}

/** Test helper — clears memoized index after catalog mutations. */
export function resetDeepSkySearchIndex(): void {
  cachedIndex = null;
}

/**
 * Client-side deep-sky search with deterministic ranking.
 *
 * Weighting (higher is better):
 * 1. Exact primary-name match
 * 2. Exact catalog-ID match
 * 3. Prefix matches (name / catalog)
 * 4. Alias matches
 * 5. Broader substring matches
 */
export function searchDeepSkyObjects(
  query: string,
  options?: { limit?: number },
): DeepSkySearchHit[] {
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const normalized = normalizeSearchQuery(query);
  if (!normalized) {
    return [];
  }

  const nameQuery = normalizeNameToken(normalized);
  const nameCompact = nameQuery.replace(/\s+/g, "");
  const catalogQuery = normalizeCatalogQuery(normalized);

  const hits: DeepSkySearchHit[] = [];

  for (const entry of getSearchIndex()) {
    const score = scoreEntry(entry, nameQuery, nameCompact, catalogQuery);
    if (score <= 0) {
      continue;
    }
    hits.push({
      object: entry.object,
      score,
      catalogSummary: entry.catalogDisplay.slice(0, 2).join(" · "),
      typeLabel: entry.typeLabel,
    });
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.object.commonName.localeCompare(b.object.commonName);
  });

  return hits.slice(0, limit);
}

function scoreEntry(
  entry: SearchIndexEntry,
  nameQuery: string,
  nameCompact: string,
  catalogQuery: string | null,
): number {
  let score = 0;

  if (nameQuery && entry.primaryName === nameQuery) {
    score = Math.max(score, 1000);
  } else if (nameCompact && entry.primaryCompact === nameCompact) {
    score = Math.max(score, 980);
  }

  if (catalogQuery) {
    for (const token of entry.catalogTokens) {
      if (token === catalogQuery) {
        score = Math.max(score, 950);
      } else if (token.startsWith(catalogQuery)) {
        score = Math.max(score, 700);
      } else if (catalogQuery.startsWith(token) && token.length >= 2) {
        score = Math.max(score, 500);
      }
    }
  }

  if (nameQuery) {
    if (entry.primaryName.startsWith(nameQuery)) {
      score = Math.max(score, 800);
    } else if (entry.primaryCompact.startsWith(nameCompact)) {
      score = Math.max(score, 760);
    }

    for (const alias of entry.aliases) {
      if (alias === nameQuery) {
        score = Math.max(score, 720);
      } else if (alias.startsWith(nameQuery)) {
        score = Math.max(score, 640);
      } else if (alias.includes(nameQuery)) {
        score = Math.max(score, 420);
      }
    }

    for (const compact of entry.aliasCompacts) {
      if (compact === nameCompact) {
        score = Math.max(score, 710);
      } else if (compact.startsWith(nameCompact)) {
        score = Math.max(score, 630);
      }
    }

    if (entry.primaryName.includes(nameQuery)) {
      score = Math.max(score, 400);
    } else if (entry.primaryCompact.includes(nameCompact) && nameCompact.length >= 3) {
      score = Math.max(score, 360);
    }

    if (entry.constellation === nameQuery) {
      score = Math.max(score, 300);
    } else if (
      entry.constellation &&
      entry.constellation.includes(nameQuery) &&
      nameQuery.length >= 4
    ) {
      score = Math.max(score, 220);
    }

    if (
      entry.typeLabel.toLowerCase().includes(nameQuery) &&
      nameQuery.length >= 4
    ) {
      score = Math.max(score, 180);
    }
  }

  // Also allow catalog-like tokens embedded in free text ("find ngc 224")
  if (!catalogQuery && nameCompact.length >= 2) {
    for (const token of entry.catalogTokens) {
      if (token === nameCompact) {
        score = Math.max(score, 900);
      } else if (token.startsWith(nameCompact) && nameCompact.length >= 3) {
        score = Math.max(score, 680);
      }
    }
  }

  return score;
}
