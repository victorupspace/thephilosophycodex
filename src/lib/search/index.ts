import { getRepository } from "@/lib/data";
import { MemorySearchProvider } from "./memory-provider";
import type { SearchProvider } from "./types";

let providerPromise: Promise<SearchProvider> | null = null;

/**
 * Returns the process-wide search provider. The in-memory index is built once
 * from the repository. When DATA_SOURCE=supabase and the `search_content` RPC
 * exists, swap this for SupabaseSearchProvider (same interface).
 */
export function getSearchProvider(): Promise<SearchProvider> {
  if (!providerPromise) {
    providerPromise = (async () => {
      const repo = getRepository();
      if (repo.source === "supabase") {
        const { SupabaseSearchProvider } = await import("./supabase-provider");
        return new SupabaseSearchProvider(await repo.getSearchDocuments());
      }
      return new MemorySearchProvider(await repo.getSearchDocuments());
    })();
  }
  return providerPromise;
}

export type { SearchDocument, SearchProvider, SearchQuery, SearchResponse, SearchResult } from "./types";
export { cleanQuery } from "./memory-provider";
