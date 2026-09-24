import type { PhilosopherView, PeriodDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import Link from "next/link";
import { PhilosopherCard } from "@/components/philosophers/PhilosopherCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import styles from "./PhilosophersSection.module.css";

export function PhilosophersSection({ locale, d, philosophers, periods }: { locale: Locale; d: Dictionary; philosophers: PhilosopherView[]; periods: PeriodDetail[] }) {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="home-philosophers">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <h2 id="home-philosophers" className="t-h2">{d.home.philosophersTitle}</h2>
            <p className="t-lead">{d.home.philosophersLead}</p>
          </div>
          <Link href={href(locale, "philosophers")} className="section-link">{d.home.seeAll}</Link>
        </Reveal>
        <Reveal stagger={0.04}>
          <ul className="grid grid--3">
            {philosophers.map((p) => (
              <RevealItem key={p.id} as="li" className="grid-li">
                <PhilosopherCard p={p} locale={locale} periodLabel={periods.find((x) => x.id === p.periodId)?.t.title} />
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
