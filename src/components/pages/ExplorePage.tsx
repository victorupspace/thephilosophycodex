import Link from "next/link";
import { BookOpen, Compass, Hourglass, Layers, Lightbulb, User, ArrowUpRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href, type EntityKind } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { PageHeader } from "@/components/content/PageHeader";
import { CategoryCard } from "@/components/categories/CategoryCard";
import styles from "./ExplorePage.module.css";

export async function ExplorePage({ locale, d }: { locale: Locale; d: Dictionary }) {
  const repo = getRepository();
  const [concepts, philosophers, schools, categories, works, periods] = await Promise.all([
    repo.listConcepts(locale), repo.listPhilosophers(locale), repo.listSchools(locale), repo.listCategories(locale), repo.listWorks(locale), repo.listPeriods(locale),
  ]);
  const entries: { kind: EntityKind; label: string; lead: string; count: number; Icon: typeof Lightbulb; hue: number }[] = [
    { kind: "concepts", label: d.concept.indexTitle, lead: d.concept.indexLead, count: concepts.length, Icon: Lightbulb, hue: 230 },
    { kind: "philosophers", label: d.philosopher.indexTitle, lead: d.philosopher.indexLead, count: philosophers.length, Icon: User, hue: 20 },
    { kind: "schools", label: d.school.indexTitle, lead: d.school.indexLead, count: schools.length, Icon: Layers, hue: 160 },
    { kind: "categories", label: d.category.indexTitle, lead: d.category.indexLead, count: categories.length, Icon: Compass, hue: 300 },
    { kind: "works", label: d.work.indexTitle, lead: d.work.indexLead, count: works.length, Icon: BookOpen, hue: 45 },
    { kind: "periods", label: d.period.indexTitle, lead: d.period.indexLead, count: periods.length, Icon: Hourglass, hue: 200 },
  ];
  return (
    <>
      <PageHeader title={d.explore.title} lead={d.explore.lead} crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.explore.title }]} crumbsLabel={d.a11y.breadcrumb} />
      <div className="container" style={{ paddingBlock: "var(--s-10)" }}>
        <ul className={styles.entries}>
          {entries.map(({ kind, label, lead, count, Icon, hue }) => (
            <li key={kind}>
              <Link href={href(locale, kind)} className={styles.entry} style={{ "--h": hue } as React.CSSProperties}>
                <span className={styles.icon}><Icon size={22} /></span>
                <span className={styles.text}>
                  <span className={styles.label}>{label} <span className="t-meta">{count}</span></span>
                  <span className={styles.lead}>{lead}</span>
                </span>
                <ArrowUpRight size={20} className={styles.arrow} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <section className="section container" aria-labelledby="explore-categories">
        <div className="section-head"><div><h2 id="explore-categories" className="t-h2">{d.home.categoriesTitle}</h2></div></div>
        <ul className="grid grid--4">{categories.map((c) => <li key={c.id}><CategoryCard category={c} locale={locale} d={d} /></li>)}</ul>
      </section>
    </>
  );
}
