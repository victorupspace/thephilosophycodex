"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/pt";

export interface SearchLabels {
  search: Dictionary["search"];
  entity: Dictionary["entity"];
  a11y: Pick<Dictionary["a11y"], "searchDialog" | "closeDialog">;
}

interface SearchContextValue {
  locale: Locale;
  labels: SearchLabels;
  open: boolean;
  /** Increments on every open; used as a React key so the dialog remounts with fresh state. */
  session: number;
  initialQuery: string;
  openPalette: (query?: string) => void;
  closePalette: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ locale, labels, children }: { locale: Locale; labels: SearchLabels; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const [initialQuery, setInitialQuery] = useState("");

  const openPalette = useCallback((q = "") => { setInitialQuery(q); setSession((s) => s + 1); setOpen(true); }, []);
  const closePalette = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => { if (!o) { setSession((s) => s + 1); setInitialQuery(""); } return !o; });
      }
      if (e.key === "/" && !open) {
        const t = e.target as HTMLElement | null;
        const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
        if (!typing) { e.preventDefault(); setInitialQuery(""); setSession((s) => s + 1); setOpen(true); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(() => ({ locale, labels, open, session, initialQuery, openPalette, closePalette }), [locale, labels, open, session, initialQuery, openPalette, closePalette]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}
