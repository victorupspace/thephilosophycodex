import type { PeriodDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import Link from "next/link";
import { Timeline } from "@/components/timeline/Timeline";
import { Reveal } from "@/components/motion/Reveal";

export function TimelineSection({ locale, d, periods }: { locale: Locale; d: Dictionary; periods: PeriodDetail[] }) {
  return (
    <section className="section container" aria-labelledby="home-timeline">
      <Reveal className="section-head">
        <div>
          <h2 id="home-timeline" className="t-h2">{d.home.timelineTitle}</h2>
          <p className="t-lead">{d.home.timelineLead}</p>
        </div>
        <Link href={href(locale, "periods")} className="section-link">{d.nav.timeline}</Link>
      </Reveal>
      <Timeline locale={locale} d={d} periods={periods} variant="strip" />
    </section>
  );
}
