import type { CategoryDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { format } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo/json-ld";
import { getRepository } from "@/lib/data";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleLayout, ContentSection, EmptyNote, RailBlock } from "@/components/content/Section";
import { FallbackNotice, PendingNotice } from "@/components/content/Notices";
import { RichText } from "@/components/content/RichText";
import { RefGrid } from "@/components/content/RefGrid";
import { Badge } from "@/components/ui";
import { Timeline } from "@/components/timeline/Timeline";
import { OtherLanguages } from "./OtherLanguages";
import { ViewTracker } from "./ViewTracker";
import styles from "./Entity.module.css";

export async function CategoryPage({ locale, d, c }: { locale: Locale; d: Dictionary; c: CategoryDetail }) {
  const t = c.t;
  const periods = c.periods.length ? await getRepository().listPeriods(locale) : [];
  const ids = new Set(c.periods.map((p) => p.id));
  const crumbs = [{ label: d.nav.home, href: href(locale) }, { label: d.category.indexTitle, href: href(locale, "categories") }, { label: t.title }];
  return (
    <article>
      <ViewTracker event="category_viewed" locale={locale} id={c.id} slug={t.slug} />
      <JsonLd data={[collectionJsonLd(c, "categories"), breadcrumbJsonLd(crumbs.map((x) => ({ name: x.label, path: x.href ?? href(locale, "categories", t.slug) })))]} />
      <PageHeader
        size="entity"
        hue={c.hue}
        crumbs={crumbs}
        crumbsLabel={d.a11y.breadcrumb}
        eyebrow={<><Badge variant="tint" hue={c.hue}>{d.entity.category}</Badge>{c.isFallback && <Badge variant="gold">{c.resolvedLocale.toUpperCase()}</Badge>}</>}
        title={t.title}
        lead={t.summary}
        aside={
          <dl className={styles.facts}>
            <div className={styles.fact}><dt className="t-eyebrow">{d.entity.concepts}</dt><dd>{c.conceptCount}</dd></div>
            <div className={styles.fact}><dt className="t-eyebrow">{d.entity.philosophers}</dt><dd>{c.philosopherCount}</dd></div>
          </dl>
        }
      >
        {c.isFallback && <FallbackNotice locale={locale} resolved={c.resolvedLocale} d={d} />}
      </PageHeader>
      <ArticleLayout
        rail={
          <RailBlock title={d.content.breadcrumb}>
            <ul className={styles.toc}>
              <li><a href="#introduction">{d.category.introduction}</a></li>
              {t.questions?.length ? <li><a href="#questions">{d.category.questions}</a></li> : null}
              {c.philosophers.length > 0 && <li><a href="#philosophers">{d.category.philosophers}</a></li>}
              {c.concepts.length > 0 && <li><a href="#concepts">{d.category.concepts}</a></li>}
              {c.schools.length > 0 && <li><a href="#schools">{d.category.schools}</a></li>}
              {c.periods.length > 0 && <li><a href="#periods">{d.category.periods}</a></li>}
              {c.works.length > 0 && <li><a href="#works">{d.category.works}</a></li>}
            </ul>
          </RailBlock>
        }
      >
        <ContentSection id="introduction" title={d.category.introduction}>
          {t.introduction ? <p className={`prose prose--serif ${styles.definition}`}>{t.introduction}</p> : <PendingNotice d={d} />}
          {t.definition && <div className={styles.body}><RichText body={t.definition} serif={false} /></div>}
        </ContentSection>
        {t.questions?.length ? (
          <ContentSection id="questions" title={d.category.questions}>
            <ul className={styles.questions}>{t.questions.map((q) => <li key={q}>{q}</li>)}</ul>
          </ContentSection>
        ) : null}
        <ContentSection id="philosophers" title={d.category.philosophers} count={c.philosophers.length}>
          {c.philosophers.length ? <RefGrid refs={c.philosophers} locale={locale} columns={2} /> : <EmptyNote>{d.content.empty}</EmptyNote>}
        </ContentSection>
        <ContentSection id="concepts" title={format(d.category.conceptCount, { count: c.concepts.length })}>
          {c.concepts.length ? <RefGrid refs={c.concepts} locale={locale} /> : <EmptyNote>{d.content.empty}</EmptyNote>}
        </ContentSection>
        {c.schools.length > 0 && <ContentSection id="schools" title={d.category.schools} count={c.schools.length}><RefGrid refs={c.schools} locale={locale} /></ContentSection>}
        {c.periods.length > 0 && <ContentSection id="periods" title={d.category.periods}><Timeline locale={locale} d={d} periods={periods.filter((p) => ids.has(p.id))} variant="strip" /></ContentSection>}
        {c.works.length > 0 && <ContentSection id="works" title={d.category.works} count={c.works.length}><RefGrid refs={c.works} locale={locale} columns={2} /></ContentSection>}
        <ContentSection id="languages" title={d.concept.otherLanguages}><OtherLanguages entity={c} kind="categories" current={locale} /></ContentSection>
      </ArticleLayout>
    </article>
  );
}
