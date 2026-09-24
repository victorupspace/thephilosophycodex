"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { EntityKind } from "@/lib/i18n/routes";
import type { SearchResponse, SearchResult } from "@/lib/search/types";
import { track } from "@/lib/analytics";

interface State { results: SearchResult[]; loading: boolean; total: number; error: boolean }

const cache = new Map<string, SearchResponse>();
const EMPTY: State = { results: [], loading: false, total: 0, error: false };

/**
 * Debounced autocomplete against /api/search with an in-memory cache.
 * State is derived: the effect only performs the network request and records
 * its outcome; everything else is computed from (query, cache, last fetch).
 */
export function useSuggestions(query: string, locale: Locale, kinds?: EntityKind[], limit = 10): State {
  const [fetched, setFetched] = useState<{ key: string; data: SearchResponse | null } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const q = query.trim();
  const kindKey = kinds?.join(",") ?? "";
  const key = `${locale}|${kindKey}|${limit}|${q.toLowerCase()}`;
  const active = q.length >= 2;
  const cached = active ? cache.get(key) : undefined;

  useEffect(() => {
    if (!active || cache.has(key)) return;
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const params = new URLSearchParams({ q, locale, limit: String(limit) });
        if (kindKey) params.set("kinds", kindKey);
        const res = await fetch(`/api/search?${params}`, { signal: controller.signal });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as SearchResponse;
        cache.set(key, data);
        setFetched({ key, data });
        track("search_completed", { locale, query: q, results: data.total, tookMs: data.tookMs });
      } catch (err) {
        if ((err as Error).name !== "AbortError") setFetched({ key, data: null });
      }
    }, 140);
    return () => clearTimeout(timer);
  }, [active, key, q, locale, kindKey, limit]);

  // Memoized so consumers can rely on referential stability of `results`
  // (the palette resets its active index when the array identity changes).
  return useMemo<State>(() => {
    if (!active) return EMPTY;
    if (cached) return { results: cached.results, loading: false, total: cached.total, error: false };
    if (fetched?.key === key) {
      return fetched.data ? { results: fetched.data.results, loading: false, total: fetched.data.total, error: false } : { ...EMPTY, error: true };
    }
    // Keep previous results visible while the next query loads (no flicker).
    const prev = fetched?.data;
    return { results: prev?.results ?? EMPTY.results, loading: true, total: prev?.total ?? 0, error: false };
  }, [active, cached, fetched, key]);
}
