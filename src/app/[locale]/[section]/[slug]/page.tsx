import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { href, isEntityKind, resolveSection, sectionRoutes, type EntityKind } from "@/lib/i18n/routes";
import { getRepository } from "@/lib/data";
import { buildMetadata, entityAlternates } from "@/lib/seo/metadata";
import { ConceptPage } from "@/components/entities/ConceptPage";
import { PhilosopherPage } from "@/components/entities/PhilosopherPage";
import { SchoolPage } from "@/components/entities/SchoolPage";
import { CategoryPage } from "@/components/entities/CategoryPage";
import { WorkPage } from "@/components/entities/WorkPage";
import { PeriodPage } from "@/components/entities/PeriodPage";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { locale: string; section: string; slug: string };
type Props = { params: Promise<Params> };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getRepository().listAllSlugs();
  return slugs.map((s) => ({ locale: s.locale, section: sectionRoutes[s.kind][s.locale], slug: s.slug }));
}

function resolve(params: Params): { locale: Locale; kind: EntityKind; slug: string } | null {
  if (!isLocale(params.locale)) return null;
  const kind = resolveSection(params.locale, params.section);
  if (!kind || !isEntityKind(kind)) return null;
  return { locale: params.locale, kind, slug: params.slug };
}

async function load(locale: Locale, kind: EntityKind, slug: string) {
  const repo = getRepository();
  switch (kind) {
    case "concepts": return { kind, entity: await repo.getConcept(locale, slug) } as const;
    case "philosophers": return { kind, entity: await repo.getPhilosopher(locale, slug) } as const;
    case "schools": return { kind, entity: await repo.getSchool(locale, slug) } as const;
    case "categories": return { kind, entity: await repo.getCategory(locale, slug) } as const;
    case "works": return { kind, entity: await repo.getWork(locale, slug) } as const;
    case "periods": return { kind, entity: await repo.getPeriod(locale, slug) } as const;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const { entity } = await load(r.locale, r.kind, r.slug);
  if (!entity) return {};
  const d = getDictionary(r.locale);
  const kindLabel = { concepts: d.entity.concept, philosophers: d.entity.philosopher, schools: d.entity.school, categories: d.entity.category, works: d.entity.work, periods: d.entity.period }[r.kind];
  const description = entity.t.seoDescription ?? ("definition" in entity.t && entity.t.definition ? entity.t.definition : entity.t.summary);
  return buildMetadata({
    locale: r.locale,
    title: entity.t.seoTitle ?? `${entity.t.title} — ${kindLabel}`,
    description,
    path: href(r.locale, r.kind, entity.t.slug),
    alternates: entityAlternates(r.kind, entity.alternates),
    type: "article",
  });
}

export default async function EntityPage({ params }: Props) {
  const r = resolve(await params);
  if (!r) notFound();
  const loaded = await load(r.locale, r.kind, r.slug);
  if (!loaded.entity) notFound();
  const d = getDictionary(r.locale);
  const { locale } = r;

  switch (loaded.kind) {
    case "concepts": return <ConceptPage locale={locale} d={d} c={loaded.entity} />;
    case "philosophers": return <PhilosopherPage locale={locale} d={d} p={loaded.entity} />;
    case "schools": return <SchoolPage locale={locale} d={d} s={loaded.entity} />;
    case "categories": return <CategoryPage locale={locale} d={d} c={loaded.entity} />;
    case "works": return <WorkPage locale={locale} d={d} w={loaded.entity} />;
    case "periods": return <PeriodPage locale={locale} d={d} p={loaded.entity} />;
  }
}
