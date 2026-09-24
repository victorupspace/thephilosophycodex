import Link from "next/link";
import type { ConceptDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { breadcrumbJsonLd, conceptJsonLd } from "@/lib/seo/json-ld";
import { formatDate } from "@/lib/utils/dates";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleLayout, ContentSection, EmptyNote, RailBlock } from "@/components/content/Section";
import { FallbackNotice, PendingNotice } from "@/components/content/Notices";
import { RichText } from "@/components/content/RichText";
import { RefGrid, RefTags } from "@/components/content/RefGrid";
import { Badge, CitationList, Tag, TagList } from "@/components/ui";
import { Timeline } from "@/components/timeline/Timeline";
import { getRepository } from "@/lib/data";
import { OtherLanguages } from "./OtherLanguages";
import { ViewTracker } from "./ViewTracker";
import styles from "./Entity.module.css";

export async function ConceptPage({ locale, d, c }: { locale: Locale; d: Dictionary; c: ConceptDetail }) {
  const t = c.t;
  const hue = c.categories[0]?.hue ?? 230;
  const allPeriods = c.periods.length ? await getRepository().listPeriods(locale) : [];
  const relatedPeriodIds = new Set(c.periods.map((p) => p.id));
  const crumbs = [
    { label: d.nav.home, href: href(locale) },
    { label: d.concept.indexTitle, href: href(locale, "concepts") },
    { label: t.title },
  ];
  const sections = [
    { id: "definition", label: d.concept.definition, show: true },
    { id: "etymology", label: d.concept.etymology, show: !!t.etymology },
    { id: "related", label: d.concept.related, show: c.related.length + c.broader.length + c.narrower.length + c.opposite.length > 0 },
    { id: "philosophers", label: d.concept.philosophers, show: c.philosophers.length > 0 },
    { id: "schools", label: d.concept.schools, show: c.schools.length > 0 },
    { id: "periods", label: d.concept.periods, show: c.periods.length > 0 },
    { id: "synonyms", label: d.concept.synonyms, show: !!(t.synonyms?.length || t.nearTerms?.length) },
    { id: "languages", label: d.concept.otherLanguages, show: true },
    { id: "references", label: d.concept.references, show: c.sources.length > 0 },
  ].filter((s) => s.show);

  return (
    <article>
      <ViewTracker event="concept_viewed" locale={locale} id={c.id} slug={t.slug} />
      <JsonLd data={[conceptJsonLd(c), breadcrumbJsonLd(crumbs.map((x) => ({ name: x.label, path: x.href ?? href(locale, "concepts", t.slug) })))]} />
      <PageHeader
        size="entity"
        hue={hue}
        crumbs={crumbs}
        crumbsLabel={d.a11y.breadcrumb}
        eyebrow={
          <>
            <Badge variant="tint" hue={hue}>{d.entity.concept}</Badge>
            {c.categories.map((cat) => <Badge key={cat.id} variant="outline" hue={cat.hue}>{cat.title}</Badge>)}
            {c.isFallback && <Badge variant="gold">{c.resolvedLocale.toUpperCase()}</Badge>}
          </>
        }
        title={t.title}
        lead={t.summary}
        aside={
          t.synonyms?.length ? (
            <div>
              <p className="t-eyebrow">{d.concept.synonyms}</p>
              <TagList>{t.synonyms.slice(0, 4).map((s) => <li key={s}><Tag>{s}</Tag></li>)}</TagList>
            </div>
          ) : undefined
        }
      >
        {c.isFallback && <FallbackNotice locale={locale} resolved={c.resolvedLocale} d={d} />}
      </PageHeader>

      <ArticleLayout
        rail={
          <>
            <RailBlock title={d.content.breadcrumb}>
              <ul className={styles.toc}>
                {sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>)}
              </ul>
            </RailBlock>
            {c.categories.length > 0 && (
              <RailBlock title={d.concept.categories}>
                <ul>{c.categories.map((cat) => <li key={cat.id}><Link href={href(locale, "categories", cat.slug)}>{cat.title}</Link></li>)}</ul>
              </RailBlock>
            )}
            {c.works.length > 0 && (
              <RailBlock title={d.concept.works}>
                <ul>{c.works.map((w) => <li key={w.id}><Link href={href(locale, "works", w.slug)}>{w.title}</Link> <span className="t-meta">{w.meta}</span></li>)}</ul>
              </RailBlock>
            )}
            <RailBlock title={d.content.updated}>
              <p className="t-meta">{formatDate(c.updatedAt, locale)}</p>
            </RailBlock>
          </>
        }
      >
        <ContentSection id="definition" title={d.concept.definition}>
          {t.definition ? <p className={`prose prose--serif ${styles.definition}`}>{t.definition}</p> : <PendingNotice d={d} />}
          {t.body ? <div className={styles.body}><RichText body={t.body} /></div> : t.definition ? <div className={styles.body}><PendingNotice d={d} /></div> : null}
        </ContentSection>

        {t.etymology && (
          <ContentSection id="etymology" title={d.concept.etymology}>
            <p className="prose">{t.etymology}</p>
          </ContentSection>
        )}

        {(c.related.length + c.broader.length + c.narrower.length + c.opposite.length > 0) && (
          <ContentSection id="related" title={d.concept.related}>
            <div className={styles.stack}>
              {c.broader.length > 0 && <div><p className="t-eyebrow">{d.concept.broader}</p><RefTags refs={c.broader} locale={locale} ariaLabel={d.concept.broader} /></div>}
              {c.related.length > 0 && <RefGrid refs={c.related} locale={locale} />}
              {c.narrower.length > 0 && <div><p className="t-eyebrow">{d.concept.narrower}</p><RefGrid refs={c.narrower} locale={locale} /></div>}
              {c.opposite.length > 0 && <div><p className="t-eyebrow">{d.concept.opposite}</p><RefTags refs={c.opposite} locale={locale} ariaLabel={d.concept.opposite} /></div>}
            </div>
          </ContentSection>
        )}

        {c.philosophers.length > 0 && (
          <ContentSection id="philosophers" title={d.concept.philosophers} count={c.philosophers.length}>
            <RefGrid refs={c.philosophers} locale={locale} columns={2} />
          </ContentSection>
        )}

        {c.schools.length > 0 && (
          <ContentSection id="schools" title={d.concept.schools} count={c.schools.length}>
            <RefGrid refs={c.schools} locale={locale} />
          </ContentSection>
        )}

        {c.periods.length > 0 && (
          <ContentSection id="periods" title={d.concept.periods}>
            <Timeline locale={locale} d={d} periods={allPeriods.filter((p) => relatedPeriodIds.has(p.id))} variant="strip" />
          </ContentSection>
        )}

        {(t.synonyms?.length || t.nearTerms?.length) ? (
          <ContentSection id="synonyms" title={d.concept.synonyms}>
            <dl className={styles.termList}>
              {t.synonyms?.length ? <div><dt className="t-eyebrow">{d.concept.synonyms}</dt><dd><TagList>{t.synonyms.map((s) => <li key={s}><Tag>{s}</Tag></li>)}</TagList></dd></div> : null}
              {t.nearTerms?.length ? <div><dt className="t-eyebrow">{d.concept.nearTerms}</dt><dd><TagList>{t.nearTerms.map((s) => <li key={s}><Tag>{s}</Tag></li>)}</TagList></dd></div> : null}
            </dl>
          </ContentSection>
        ) : null}

        <ContentSection id="languages" title={d.concept.otherLanguages}>
          <OtherLanguages entity={c} kind="concepts" current={locale} />
        </ContentSection>

        {c.sources.length > 0 ? (
          <ContentSection id="references" title={d.concept.references}>
            <CitationList sources={c.sources} />
          </ContentSection>
        ) : (
          <ContentSection id="references" title={d.concept.references}><EmptyNote>{d.content.pending}</EmptyNote></ContentSection>
        )}
      </ArticleLayout>
    </article>
  );
}
