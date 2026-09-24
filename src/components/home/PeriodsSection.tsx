import type { PeriodDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { format } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { formatSpan } from "@/lib/utils/dates";
import { Card, CardFooter, CardHead, CardSummary, CardTitle } from "@/components/ui";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function PeriodsSection({ locale, d, periods }: { locale: Locale; d: Dictionary; periods: PeriodDetail[] }) {
  return (
    <section className="section container" aria-labelledby="home-periods">
      <Reveal className="section-head">
        <div><h2 id="home-periods" className="t-h2">{d.home.periodsTitle}</h2></div>
      </Reveal>
      <Reveal stagger={0.05}>
        <ul className="grid grid--3">
          {periods.map((p) => {
            const nPhilosophers = p.philosophers.length;
            const nConcepts = p.concepts.length;
            // Zero counts are omitted rather than printed: "0 filósofos" is noise, not a fact.
            const counts = [
              nPhilosophers > 0 && format(nPhilosophers === 1 ? d.category.philosopherCountOne : d.category.philosopherCount, { count: nPhilosophers }),
              nConcepts > 0 && format(nConcepts === 1 ? d.category.conceptCountOne : d.category.conceptCount, { count: nConcepts }),
            ].filter((x): x is string => typeof x === "string");
            return (
              <RevealItem key={p.id} as="li" className="grid-li">
                <Card>
                  <CardHead meta={formatSpan(p.startYear, p.endYear, locale, d.period.present)} />
                  <CardTitle href={href(locale, "periods", p.t.slug)}>{p.t.title}</CardTitle>
                  <CardSummary>{p.t.summary}</CardSummary>
                  {counts.length > 0 && <CardFooter>{counts.join(" · ")}</CardFooter>}
                </Card>
              </RevealItem>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
