import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { formatSpan } from "@/lib/utils/dates";
import { PageHeader } from "@/components/content/PageHeader";
import { PhilosopherCard } from "@/components/philosophers/PhilosopherCard";
import styles from "./Index.module.css";

export async function PhilosophersIndex({ locale, d }: { locale: Locale; d: Dictionary }) {
  const repo = getRepository();
  const [philosophers, periods] = await Promise.all([repo.listPhilosophers(locale), repo.listPeriods(locale)]);
  return (
    <>
      <PageHeader
        eyebrow={<span className="t-eyebrow">{d.entity.philosophers}</span>}
        title={d.philosopher.indexTitle}
        lead={d.philosopher.indexLead}
        crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.philosopher.indexTitle }]}
        crumbsLabel={d.a11y.breadcrumb}
      />
      <div className={`container ${styles.byPeriod}`}>
        {periods.map((p) => {
          const list = philosophers.filter((x) => x.periodId === p.id);
          if (!list.length) return null;
          return (
            <section key={p.id} aria-labelledby={`period-${p.id}`}>
              <div className={styles.periodHead}>
                <h2 id={`period-${p.id}`} className="t-h3"><Link href={href(locale, "periods", p.t.slug)}>{p.t.title}</Link></h2>
                <span className="t-meta">{formatSpan(p.startYear, p.endYear, locale, d.period.present)}</span>
              </div>
              <ul className="grid grid--3">
                {list.map((ph) => <li key={ph.id}><PhilosopherCard p={ph} locale={locale} periodLabel={p.t.title} /></li>)}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
