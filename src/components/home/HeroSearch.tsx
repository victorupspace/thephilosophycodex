"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/pt";
import { href, type EntityKind } from "@/lib/i18n/routes";
import { track } from "@/lib/analytics";
import { useSearch } from "@/components/search/SearchContext";
import { useSuggestions } from "@/components/search/useSuggestions";
import { EmptyResults, ResultList, resultHref } from "@/components/search/ResultList";
import styles from "./HeroSearch.module.css";

interface Props {
  locale: Locale; placeholder: string; submitLabel: string; examples: readonly string[]; examplesLabel: string;
  scopes: Dictionary["search"]["scopes"]; entity: Dictionary["entity"];
}

const kinds: EntityKind[] = ["concepts", "philosophers", "schools", "works", "categories", "periods"];

/**
 * Archive-style search: a full-width bordered field, then pill filters that
 * jump to each section index. Works without JS (plain GET form); with JS,
 * inline suggestions + keyboard navigation.
 */
export function HeroSearch({ locale, placeholder, submitLabel, examples, examplesLabel, entity }: Props) {
  const { labels } = useSearch();
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const started = useRef(false);
  const { results, loading } = useSuggestions(q, locale, undefined, 7);
  const open = focused && q.trim().length >= 2;

  const onChange = (v: string) => {
    setQ(v);
    if (!started.current && v.length > 0) { started.current = true; track("search_started", { locale, source: "hero" }); }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Escape") { setFocused(false); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); router.push(resultHref(locale, results[active])); }
  };

  return (
    <div className={styles.root}>
      <div className={styles.anchor}>
        <form action={href(locale, "search")} method="get" role="search" className={styles.form} onSubmit={() => setFocused(false)}>
          <Search size={20} className={styles.icon} aria-hidden />
          <input
            name="q" type="search" className={styles.input} placeholder={placeholder} aria-label={placeholder} value={q}
            onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 120)} onKeyDown={onKeyDown}
            role="combobox" aria-expanded={open && results.length > 0} aria-controls={listId}
            aria-activedescendant={open && results.length ? `${listId}-opt-${active}` : undefined} aria-autocomplete="list"
            autoComplete="off" spellCheck={false} enterKeyHint="search"
          />
          <button type="submit" className={styles.submit}>{submitLabel}</button>
        </form>
        {open && (
          <div className={styles.panel} onMouseDown={(e) => e.preventDefault()}>
            {results.length === 0 && !loading ? (
              <EmptyResults query={q.trim()} labels={labels} />
            ) : (
              <ResultList results={results} locale={locale} labels={labels} activeIndex={active} onHover={setActive} onSelect={() => setFocused(false)} listId={listId} grouped={false} />
            )}
          </div>
        )}
      </div>

      <div className={styles.row}>
        <ul className={styles.pills} aria-label={examplesLabel}>
          {kinds.map((k) => (
            <li key={k}><Link href={href(locale, k)} className={styles.pill}>{entity[k]}</Link></li>
          ))}
        </ul>
        <ul className={styles.examples} aria-label={examplesLabel}>
          {examples.map((ex) => (
            <li key={ex}>
              <a href={href(locale, "search", undefined, { q: ex })} onClick={(e) => { e.preventDefault(); setQ(ex); setFocused(true); }}>{ex}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
