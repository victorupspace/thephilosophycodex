"use client";

import Link from "next/link";
import { BookOpen, Compass, Hourglass, Layers, Lightbulb, User } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href, type EntityKind } from "@/lib/i18n/routes";
import type { SearchResult } from "@/lib/search/types";
import type { SearchLabels } from "./SearchContext";
import styles from "./ResultList.module.css";

const icons: Record<EntityKind, typeof Lightbulb> = {
  concepts: Lightbulb, philosophers: User, schools: Layers, categories: Compass, works: BookOpen, periods: Hourglass,
};
const hues: Record<EntityKind, number> = { concepts: 230, philosophers: 20, schools: 160, categories: 300, works: 45, periods: 200 };
const order: EntityKind[] = ["concepts", "philosophers", "schools", "categories", "works", "periods"];

interface Props {
  results: SearchResult[];
  locale: Locale;
  labels: SearchLabels;
  activeIndex: number;
  onHover: (i: number) => void;
  onSelect: (r: SearchResult) => void;
  listId: string;
  grouped?: boolean;
}

export function resultHref(locale: Locale, r: SearchResult) {
  return href(locale, r.kind, r.slug);
}

export function ResultList({ results, locale, labels, activeIndex, onHover, onSelect, listId, grouped = true }: Props) {
  const rawGroups: { kind: EntityKind | null; items: SearchResult[] }[] = grouped
    ? order.map((k) => ({ kind: k, items: results.filter((r) => r.kind === k) })).filter((g) => g.items.length)
    : [{ kind: null, items: results }];
  // Flat option index across groups (for aria-activedescendant), computed without mutation.
  const groups = rawGroups.reduce<{ list: { kind: EntityKind | null; items: SearchResult[]; offset: number }[]; offset: number }>(
    (acc, g) => ({ list: [...acc.list, { ...g, offset: acc.offset }], offset: acc.offset + g.items.length }),
    { list: [], offset: 0 },
  ).list;
  return (
    <div id={listId} role="listbox" aria-label={labels.search.results}>
      {groups.map((g) => (
        <div key={g.kind ?? "all"} className={styles.group} role="group" aria-label={g.kind ? labels.entity[g.kind] : undefined}>
          {g.kind && <div className={styles.groupLabel}>{labels.entity[g.kind]}</div>}
          {g.items.map((r, j) => {
            const i = g.offset + j;
            const Icon = icons[r.kind];
            return (
              <Link
                key={r.id}
                href={resultHref(locale, r)}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={styles.item}
                style={{ "--h": r.hue ?? hues[r.kind] } as React.CSSProperties}
                onMouseEnter={() => onHover(i)}
                onClick={() => onSelect(r)}
                prefetch={i < 3}
              >
                <span className={styles.kind} aria-hidden><Icon size={16} /></span>
                <span className={styles.text}>
                  <span className={styles.title}>
                    {r.title}
                    {r.matchedAlias && r.matchedAlias.toLowerCase() !== r.title.toLowerCase() && (
                      <span className={styles.alias}>{labels.search.matchedOn} “{r.matchedAlias}”</span>
                    )}
                  </span>
                  <span className={styles.summary}>{r.summary}</span>
                </span>
                {r.meta && <span className={styles.meta}>{r.meta}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function EmptyResults({ query, labels }: { query: string; labels: SearchLabels }) {
  return (
    <div className={styles.empty}>
      <p>{labels.search.noResults} <strong>“{query}”</strong>.</p>
      <p>{labels.search.tryAgain}</p>
    </div>
  );
}
