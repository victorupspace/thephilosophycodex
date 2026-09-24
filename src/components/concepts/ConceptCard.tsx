import type { ConceptView, EntityRef } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { Badge, Card, CardHead, CardNote, CardSummary, CardTitle } from "@/components/ui";

/**
 * Cut a long definition at the last sentence boundary within `max` characters,
 * so an excerpt always ends on a full stop. Never a mid-word "…". If the first
 * sentence alone is longer than `max`, the text is returned whole.
 */
function excerpt(text: string, max = 260): string {
  if (text.length <= max) return text;
  const boundary = /[.!?]["')\]]*(?=\s)/g;
  let cut = 0;
  let m: RegExpExecArray | null;
  while ((m = boundary.exec(text)) !== null) {
    const end = m.index + m[0].length;
    if (end > max) break;
    cut = end;
  }
  return cut > 0 ? text.slice(0, cut) : text;
}

/** Up to two near terms, but never more than fits on one footer line at 4 columns. */
function nearTerms(synonyms: string[] | undefined): string[] {
  const list = synonyms ?? [];
  if (list.length < 2) return list;
  return list[0].length + list[1].length <= 26 ? list.slice(0, 2) : list.slice(0, 1);
}

/**
 * A concept has no date and no single parent class, so it starts at the title.
 * Footer: near terms (the fact a dictionary reader wants next); a missing
 * translation shows the resolved locale as a pill on the footer's right, so
 * title tops still align across the row.
 */
export function ConceptCard({ c, locale, d, editorial }: { c: ConceptView; locale: Locale; d: Dictionary; editorial?: boolean }) {
  const synonyms = nearTerms(c.t.synonyms);
  const body = editorial && c.t.definition ? excerpt(c.t.definition) : c.t.summary;
  const fallback = c.isFallback ? <Badge>{c.resolvedLocale.toUpperCase()}</Badge> : undefined;
  return (
    <Card>
      {/* Head: the near terms act as a dictionary gloss; a missing translation shows its locale. */}
      <CardHead
        meta={synonyms.length > 0 ? <><span className="visually-hidden">{d.concept.synonyms}: </span>{synonyms.join(" · ")}</> : undefined}
        tag={fallback}
      />
      <CardTitle href={href(locale, "concepts", c.t.slug)}>{c.t.title}</CardTitle>
      <CardSummary>{body}</CardSummary>
      {editorial && c.t.etymology && (
        <CardNote>
          <span className="visually-hidden">{d.concept.etymology}: </span>
          {c.t.etymology}
        </CardNote>
      )}
    </Card>
  );
}

/** Compact tile for relation grids. */
export function ConceptTile({ r, locale, kindLabel }: { r: EntityRef; locale: Locale; kindLabel?: string }) {
  const meta = kindLabel ?? r.meta;
  return (
    <Card density="compact">
      {meta && <CardHead meta={meta} />}
      <CardTitle href={href(locale, r.kind, r.slug)}>{r.title}</CardTitle>
      {r.summary && <CardSummary clamp={3}>{r.summary}</CardSummary>}
    </Card>
  );
}
