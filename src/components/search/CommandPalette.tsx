"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { href } from "@/lib/i18n/routes";
import type { SearchResult } from "@/lib/search/types";
import { track } from "@/lib/analytics";
import { useSearch } from "./SearchContext";
import { useSuggestions } from "./useSuggestions";
import { EmptyResults, ResultList, resultHref } from "./ResultList";
import styles from "./CommandPalette.module.css";

const RECENT_KEY = "codex:recent-searches";
type Scope = "all" | "concepts" | "philosophers" | "works" | "categories" | "schools";
const scopes: Scope[] = ["all", "concepts", "philosophers", "works", "categories", "schools"];

function readRecent(): string[] {
  try { return typeof window === "undefined" ? [] : (JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[]); } catch { return []; }
}
function pushRecent(q: string) {
  try {
    const next = [q, ...readRecent().filter((x) => x !== q)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* storage unavailable */ }
}

/** Shell: mounts a fresh <PaletteDialog> per open session so its state starts clean. */
export function CommandPalette() {
  const { open, session } = useSearch();
  return <AnimatePresence>{open && <PaletteDialog key={session} />}</AnimatePresence>;
}

function PaletteDialog() {
  const { locale, labels, initialQuery, closePalette } = useSearch();
  const router = useRouter();
  const reduce = useReducedMotion();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<Scope>("all");
  const [recent] = useState<string[]>(readRecent);
  const { results, loading, total } = useSuggestions(query, locale, scope === "all" ? undefined : [scope], 12);

  // Active index resets whenever the result set changes (derived state, no effect).
  const [activeState, setActiveState] = useState<{ results: SearchResult[]; idx: number }>({ results, idx: 0 });
  if (activeState.results !== results) setActiveState({ results, idx: 0 });
  const active = activeState.idx;
  const setActive = (updater: number | ((a: number) => number)) =>
    setActiveState((s) => ({ results: s.results, idx: typeof updater === "function" ? updater(s.idx) : updater }));

  useEffect(() => {
    track("search_started", { locale, source: "palette" });
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.body.style.overflow = prevOverflow; };
  }, [locale]);

  const select = (r: SearchResult) => {
    pushRecent(r.title);
    closePalette();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); closePalette(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); return; }
    if (e.key === "Tab" && results.length) { e.preventDefault(); setActive((a) => (a + (e.shiftKey ? -1 : 1) + results.length) % results.length); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) { select(r); router.push(resultHref(locale, r)); }
      else if (query.trim()) { pushRecent(query.trim()); closePalette(); router.push(href(locale, "search", undefined, { q: query.trim() })); }
    }
  };

  const trimmed = query.trim();
  return (
    <>
      <motion.div
        key="backdrop"
        className={styles.backdrop}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
        onClick={closePalette}
        aria-hidden
      />
      <motion.div
        key="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={labels.a11y.searchDialog}
        className={styles.dialog}
        initial={{ opacity: 0, y: reduce ? 0 : -12, scale: reduce ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.985 }}
        transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          <Search size={20} aria-hidden />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search.placeholder}
            aria-label={labels.search.placeholder}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-opt-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
          />
          <button type="button" className={styles.close} onClick={closePalette} aria-label={labels.a11y.closeDialog}><X size={18} /></button>
        </div>
        <div className={styles.scopes} role="group" aria-label={labels.search.scopes.all}>
          {scopes.map((s) => (
            <button key={s} type="button" className={styles.scope} aria-pressed={scope === s} onClick={() => setScope(s)}>
              {labels.search.scopes[s]}
            </button>
          ))}
        </div>
        <div className={styles.body}>
          {trimmed.length < 2 ? (
            <>
              <p className={styles.hint}>{labels.search.hint}</p>
              {recent.length > 0 && (
                <>
                  <p className={styles.hint} style={{ paddingBottom: 0 }}>{labels.search.recent}</p>
                  <div className={styles.recent}>
                    {recent.map((r) => <button key={r} type="button" onClick={() => setQuery(r)}>{r}</button>)}
                  </div>
                </>
              )}
            </>
          ) : results.length === 0 && !loading ? (
            <EmptyResults query={trimmed} labels={labels} />
          ) : (
            <>
              <ResultList results={results} locale={locale} labels={labels} activeIndex={active} onHover={setActive} onSelect={select} listId={listId} />
              {total > results.length && (
                <a className={styles.seeAll} href={href(locale, "search", undefined, { q: trimmed })} onClick={closePalette}>
                  {labels.search.seeAll} ({total})
                </a>
              )}
            </>
          )}
        </div>
        <div className={styles.footer} aria-hidden>
          <span><kbd>↑</kbd><kbd>↓</kbd>{labels.search.navigate}</span>
          <span><kbd>↵</kbd>{labels.search.select}</span>
          <span><kbd>esc</kbd>{labels.search.dismiss}</span>
        </div>
      </motion.div>
    </>
  );
}
