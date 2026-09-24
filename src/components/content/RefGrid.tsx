import type { EntityRef } from "@/lib/domain/types";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { Card, CardHead, CardSummary, CardTitle, Tag, TagList } from "@/components/ui";
import { ConceptTile } from "@/components/concepts/ConceptCard";
import { PhilosopherRow } from "@/components/philosophers/PhilosopherCard";

/** Grid of related entities; picks a presentation per kind. All use the compact card scale. */
export function RefGrid({ refs, locale, columns = 3 }: { refs: EntityRef[]; locale: Locale; columns?: 2 | 3 | 4 }) {
  if (!refs.length) return null;
  const kind = refs[0].kind;
  if (kind === "philosophers") {
    return <ul className={`grid grid--soft grid--${columns}`}>{refs.map((r) => <li key={r.id}><PhilosopherRow r={r} locale={locale} /></li>)}</ul>;
  }
  if (kind === "concepts") {
    return <ul className={`grid grid--soft grid--${columns}`}>{refs.map((r) => <li key={r.id}><ConceptTile r={r} locale={locale} /></li>)}</ul>;
  }
  return (
    <ul className={`grid grid--soft grid--${columns}`}>
      {refs.map((r) => (
        <li key={r.id}>
          <Card density="compact">
            {r.meta && <CardHead meta={r.meta} />}
            <CardTitle href={href(locale, r.kind, r.slug)}>{r.title}</CardTitle>
            {r.summary && <CardSummary clamp={3}>{r.summary}</CardSummary>}
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function RefTags({ refs, locale, ariaLabel }: { refs: EntityRef[]; locale: Locale; ariaLabel?: string }) {
  if (!refs.length) return null;
  return (
    <TagList ariaLabel={ariaLabel}>
      {refs.map((r) => <li key={r.id}><Tag href={href(locale, r.kind, r.slug)} meta={r.meta}>{r.title}</Tag></li>)}
    </TagList>
  );
}
