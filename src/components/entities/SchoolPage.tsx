import Link from "next/link";
import type { SchoolDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo/json-ld";
import { formatDate, formatYear } from "@/lib/utils/dates";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleLayout, ContentSection, RailBlock } from "@/components/content/Section";
import { FallbackNotice, PendingNotice } from "@/components/content/Notices";
import { RichText } from "@/components/content/RichText";
import { RefGrid, RefTags } from "@/components/content/RefGrid";
import { Badge } from "@/components/ui";
import { OtherLanguages } from "./OtherLanguages";
import styles from "./Entity.module.css";

export function SchoolPage({ locale, d, s }: { locale: Locale; d: Dictionary; s: SchoolDetail }) {
  const t = s.t;
  const crumbs = [{ label: d.nav.home, href: href(locale) }, { label: d.school.indexTitle, href: href(locale, "schools") }, { label: t.title }];
  return (
    <article>
      <JsonLd data={[collectionJsonLd(s, "schools"), breadcrumbJsonLd(crumbs.map((x) => ({ name: x.label, path: x.href ?? href(locale, "schools", t.slug) })))]} />
      <PageHeader
        size="entity"
        hue={160}
        crumbs={crumbs}
        crumbsLabel={d.a11y.breadcrumb}
        eyebrow={<><Badge variant="tint" hue={160}>{d.entity.school}</Badge>{s.period && <Badge variant="outline">{s.period.title}</Badge>}{s.isFallback && <Badge variant="gold">{s.resolvedLocale.toUpperCase()}</Badge>}</>}
        title={t.title}
        lead={t.summary}
        aside={
          <dl className={styles.facts}>
            <div className={styles.fact}><dt className="t-eyebrow">{d.school.period}</dt><dd>{s.period ? <Link href={href(locale, "periods", s.period.slug)}>{s.period.title}</Link> : "—"}</dd></div>
            {s.startYear !== null && <div className={styles.fact}><dt className="t-eyebrow">{d.period.span}</dt><dd>{formatYear(s.startYear, locale)} – {s.endYear !== null ? formatYear(s.endYear, locale) : d.period.present}</dd></div>}
          </dl>
        }
      >
        {s.isFallback && <FallbackNotice locale={locale} resolved={s.resolvedLocale} d={d} />}
      </PageHeader>
      <ArticleLayout
        rail={
          <>
            {s.related.length > 0 && <RailBlock title={d.school.related}><ul>{s.related.map((r) => <li key={r.id}><Link href={href(locale, "schools", r.slug)}>{r.title}</Link></li>)}</ul></RailBlock>}
            {s.influencedBy.length > 0 && <RailBlock title={d.school.influences}><ul>{s.influencedBy.map((r) => <li key={r.id}><Link href={href(locale, "schools", r.slug)}>{r.title}</Link></li>)}</ul></RailBlock>}
            {s.influenced.length > 0 && <RailBlock title={d.philosopher.influenced}><ul>{s.influenced.map((r) => <li key={r.id}><Link href={href(locale, "schools", r.slug)}>{r.title}</Link></li>)}</ul></RailBlock>}
            <RailBlock title={d.content.updated}><p className="t-meta">{formatDate(s.updatedAt, locale)}</p></RailBlock>
          </>
        }
      >
        <ContentSection id="definition" title={d.school.definition}>
          {t.definition ? <p className={`prose prose--serif ${styles.definition}`}>{t.definition}</p> : <PendingNotice d={d} />}
          {t.body && <div className={styles.body}><RichText body={t.body} /></div>}
        </ContentSection>
        {s.philosophers.length > 0 && <ContentSection id="philosophers" title={d.school.philosophers} count={s.philosophers.length}><RefGrid refs={s.philosophers} locale={locale} columns={2} /></ContentSection>}
        {s.concepts.length > 0 && <ContentSection id="concepts" title={d.school.concepts} count={s.concepts.length}><RefGrid refs={s.concepts} locale={locale} /></ContentSection>}
        {s.works.length > 0 && <ContentSection id="works" title={d.school.works} count={s.works.length}><RefGrid refs={s.works} locale={locale} columns={2} /></ContentSection>}
        {(s.influencedBy.length > 0 || s.related.length > 0) && (
          <ContentSection id="influences" title={d.school.influences}>
            <div className={styles.stack}>
              {s.influencedBy.length > 0 && <RefTags refs={s.influencedBy} locale={locale} />}
              {s.related.length > 0 && <div><p className="t-eyebrow" style={{ marginBottom: "var(--s-2)" }}>{d.school.related}</p><RefTags refs={s.related} locale={locale} /></div>}
            </div>
          </ContentSection>
        )}
        <ContentSection id="languages" title={d.concept.otherLanguages}><OtherLanguages entity={s} kind="schools" current={locale} /></ContentSection>
      </ArticleLayout>
    </article>
  );
}
