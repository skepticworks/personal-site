/**
 * Normalize free-text astronomy search input for catalog matching.
 *
 * Handles common spacing / case variants such as:
 * `M 31`, `M31`, `m31`, `NGC224`, `NGC 224`
 *
 * Deliberately not fuzzy — over-permissive normalization produces unrelated hits.
 */

const CATALOG_PREFIXES = [
  "NGC",
  "IC",
  "UGC",
  "Mel",
  "HD",
  "HR",
  "HIP",
  "M",
] as const;

export function normalizeSearchQuery(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Produce compact tokens used for equality / prefix matching.
 * Strips spaces and punctuation between catalog letters and digits.
 */
export function normalizeCatalogToken(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * If the query looks like a catalog designation, return a canonical token
 * such as `m31` or `ngc224`. Otherwise return null.
 */
export function normalizeCatalogQuery(raw: string): string | null {
  const compact = normalizeCatalogToken(raw);
  if (!compact) {
    return null;
  }

  for (const catalog of CATALOG_PREFIXES) {
    const prefix = catalog.toLowerCase();
    if (compact === prefix) {
      return null;
    }
    if (compact.startsWith(prefix)) {
      const rest = compact.slice(prefix.length);
      if (/^\d+[a-z]?$/.test(rest)) {
        return `${prefix}${rest}`;
      }
    }
  }

  // Bare Messier numbers like "31" are too ambiguous alone — require prefix.
  return null;
}

/** Collapse a catalog identifier into the same token space as queries. */
export function catalogIdentifierToken(catalog: string, id: string): string {
  return normalizeCatalogToken(`${catalog}${id}`);
}

/** Lowercase alphanumeric run for substring matching on names. */
export function normalizeNameToken(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
