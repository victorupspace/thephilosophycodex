import type { Locale } from "@/lib/i18n/config";
import type { EntityKind } from "@/lib/i18n/routes";

export interface SearchDocument {
  id: string;
  entityId: string;
  kind: EntityKind;
  locale: Locale;
  title: string;
  slug: string;
  summary: string;
  /** Additional searchable strings: synonyms, aliases, near terms, titles in other locales. */
  aliases: string[];
  /** Short metadata line for result rendering. */
  meta?: string;
  hue?: number;
  weight: number;
}

export interface SearchResult {
  id: string;
  kind: EntityKind;
  locale: Locale;
  title: string;
  slug: string;
  summary: string;
  meta?: string;
  hue?: number;
  score: number;
  /** What matched: "title" | "alias" | "summary" | "fuzzy". */
  matchedOn: "title" | "alias" | "summary" | "fuzzy";
  /** The alias that matched, when relevant (e.g. searching "teoria do conhecimento" → Epistemologia). */
  matchedAlias?: string;
}

export interface SearchQuery {
  q: string;
  locale: Locale;
  kinds?: EntityKind[];
  limit?: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  tookMs: number;
}

export interface SearchProvider {
  readonly name: string;
  search(query: SearchQuery): Promise<SearchResponse>;
  /** Cheap prefix suggestions for autocomplete. */
  suggest(q: string, locale: Locale, limit?: number): Promise<SearchResult[]>;
}
