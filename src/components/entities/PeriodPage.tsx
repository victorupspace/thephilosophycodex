import type { PeriodDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { formatSpan } from "@/lib/utils/dates";
import { getRepository } from "@/lib/data";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleLayout, ContentSection, EmptyNote, RailBlock } from "@/components/content/Section";
import { FallbackNotice } from "@/components/content/Notices";
import { RefGrid } from "@/components/content/RefGrid";
import { Badge } from "@/components/ui";
import { Timeline } from "@/components/timeline/Timeline";
import { OtherLanguages } from "./OtherLanguages";
import styles from "./Entity.module.css";

export async function PeriodPage({ locale, d, p }: { locale: Locale; d: Dictionary; p: PeriodDetail }) {
  const t = p.t;
  const periods = await getRepository().listPeriods(locale);
  const crumbs = [{ label: d.nav.home, href: href(locale) }, { label: d.period.indexTitle, href: href(locale, "periods") }, { label: t.title }];
  return (
    <article>
      <JsonLd data={breadcrumbJsonLd(crumbs.map((x) => ({ name: x.label, path: x.href ?? href(locale, "periods", t.slug) })))} />
      <PageHeader
        size="entity"
        hue={200}
        crumbs={crumbs}
        crumbsLabel={d.a11y.breadcrumb}
        eyebrow={<><Badge variant="tint" hue={200}>{d.entity.period}</Badge><Badge variant="outline">{formatSpan(p.startYear, p.endYear, locale, d.period.present)}</Badge>{p.isFallback && <Badge variant="gold">{p.resolvedLocale.toUpperCase()}</Badge>}</>}
        title={t.title}
        lead={t.summary}
      >
        {p.isFallback && <FallbackNotice locale={locale} resolved={p.resolvedLocale} d={d} />}
      </PageHeader>
      <div className="container" style={{ paddingTop: "var(--s-10)" }}>
        <Timeline locale={locale} d={d} periods={periods} variant="strip" currentId={p.id} />
      </div>
      <ArticleLayout
        rail={
          <RailBlock title={d.content.breadcrumb}>
            <ul className={styles.toc}>
              {t.events?.length ? <li><a href="#events">{d.period.events}</a></li> : null}
              <li><a href="#philosophers">{d.period.philosophers}</a></li>
              <li><a href="#schools">{d.period.schools}</a></li>
              <li><a href="#concepts">{d.period.concepts}</a></li>
              <li><a href="#works">{d.period.works}</a></li>
            </ul>
          </RailBlock>
        }
      >
        {t.events?.length ? (
          <ContentSection id="events" title={d.period.events}>
            <ol className={styles.ideas}>{t.events.map((e) => <li key={e}>{e}</li>)}</ol>
          </ContentSection>
        ) : null}
        <ContentSection id="philosophers" title={d.period.philosophers} count={p.philosophers.length}>
          {p.philosophers.length ? <RefGrid refs={p.philosophers} locale={locale} columns={2} /> : <EmptyNote>{d.content.empty}</EmptyNote>}
        </ContentSection>
        <ContentSection id="schools" title={d.period.schools} count={p.schools.length}>
          {p.schools.length ? <RefGrid refs={p.schools} locale={locale} /> : <EmptyNote>{d.content.empty}</EmptyNote>}
        </ContentSection>
        <ContentSection id="concepts" title={d.period.concepts} count={p.concepts.length}>
          {p.concepts.length ? <RefGrid refs={p.concepts} locale={locale} /> : <EmptyNote>{d.content.empty}</EmptyNote>}
        </ContentSection>
        <ContentSection id="works" title={d.period.works} count={p.works.length}>
          {p.works.length ? <RefGrid refs={p.works} locale={locale} columns={2} /> : <EmptyNote>{d.content.empty}</EmptyNote>}
        </ContentSection>
        <ContentSection id="languages" title={d.concept.otherLanguages}><OtherLanguages entity={p} kind="periods" current={locale} /></ContentSection>
      </ArticleLayout>
    </article>
  );
}
