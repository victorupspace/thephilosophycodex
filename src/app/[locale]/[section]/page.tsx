import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { href, resolveSection, sectionRoutes, type SectionKind } from "@/lib/i18n/routes";
import { buildMetadata, sectionAlternates } from "@/lib/seo/metadata";
import { ConceptsIndex } from "@/components/pages/ConceptsIndex";
import { PhilosophersIndex } from "@/components/pages/PhilosophersIndex";
import { SchoolsIndex } from "@/components/pages/SchoolsIndex";
import { CategoriesIndex } from "@/components/pages/CategoriesIndex";
import { WorksIndex } from "@/components/pages/WorksIndex";
import { TimelinePage } from "@/components/pages/TimelinePage";
import { ExplorePage } from "@/components/pages/ExplorePage";
import { PlatformPage } from "@/components/pages/PlatformPage";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { locale: string; section: string };
type Props = { params: Promise<Params> };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const locale of locales) {
    for (const kind of Object.keys(sectionRoutes) as SectionKind[]) {
      if (kind === "search") continue; // dynamic by nature
      out.push({ locale, section: sectionRoutes[kind][locale] });
    }
  }
  return out;
}

function resolve(params: Params): { locale: Locale; kind: SectionKind } | null {
  if (!isLocale(params.locale)) return null;
  const kind = resolveSection(params.locale, params.section);
  return kind ? { locale: params.locale, kind } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const { locale, kind } = r;
  const d = getDictionary(locale);
  const meta: Record<SectionKind, { title: string; description: string }> = {
    concepts: { title: d.concept.indexTitle, description: d.concept.indexLead },
    philosophers: { title: d.philosopher.indexTitle, description: d.philosopher.indexLead },
    schools: { title: d.school.indexTitle, description: d.school.indexLead },
    categories: { title: d.category.indexTitle, description: d.category.indexLead },
    works: { title: d.work.indexTitle, description: d.work.indexLead },
    periods: { title: d.period.indexTitle, description: d.period.indexLead },
    explore: { title: d.explore.title, description: d.explore.lead },
    search: { title: d.search.pageTitle, description: d.search.hint },
    about: { title: d.pages.about.title, description: d.pages.about.lead },
    methodology: { title: d.pages.methodology.title, description: d.pages.methodology.lead },
    sources: { title: d.pages.sources.title, description: d.pages.sources.lead },
    contact: { title: d.pages.contact.title, description: d.pages.contact.lead },
  };
  return buildMetadata({ locale, ...meta[kind], path: href(locale, kind), alternates: sectionAlternates(kind), noIndex: kind === "search" });
}

export default async function SectionPage({ params }: Props) {
  const r = resolve(await params);
  if (!r) notFound();
  const { locale, kind } = r;
  const d = getDictionary(locale);

  switch (kind) {
    case "concepts": return <ConceptsIndex locale={locale} d={d} />;
    case "philosophers": return <PhilosophersIndex locale={locale} d={d} />;
    case "schools": return <SchoolsIndex locale={locale} d={d} />;
    case "categories": return <CategoriesIndex locale={locale} d={d} />;
    case "works": return <WorksIndex locale={locale} d={d} />;
    case "periods": return <TimelinePage locale={locale} d={d} />;
    case "explore": return <ExplorePage locale={locale} d={d} />;
    case "search": notFound(); // served by /[locale]/search-results through the proxy rewrite
    case "about": case "methodology": case "sources": case "contact":
      return <PlatformPage locale={locale} d={d} kind={kind} />;
  }
}
