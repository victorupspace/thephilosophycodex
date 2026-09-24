import Link from "next/link";
import type { WorkDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { breadcrumbJsonLd, workJsonLd } from "@/lib/seo/json-ld";
import { formatDate, formatYear } from "@/lib/utils/dates";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleLayout, ContentSection, EmptyNote, RailBlock } from "@/components/content/Section";
import { FallbackNotice, PendingNotice } from "@/components/content/Notices";
import { RichText } from "@/components/content/RichText";
import { RefGrid } from "@/components/content/RefGrid";
import { Badge, CitationList } from "@/components/ui";
import { OtherLanguages } from "./OtherLanguages";
import styles from "./Entity.module.css";

export function WorkPage({ locale, d, w }: { locale: Locale; d: Dictionary; w: WorkDetail }) {
  const t = w.t;
  const crumbs = [{ label: d.nav.home, href: href(locale) }, { label: d.work.indexTitle, href: href(locale, "works") }, { label: t.title }];
  return (
    <article>
      <JsonLd data={[workJsonLd(w), breadcrumbJsonLd(crumbs.map((x) => ({ name: x.label, path: x.href ?? href(locale, "works", t.slug) })))]} />
      <PageHeader
        size="entity"
        hue={45}
        crumbs={crumbs}
        crumbsLabel={d.a11y.breadcrumb}
        eyebrow={<><Badge variant="tint" hue={45}>{d.entity.work}</Badge>{w.isFallback && <Badge variant="gold">{w.resolvedLocale.toUpperCase()}</Badge>}</>}
        title={t.title}
        lead={t.summary}
        aside={
          <dl className={styles.facts}>
            {w.author && <div className={styles.fact}><dt className="t-eyebrow">{d.work.author}</dt><dd><Link href={href(locale, "philosophers", w.author.slug)}>{w.author.title}</Link></dd></div>}
            <div className={styles.fact}><dt className="t-eyebrow">{d.work.year}</dt><dd>{formatYear(w.year, locale, w.yearApprox) || "—"}</dd></div>
            <div className={styles.fact}><dt className="t-eyebrow">{d.work.originalTitle}</dt><dd lang={w.originalLanguage} style={{ fontStyle: "italic" }}>{w.originalTitle}</dd></div>
          </dl>
        }
      >
        {w.isFallback && <FallbackNotice locale={locale} resolved={w.resolvedLocale} d={d} />}
      </PageHeader>
      <ArticleLayout rail={<RailBlock title={d.content.updated}><p className="t-meta">{formatDate(w.updatedAt, locale)}</p></RailBlock>}>
        <ContentSection id="summary" title={d.work.summary}>
          {t.body ? <RichText body={t.body} /> : <PendingNotice d={d} />}
        </ContentSection>
        <ContentSection id="concepts" title={d.work.concepts} count={w.concepts.length}>
          {w.concepts.length ? <RefGrid refs={w.concepts} locale={locale} /> : <EmptyNote>{d.content.empty}</EmptyNote>}
        </ContentSection>
        <ContentSection id="languages" title={d.concept.otherLanguages}><OtherLanguages entity={w} kind="works" current={locale} /></ContentSection>
        <ContentSection id="references" title={d.work.references}>
          {w.sources.length ? <CitationList sources={w.sources} /> : <EmptyNote>{d.content.pending}</EmptyNote>}
        </ContentSection>
      </ArticleLayout>
    </article>
  );
}
