import type { PhilosopherView, EntityRef } from "@/lib/domain/types";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { formatLifespan } from "@/lib/utils/dates";
import { Badge, Card, CardFooter, CardHead, CardSummary, CardTitle } from "@/components/ui";

/**
 * Head: lifespan left, period pill right (the period classifies the thinker,
 * the way a section classifies an essay). Footer: up to two areas of work.
 */
export function PhilosopherCard({ p, locale, compact, periodLabel }: { p: PhilosopherView; locale: Locale; compact?: boolean; periodLabel?: string }) {
  const areas = p.t.areas?.slice(0, 2) ?? [];
  return (
    <Card density={compact ? "compact" : "default"}>
      <CardHead meta={formatLifespan(p.birthYear, p.deathYear, locale, p.birthYearApprox)} tag={periodLabel ? <Badge>{periodLabel}</Badge> : undefined} />
      <CardTitle href={href(locale, "philosophers", p.t.slug)}>{p.t.title}</CardTitle>
      {!compact && <CardSummary>{p.t.summary}</CardSummary>}
      {!compact && areas.length > 0 && <CardFooter>{areas.join(", ")}</CardFooter>}
    </Card>
  );
}

/** Dense row for relation lists: lifespan above the name. */
export function PhilosopherRow({ r, locale }: { r: EntityRef; locale: Locale }) {
  return (
    <Card density="compact">
      {r.meta && <CardHead meta={r.meta} />}
      <CardTitle href={href(locale, "philosophers", r.slug)}>{r.title}</CardTitle>
    </Card>
  );
}
