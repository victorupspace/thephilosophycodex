import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { format } from "@/lib/i18n";
import { href, type EntityKind } from "@/lib/i18n/routes";
import { getSearchProvider } from "@/lib/search";
import { PageHeader } from "@/components/content/PageHeader";
import { Badge, Card, CardHead, CardNote, CardSummary, CardTitle, TabNav } from "@/components/ui";
import styles from "./SearchPage.module.css";

const kinds: EntityKind[] = ["concepts", "philosophers", "schools", "categories", "works", "periods"];

/** Server-rendered results page: works without JS and is the SearchAction target for structured data. */
export async function SearchPage({ locale, d, searchParams }: { locale: Locale; d: Dictionary; searchParams: Record<string, string | string[] | undefined> }) {
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const kindParam = typeof searchParams.kind === "string" && (kinds as string[]).includes(searchParams.kind) ? (searchParams.kind as EntityKind) : undefined;
  const provider = await getSearchProvider();
  const response = q ? await provider.search({ q, locale, kinds: kindParam ? [kindParam] : undefined, limit: 60 }) : null;

  return (
    <>
      <PageHeader
        eyebrow={<span className="t-eyebrow">{d.search.pageTitle}</span>}
        title={q ? <>{d.search.resultsFor} <em className={styles.q}>“{q}”</em></> : d.search.pageTitle}
        lead={response ? format(d.search.resultCount, { count: response.total }) : d.search.emptyQuery}
        crumbs={[{ label: d.nav.home, href: href(locale) }, { label: d.search.pageTitle }]}
        crumbsLabel={d.a11y.breadcrumb}
      >
        <form action={href(locale, "search")} method="get" role="search" className={styles.form}>
          <input name="q" type="search" defaultValue={q} placeholder={d.search.placeholder} aria-label={d.search.placeholder} className={styles.input} autoComplete="off" />
          {kindParam && <input type="hidden" name="kind" value={kindParam} />}
          <button type="submit" className={styles.submit}>{d.search.open}</button>
        </form>
      </PageHeader>
      {q && (
        <div className="container" style={{ paddingBlock: "var(--s-6) var(--s-16)" }}>
          <TabNav
            ariaLabel={d.search.scopes.all}
            tabs={[
              { label: d.search.scopes.all, href: href(locale, "search", undefined, { q }), current: !kindParam },
              ...kinds.map((k) => ({ label: d.entity[k], href: href(locale, "search", undefined, { q, kind: k }), current: kindParam === k })),
            ]}
          />
          {response && response.results.length === 0 ? (
            <div className={styles.empty}>
              <p className="t-lead">{d.search.noResults} <strong>“{q}”</strong>.</p>
              <p className="t-muted">{d.search.tryAgain}</p>
            </div>
          ) : (
            <ul className={`grid grid--3 ${styles.results}`}>
              {response?.results.map((r) => {
                const alias = r.matchedAlias && r.matchedAlias.toLowerCase() !== r.title.toLowerCase() ? r.matchedAlias : undefined;
                return (
                  <li key={r.id}>
                    {/* Results mix kinds, so here the kind pill carries information. */}
                    <Card density="list">
                      <CardHead meta={r.meta} tag={<Badge>{d.entity[r.kind]}</Badge>} />
                      <CardTitle href={href(locale, r.kind, r.slug)}>{r.title}</CardTitle>
                      <CardSummary>{r.summary}</CardSummary>
                      {alias && <CardNote>{d.search.matchedOn} “{alias}”</CardNote>}
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="t-meta" style={{ marginTop: "var(--s-8)" }}>
            <Link href={href(locale, "explore")}>{d.explore.title} →</Link>
          </p>
        </div>
      )}
    </>
  );
}
