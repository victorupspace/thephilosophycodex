import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { normalize } from "@/lib/utils/text";
import { PageHeader } from "@/components/content/PageHeader";
import { TabNav } from "@/components/ui";
import styles from "./Index.module.css";

export async function ConceptsIndex({ locale, d }: { locale: Locale; d: Dictionary }) {
  const repo = getRepository();
  const [concepts, categories] = await Promise.all([repo.listConcepts(locale), repo.listCategories(locale)]);
  const list = concepts;

  const groups = new Map<string, typeof list>();
  for (const c of list) {
    const letter = normalize(c.t.title).charAt(0).toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(c);
  }
  const letters = Array.from(groups.keys()).sort();

  return (
    <>
      <PageHeader
        eyebrow={<span className="t-eyebrow">{d.entity.concepts}</span>}
        title={d.concept.indexTitle}
        lead={d.concept.indexLead}
        crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.concept.indexTitle }]}
        crumbsLabel={d.a11y.breadcrumb}
      />
      <div className="container" style={{ paddingTop: "var(--s-8)" }}>
        <TabNav
          ariaLabel={d.concept.byCategory}
          tabs={[
            { label: d.search.scopes.all, href: href(locale, "concepts"), current: true, count: concepts.length },
            ...categories.map((c) => ({ label: c.t.title, href: `${href(locale, "categories", c.t.slug)}#concepts`, count: c.conceptCount })),
          ]}
        />
      </div>
      <div className={`container ${styles.layout}`}>
        <nav className={styles.letters} aria-label={d.concept.byLetter}>
          <ul>
            {letters.map((l) => <li key={l}><a href={`#letter-${l}`}>{l}</a></li>)}
          </ul>
        </nav>
        <div className={styles.groups}>
          {letters.map((l) => (
            <section key={l} id={`letter-${l}`} className={styles.group} aria-label={l}>
              <h2 className={`t-display ${styles.letter}`} aria-hidden>{l}</h2>
              <ul className={styles.entries}>
                {groups.get(l)!.map((c) => (
                  <li key={c.id}>
                    <Link href={href(locale, "concepts", c.t.slug)} className={styles.entry}>
                      <span className={styles.entryTitle}>{c.t.title}</span>
                      <span className={styles.entrySummary}>{c.t.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {letters.length === 0 && <p className="t-muted">{d.content.empty}</p>}
        </div>
      </div>
    </>
  );
}
