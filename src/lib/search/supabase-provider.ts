import type { Locale } from "@/lib/i18n/config";
import { createServiceClient } from "@/lib/supabase/server";
import { MemorySearchProvider } from "./memory-provider";
import type { SearchDocument, SearchProvider, SearchQuery, SearchResponse, SearchResult } from "./types";

/**
 * Postgres-backed provider. Calls the `search_content` SQL function
 * (tsvector + pg_trgm, see supabase/migrations/0001_schema.sql) and falls back
 * to the in-memory index when the RPC is unavailable. The interface is stable,
 * so a future embeddings-based ranking can be plugged in here without touching UI.
 */
export class SupabaseSearchProvider implements SearchProvider {
  readonly name = "supabase";
  private fallback: MemorySearchProvider;

  constructor(docs: SearchDocument[]) {
    this.fallback = new MemorySearchProvider(docs);
  }

  async search(query: SearchQuery): Promise<SearchResponse> {
    const started = performance.now();
    const client = createServiceClient();
    if (!client) return this.fallback.search(query);
    const { data, error } = await client.rpc("search_content", {
      p_query: query.q,
      p_locale: query.locale,
      p_kinds: query.kinds ?? null,
      p_limit: query.limit ?? 20,
    });
    if (error || !data) return this.fallback.search(query);
    const results = (data as SearchResult[]).map((r) => ({ ...r, matchedOn: r.matchedOn ?? "title" }));
    return { query: query.q, results, total: results.length, tookMs: Math.round(performance.now() - started) };
  }

  async suggest(q: string, locale: Locale, limit = 8): Promise<SearchResult[]> {
    return (await this.search({ q, locale, limit })).results;
  }
}
