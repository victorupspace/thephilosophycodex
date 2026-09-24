import Link from "next/link";
import type { PhilosopherDetail } from "@/lib/domain/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { href } from "@/lib/i18n/routes";
import { breadcrumbJsonLd, philosopherJsonLd } from "@/lib/seo/json-ld";
import { formatDate, formatYear } from "@/lib/utils/dates";
import { getRepository } from "@/lib/data";
import { JsonLd } from "@/components/content/JsonLd";
import { PageHeader } from "@/components/content/PageHeader";
import { ArticleLayout, ContentSection, EmptyNote, RailBlock } from "@/components/content/Section";
import { FallbackNotice, PendingNotice } from "@/components/content/Notices";
import { RichText } from "@/components/content/RichText";
import { RefGrid, RefTags } from "@/components/content/RefGrid";
import { Badge, CitationList, Tag, TagList } from "@/components/ui";
import { Timeline } from "@/components/timeline/Timeline";
import { OtherLanguages } from "./OtherLanguages";
import { ViewTracker } from "./ViewTracker";
import styles from "./Entity.module.css";

export async function PhilosopherPage({ locale, d, p }: { locale: Locale; d: Dictionary; p: PhilosopherDetail }) {
  const t = p.t;
  const hue = p.categories[0]?.hue ?? 20;
  const periods = await getRepository().listPeriods(locale);
  const crumbs = [{ label: d.nav.home, href: href(locale) }, { label: d.philosopher.indexTitle, href: href(locale, "philosophers") }, { label: t.title }];
  const sections = [
    { id: "biography", label: d.philosopher.biography, show: true },
    { id: "ideas", label: d.philosopher.keyIdeas, show: !!t.keyIdeas?.length },
    { id: "concepts", label: d.philosopher.concepts, show: p.concepts.length > 0 },
    { id: "works", label: d.philosopher.works, show: p.works.length > 0 },
    { id: "influences", label: d.philosopher.influences, show: p.influencedBy.length + p.influenced.length > 0 },
    { id: "timeline", label: d.philosopher.timeline, show: true },
    { id: "languages", label: d.concept.otherLanguages, show: true },
    { id: "references", label: d.philosopher.references, show: p.sources.length > 0 },
  ].filter((s) => s.show);

  return (
    <article>
      <ViewTracker event="philosopher_viewed" locale={locale} id={p.id} slug={t.slug} />
      <JsonLd data={[philosopherJsonLd(p), breadcrumbJsonLd(crumbs.map((x) => ({ name: x.label, path: x.href ?? href(locale, "philosophers", t.slug) })))]} />
      <PageHeader
        size="entity"
        hue={hue}
        crumbs={crumbs}
        crumbsLabel={d.a11y.breadcrumb}
        eyebrow={
          <>
            <Badge variant="tint" hue={hue}>{d.entity.philosopher}</Badge>
            {p.period && <Badge variant="outline">{p.period.title}</Badge>}
            {p.isFallback && <Badge variant="gold">{p.resolvedLocale.toUpperCase()}</Badge>}
          </>
        }
        title={t.title}
        lead={t.summary}
        aside={
          <dl className={styles.facts}>
            <div className={styles.fact}><dt className="t-eyebrow">{d.philosopher.born}</dt><dd>{p.birthYear !== null ? formatYear(p.birthYear, locale, p.birthYearApprox) : d.philosopher.unknownDate}</dd></div>
            <div className={styles.fact}><dt className="t-eyebrow">{d.philosopher.died}</dt><dd>{p.deathYear !== null ? formatYear(p.deathYear, locale) : d.philosopher.unknownDate}</dd></div>
            {p.schools.length > 0 && (
              <div className={styles.fact}><dt className="t-eyebrow">{p.schools.length > 1 ? d.philosopher.schools : d.philosopher.school}</dt><dd>{p.schools.map((s, i) => <span key={s.id}>{i > 0 && ", "}<Link href={href(locale, "schools", s.slug)}>{s.title}</Link></span>)}</dd></div>
            )}
          </dl>
        }
      >
        {p.isFallback && <FallbackNotice locale={locale} resolved={p.resolvedLocale} d={d} />}
        {(t.areas?.length || p.categories.length) ? (
          <div>
            <p className="t-eyebrow" style={{ marginBottom: "var(--s-2)" }}>{d.philosopher.areas}</p>
            <div className={styles.contextual}>
              {p.categories.length ? <RefTags refs={p.categories} locale={locale} ariaLabel={d.philosopher.contextual} /> : <TagList>{t.areas?.map((a) => <li key={a}><Tag>{a}</Tag></li>)}</TagList>}
            </div>
          </div>
        ) : null}
      </PageHeader>

      <ArticleLayout
        rail={
          <>
            <RailBlock title={d.content.breadcrumb}>
              <ul className={styles.toc}>{sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>)}</ul>
            </RailBlock>
            {p.categories.length > 0 && (
              <RailBlock title={d.philosopher.contextual}>
                <ul>{p.categories.map((c) => <li key={c.id}><Link href={href(locale, "categories", c.slug)}>{c.title}</Link></li>)}</ul>
              </RailBlock>
            )}
            <RailBlock title={d.content.updated}><p className="t-meta">{formatDate(p.updatedAt, locale)}</p></RailBlock>
          </>
        }
      >
        <ContentSection id="biography" title={d.philosopher.biography}>
          {t.biography ? <RichText body={t.biography} /> : <PendingNotice d={d} />}
        </ContentSection>

        {t.keyIdeas?.length ? (
          <ContentSection id="ideas" title={d.philosopher.keyIdeas}>
            <ol className={styles.ideas}>{t.keyIdeas.map((k) => <li key={k}>{k}</li>)}</ol>
          </ContentSection>
        ) : null}

        {p.concepts.length > 0 && (
          <ContentSection id="concepts" title={d.philosopher.concepts} count={p.concepts.length}>
            <RefGrid refs={p.concepts} locale={locale} />
          </ContentSection>
        )}

        {p.works.length > 0 && (
          <ContentSection id="works" title={d.philosopher.works} count={p.works.length}>
            <RefGrid refs={p.works} locale={locale} columns={2} />
          </ContentSection>
        )}

        {(p.influencedBy.length + p.influenced.length > 0) && (
          <ContentSection id="influences" title={d.philosopher.influences}>
            <div className={styles.stack}>
              {p.influencedBy.length > 0 && <div><p className="t-eyebrow" style={{ marginBottom: "var(--s-3)" }}>{d.philosopher.influences}</p><RefGrid refs={p.influencedBy} locale={locale} columns={2} /></div>}
              {p.influenced.length > 0 && <div><p className="t-eyebrow" style={{ marginBottom: "var(--s-3)" }}>{d.philosopher.influenced}</p><RefGrid refs={p.influenced} locale={locale} columns={2} /></div>}
            </div>
          </ContentSection>
        )}

        <ContentSection id="timeline" title={d.philosopher.timeline}>
          <Timeline locale={locale} d={d} periods={periods} variant="strip" currentId={p.periodId} />
        </ContentSection>

        <ContentSection id="languages" title={d.concept.otherLanguages}>
          <OtherLanguages entity={p} kind="philosophers" current={locale} />
        </ContentSection>

        <ContentSection id="references" title={d.philosopher.references}>
          {p.sources.length ? <CitationList sources={p.sources} /> : <EmptyNote>{d.content.pending}</EmptyNote>}
        </ContentSection>
      </ArticleLayout>
    </article>
  );
}
