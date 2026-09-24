import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { formatYear } from "@/lib/utils/dates";
import { PageHeader } from "@/components/content/PageHeader";
import styles from "./WorksIndex.module.css";

export async function WorksIndex({ locale, d }: { locale: Locale; d: Dictionary }) {
  const works = await getRepository().listWorks(locale);
  return (
    <>
      <PageHeader
        eyebrow={<span className="t-eyebrow">{d.entity.works}</span>}
        title={d.work.indexTitle}
        lead={d.work.indexLead}
        crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.work.indexTitle }]}
        crumbsLabel={d.a11y.breadcrumb}
      />
      <div className="container" style={{ paddingBlock: "var(--s-10) var(--s-16)" }}>
        <ol className={styles.list}>
          {works.map((w) => (
            <li key={w.id} className={styles.row}>
              <span className={`t-meta ${styles.year}`}>{formatYear(w.year, locale, w.yearApprox)}</span>
              <div className={styles.text}>
                <Link href={href(locale, "works", w.t.slug)} className={styles.title}>{w.t.title}</Link>
                <span className={styles.original} lang={w.originalLanguage}>{w.originalTitle}</span>
              </div>
              {w.author && <Link href={href(locale, "philosophers", w.author.slug)} className={styles.author}>{w.author.title}</Link>}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
